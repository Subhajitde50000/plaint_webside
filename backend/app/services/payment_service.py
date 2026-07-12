import razorpay
import hmac, hashlib
from app.config import settings

class PaymentService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    def create_razorpay_order(self, amount_paise: int, receipt: str) -> dict:
        return self.client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,
        })

    def verify_signature(
        self, order_id: str, payment_id: str, signature: str
    ) -> bool:
        body = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    def create_refund(self, payment_id: str, amount_paise: int, notes: dict = {}) -> dict:
        return self.client.payment.refund(payment_id, {
            "amount": amount_paise,
            "notes": notes,
        })

    def capture_payment(self, payment_id: str, amount_paise: int) -> dict:
        return self.client.payment.capture(payment_id, amount_paise)