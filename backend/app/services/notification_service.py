from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import asyncio

import httpx
from app.config import settings


class NotificationService:

    KLAVIYO_BASE = "https://a.klaviyo.com/api"

    # ── Email via Google ────────────────────────────────────────────
    async def send_email(self, to_email: str, template_id: str, props: dict):
        """
        Sends an email using Google SMTP.
        Uses asyncio.to_thread to run synchronous smtplib in a separate thread.
        """
        try:
            # 1. Prepare the email metadata
            subject = template_id.replace("_", " ").title()
            
            # 2. Simple Template Rendering 
            # (In production, consider using Jinja2 for complex templates)
            html_content = self._render_simple_template(template_id, props)

            # 3. Construct the MIME message
            msg = MIMEMultipart()
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(html_content, "html"))

            # 4. Synchronous sending function
            def _send_sync():
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                    server.starttls()  # Upgrade to secure connection
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    server.send_message(msg)

            # 5. Execute in thread pool to avoid blocking FastAPI
            await asyncio.to_thread(_send_sync)
            
        except Exception as e:
            # Log failure but don't crash the request (notifications are usually side-effects)
            print(f"[NotificationService] SMTP Error: {e}")

    def _render_simple_template(self, template_id: str, props: dict) -> str:
        """Basic fallback HTML generator"""
        if template_id == "order_confirmed":
            return f"<h1>Order Confirmed!</h1><p>Hi {props.get('first_name')}, your order #{props.get('order_number')} is being processed.</p>"
        elif template_id == "email_verification":
            return f"<h1>Verify Email</h1><p>Your token: <strong>{props.get('verification_token')}</strong></p>"
        
        return f"<p>Notification: {template_id}</p><pre>{props}</pre>"


    # ── Email via Klaviyo ────────────────────────────────────────────
    # async def send_email(self, to_email: str, template_id: str, props: dict):
    #     try:
    #         async with httpx.AsyncClient(timeout=15) as client:
    #             await client.post(
    #                 f"{self.KLAVIYO_BASE}/events/",
    #                 headers={
    #                     "Authorization": f"Klaviyo-API-Key {settings.KLAVIYO_API_KEY}",
    #                     "Content-Type": "application/json",
    #                 },
    #                 json={
    #                     "data": {
    #                         "type": "event",
    #                         "attributes": {
    #                             "profile": {"$email": to_email},
    #                             "metric": {"name": template_id},
    #                             "properties": props,
    #                         },
    #                     }
    #                 },
    #             )
    #     except Exception as e:
    #         # Log but don't raise — notification failure must not break orders
    #         print(f"[NotificationService] Email send failed: {e}")

    # ── SMS via MSG91 ────────────────────────────────────────────────
    async def send_sms(self, phone: str, message: str):
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                await client.post(
                    "https://api.msg91.com/api/v5/flow/",
                    headers={
                        "authkey": settings.MSG91_AUTH_KEY,
                        "Content-Type": "application/json",
                    },
                    json={
                        "sender": settings.MSG91_SENDER_ID,
                        "mobiles": phone,
                        "message": message,
                    },
                )
        except Exception as e:
            print(f"[NotificationService] SMS send failed: {e}")

    # ── Common notification helpers ──────────────────────────────────
    async def order_confirmed(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="order_confirmed",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "total": str(order.total),
                "items": [
                    {"title": i.title, "qty": i.quantity, "price": str(i.unit_price)}
                    for i in order.items
                ],
            },
        )

    async def order_shipped(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="order_shipped",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "tracking_number": order.tracking_number,
                "tracking_url": order.tracking_url,
                "carrier": order.shipping_carrier,
            },
        )

    async def send_review_request(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="review_request",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "items": [
                    {"title": i.title, "product_id": str(i.product_id)}
                    for i in order.items
                ],
            },
        )

    async def send_verification_email(self, email: str, name: str, token: str):
        await self.send_email(
            to_email=email,
            template_id="email_verification",
            props={"first_name": name, "verification_token": token},
        )

    async def send_password_reset_email(self, email: str, name: str, token: str):
        await self.send_email(
            to_email=email,
            template_id="password_reset",
            props={"first_name": name, "reset_token": token},
        )
