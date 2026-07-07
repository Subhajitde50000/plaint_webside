import httpx
from app.config import settings


class ShippingService:
    BASE_URL = "https://apiv2.shiprocket.in/v1/external"

    def __init__(self):
        self._token: str | None = None

    async def get_token(self) -> str:
        if self._token:
            return self._token
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(
                f"{self.BASE_URL}/auth/login",
                json={
                    "email": settings.SHIPROCKET_EMAIL,
                    "password": settings.SHIPROCKET_PASSWORD,
                },
            )
            r.raise_for_status()
            self._token = r.json()["token"]
        return self._token

    async def create_shipment(self, order) -> dict:
        token = await self.get_token()
        items = [
            {
                "name": item.title,
                "sku": item.sku,
                "units": item.quantity,
                "selling_price": str(item.unit_price),
            }
            for item in order.items
        ]
        payload = {
            "order_id": order.order_number,
            "order_date": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "pickup_location": "Primary",
            "billing_customer_name": order.user.first_name if order.user else "Guest",
            "billing_last_name": order.user.last_name if order.user else "",
            "billing_address": order.shipping_address.line1 if order.shipping_address else "",
            "billing_city": order.shipping_address.city if order.shipping_address else "",
            "billing_pincode": order.shipping_address.pincode if order.shipping_address else "",
            "billing_state": order.shipping_address.state if order.shipping_address else "",
            "billing_country": "India",
            "billing_email": order.user.email if order.user else order.guest_email or "",
            "billing_phone": order.shipping_address.phone if order.shipping_address else "",
            "shipping_is_billing": True,
            "order_items": items,
            "payment_method": "Prepaid",
            "sub_total": str(order.subtotal),
            "length": 30,
            "breadth": 30,
            "height": 20,
            "weight": 1.0,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(
                f"{self.BASE_URL}/orders/create/adhoc",
                json=payload,
                headers={"Authorization": f"Bearer {token}"},
            )
        return r.json()

    async def track_shipment(self, awb_code: str) -> dict:
        token = await self.get_token()
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.BASE_URL}/courier/track/awb/{awb_code}",
                headers={"Authorization": f"Bearer {token}"},
            )
        return r.json()

    async def cancel_shipment(self, shiprocket_order_ids: list) -> dict:
        token = await self.get_token()
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(
                f"{self.BASE_URL}/orders/cancel",
                json={"ids": shiprocket_order_ids},
                headers={"Authorization": f"Bearer {token}"},
            )
        return r.json()
