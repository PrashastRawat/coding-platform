import subprocess
import tempfile
import time
import os

BLOCKED_IMPORTS = [
    "os", "sys", "subprocess", "shutil", "pathlib",
    "socket", "requests", "urllib", "http", "ftplib",
    "importlib", "ctypes", "multiprocessing", "threading",
    "pickle", "shelve", "eval", "exec", "open",
    "__import__", "builtins"
]

def is_code_safe(code: str) -> tuple[bool, str]:
    code_lower = code.lower()
    for keyword in BLOCKED_IMPORTS:
        if f"import {keyword}" in code_lower or f"from {keyword}" in code_lower:
            return False, f"Use of '{keyword}' is not allowed"
        if keyword in ["eval", "exec", "__import__", "open"] and keyword + "(" in code_lower:
            return False, f"Use of '{keyword}()' is not allowed"
    return True, ""

def run_code(code: str, input_data: str):
    safe, reason = is_code_safe(code)
    if not safe:
        return {
            "output": "",
            "error": f"Security Error: {reason}",
            "runtime": None
        }

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
            f.write(code.encode())
            file_name = f.name

        start = time.time()

        result = subprocess.run(
            ["python", file_name],
            input=input_data,
            text=True,
            capture_output=True,
            timeout=3,
            env={"PATH": "/usr/bin:/usr/local/bin"}
        )

        runtime = round(time.time() - start, 4)
        os.unlink(file_name)

        return {
            "output": result.stdout,
            "error": result.stderr,
            "runtime": runtime
        }

    except subprocess.TimeoutExpired:
        os.unlink(file_name)
        return {
            "output": "",
            "error": "Time Limit Exceeded",
            "runtime": None
        }