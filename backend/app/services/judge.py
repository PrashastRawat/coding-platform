import subprocess
import tempfile
import time
def run_python_code(code: str, input_data: str):

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
            f.write(code.encode())
            file_name = f.name

        start = time.time()

        result = subprocess.run(
            ["python3", file_name],
            input=input_data,
            text=True,
            capture_output=True,
            timeout=2
        )

        runtime = time.time() - start

        return {
            "output": result.stdout.strip(),
            "error": result.stderr,
            "runtime": runtime
        }

    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Time Limit Exceeded",
            "runtime": None
        }
    

def judge_submission(code, testcases):

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
            f.write(code.encode())
            file_name = f.name

        start = time.time()

        for tc in testcases:

            result = subprocess.run(
                ["python", file_name],
                input=tc.input_data,
                text=True,
                capture_output=True,
                timeout=2
            )

            output = result.stdout.strip()
            expected = tc.expected_output.strip()

            if output != expected:
                return "wrong_answer", 0

        runtime = round(time.time() - start, 4)

        return "accepted", runtime

    except subprocess.TimeoutExpired:
        return "time_limit_exceeded", 0

    except Exception:
        return "runtime_error", 0