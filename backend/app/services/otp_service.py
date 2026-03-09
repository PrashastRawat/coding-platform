import random
import string
from datetime import datetime, timedelta
from typing import Optional

# In-memory OTP store: {email: {"otp": "123456", "expires_at": datetime}}
# For production, use Redis instead
otp_store: dict = {}

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

def store_otp(email: str, otp: str, expiry_minutes: int = 10):
    otp_store[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=expiry_minutes)
    }

def verify_otp(email: str, otp: str) -> tuple[bool, str]:
    record = otp_store.get(email)
    if not record:
        return False, "No OTP requested for this email"
    if datetime.utcnow() > record["expires_at"]:
        del otp_store[email]
        return False, "OTP has expired"
    if record["otp"] != otp:
        return False, "Invalid OTP"
    del otp_store[email]
    return True, "OK"