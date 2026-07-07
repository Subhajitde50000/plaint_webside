import hmac
import hashlib

try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    RAZORPAY_AVAILABLE = False

from app.config import settings


class PaymentService:
    def __init__(self):
        if RAZORPAY_AVAILABLE:
            self.client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        else:
            self.client = None

    def create_razorpay_order(self, amount_paise: int, receipt: str) -> dict:
        if not self.client:
            raise RuntimeError("Razorpay client not initialized. Install razorpay package.")
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
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    def create_refund(
        self, payment_id: str, amount_paise: int, notes: dict = {}
    ) -> dict:
        if not self.client:
            raise RuntimeError("Razorpay client not initialized.")
        return self.client.payment.refund(payment_id, {
            "amount": amount_paise,
            "notes": notes,
        })

    def capture_payment(self, payment_id: str, amount_paise: int) -> dict:
        if not self.client:
            raise RuntimeError("Razorpay client not initialized.")
        return self.client.payment.capture(payment_id, amount_paise)

    def fetch_payment(self, payment_id: str) -> dict:
        if not self.client:
            raise RuntimeError("Razorpay client not initialized.")
        return self.client.payment.fetch(payment_id)
