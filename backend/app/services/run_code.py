import subprocess
import tempfile
import time


def run_code(code: str, input_data: str):

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
            timeout=3
        )

        runtime = round(time.time() - start, 4)

        return {
            "output": result.stdout,
            "error": result.stderr,
            "runtime": runtime
        }

    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Time Limit Exceeded",
            "runtime": None
        }