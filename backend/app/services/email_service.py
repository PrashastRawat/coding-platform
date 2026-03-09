import httpx
from backend.app.core.config import settings

async def send_otp_email(to_email: str, otp: str):
    html_content = f"""
    <div style="font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 32px; border-radius: 8px; max-width: 480px;">
        <h2 style="color: #569cd6;">CodePrep AI</h2>
        <p style="color: #969696;">// password reset request</p>
        <p>Your OTP code is:</p>
        <div style="background: #2d2d2d; border: 1px solid #3c3c3c; border-radius: 4px; padding: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; letter-spacing: 8px; color: #4ec9b0; font-weight: bold;">{otp}</span>
        </div>
        <p style="color: #969696; font-size: 12px;">This code expires in 10 minutes.</p>
        <p style="color: #969696; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
    """

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": "CodePrep AI <onboarding@resend.dev>",
                "to": [to_email],
                "subject": "Your password reset OTP",
                "html": html_content
            }
        )
        return response.status_code == 200