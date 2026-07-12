import httpx
from app.config import settings

class NotificationService:

    # ── Klaviyo (email) ──────────────────────────────────────────────
    KLAVIYO_BASE = "https://a.klaviyo.com/api"

    async def send_email(self, to_email: str, template_id: str, props: dict):
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{self.KLAVIYO_BASE}/events/",
                headers={
                    "Authorization": f"Klaviyo-API-Key {settings.KLAVIYO_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "data": {
                        "type": "event",
                        "attributes": {
                            "profile": {"$email": to_email},
                            "metric": {"name": template_id},
                            "properties": props,
                        }
                    }
                }
            )

    # ── MSG91 (SMS) ───────────────────────────────────────────────────
    async def send_sms(self, phone: str, message: str):
        async with httpx.AsyncClient() as client:
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
                }
            )

    # ── Common notification methods ───────────────────────────────────
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
            }
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
            }
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
            }
        )