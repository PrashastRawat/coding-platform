from groq import Groq
from backend.app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def _call_groq(prompt: str) -> str:
    """Call Groq API and return text response."""
    if not settings.GROQ_API_KEY:
        return "AI service not configured. Please set GROQ_API_KEY in your .env file."

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI service error: {str(e)}"


def get_hint(problem_description: str, user_code: str) -> str:
    """Give a non-spoiler hint to help the user move forward."""
    prompt = f"""You are a coding tutor helping a student practice algorithms.

The student is stuck on this problem:
{problem_description}

Their current code:
{user_code}

Give them ONE helpful hint that points them in the right direction WITHOUT revealing the solution.
Be concise (2-3 sentences max). Focus on the logic or approach they should think about."""

    return _call_groq(prompt)


def get_code_feedback(problem_description: str, user_code: str, status: str) -> str:
    """Review submitted code and give feedback."""
    prompt = f"""You are a code reviewer helping a student improve their code.

Problem:
{problem_description}

Student's submitted code:
{user_code}

Submission result: {status}

Please provide:
1. What the student did well
2. What went wrong (if status is not 'accepted')
3. How to improve the code (time complexity, readability, edge cases)

Keep the feedback clear, encouraging, and under 150 words."""

    return _call_groq(prompt)


def explain_error(user_code: str, error_message: str) -> str:
    """Explain a runtime error in plain English."""
    prompt = f"""You are helping a beginner Python programmer understand an error.

Their code:
{user_code}

Error message:
{error_message}

Explain what this error means in simple terms (1-2 sentences) and suggest how to fix it."""

    return _call_groq(prompt)