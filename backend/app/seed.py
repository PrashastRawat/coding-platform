"""
Seed script — run once to populate the database with 20 coding problems.
Usage: python seed.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.db.session import SessionLocal
from backend.app.db.models.problem import Problem, DifficultyLevel
from backend.app.db.models.testcase import TestCase
from backend.app.db.models.user import User
from backend.app.core.security import hash_password

# ── Problems Data ─────────────────────────────────────────────────────────────

PROBLEMS = [
    # ── ARRAYS ──────────────────────────────────────────────────────────────
    {
        "title": "Two Sum",
        "description": (
            "Given an array of integers `nums` and an integer `target`, "
            "return the indices of the two numbers that add up to `target`.\n\n"
            "You may assume that each input would have exactly one solution.\n\n"
            "Example:\n"
            "Input: nums = [2, 7, 11, 15], target = 9\n"
            "Output: [0, 1]\n\n"
            "Input format: First line is space-separated array, second line is target.\n"
            "Output format: Two space-separated indices."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("2 7 11 15\n9", "0 1"),
            ("3 2 4\n6", "1 2"),
            ("3 3\n6", "0 1"),
        ]
    },
    {
        "title": "Maximum Subarray",
        "description": (
            "Given an integer array `nums`, find the contiguous subarray "
            "which has the largest sum and return its sum.\n\n"
            "Example:\n"
            "Input: -2 1 -3 4 -1 2 1 -5 4\n"
            "Output: 6\n\n"
            "Input format: Space-separated integers.\n"
            "Output format: Single integer (maximum sum)."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("-2 1 -3 4 -1 2 1 -5 4", "6"),
            ("1", "1"),
            ("5 4 -1 7 8", "23"),
        ]
    },
    {
        "title": "Rotate Array",
        "description": (
            "Given an array, rotate it to the right by `k` steps.\n\n"
            "Example:\n"
            "Input:\n1 2 3 4 5 6 7\n3\n"
            "Output: 5 6 7 1 2 3 4\n\n"
            "Input format: First line is space-separated array, second line is k.\n"
            "Output format: Space-separated rotated array."
        ),
        "difficulty": DifficultyLevel.medium,
        "testcases": [
            ("1 2 3 4 5 6 7\n3", "5 6 7 1 2 3 4"),
            ("-1 -100 3 99\n2", "3 99 -1 -100"),
        ]
    },
    {
        "title": "Find Duplicate in Array",
        "description": (
            "Given an array of n+1 integers where each integer is between 1 and n, "
            "find the duplicate number.\n\n"
            "Example:\n"
            "Input: 1 3 4 2 2\n"
            "Output: 2\n\n"
            "Input format: Space-separated integers.\n"
            "Output format: The duplicate integer."
        ),
        "difficulty": DifficultyLevel.medium,
        "testcases": [
            ("1 3 4 2 2", "2"),
            ("3 1 3 4 2", "3"),
        ]
    },

    # ── STRINGS ─────────────────────────────────────────────────────────────
    {
        "title": "Reverse a String",
        "description": (
            "Given a string, return it reversed.\n\n"
            "Example:\n"
            "Input: hello\n"
            "Output: olleh\n\n"
            "Input format: A single string.\n"
            "Output format: The reversed string."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("hello", "olleh"),
            ("Hannah", "hannaH"),
            ("abcde", "edcba"),
        ]
    },
    {
        "title": "Valid Palindrome",
        "description": (
            "Given a string, determine if it is a palindrome considering only "
            "alphanumeric characters and ignoring case.\n\n"
            "Example:\n"
            "Input: A man a plan a canal Panama\n"
            "Output: True\n\n"
            "Input format: A single line string.\n"
            "Output format: True or False."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("A man a plan a canal Panama", "True"),
            ("race a car", "False"),
            ("Was it a car or a cat I saw", "True"),
        ]
    },
    {
        "title": "Longest Common Prefix",
        "description": (
            "Write a function to find the longest common prefix string amongst an array of strings.\n"
            "If there is no common prefix, return an empty string.\n\n"
            "Example:\n"
            "Input: flower flow flight\n"
            "Output: fl\n\n"
            "Input format: Space-separated words.\n"
            "Output format: The longest common prefix string."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("flower flow flight", "fl"),
            ("dog racecar car", ""),
            ("interview inter internal", "inter"),
        ]
    },
    {
        "title": "Count Vowels",
        "description": (
            "Given a string, count the number of vowels (a, e, i, o, u) — case insensitive.\n\n"
            "Example:\n"
            "Input: Hello World\n"
            "Output: 3\n\n"
            "Input format: A single string.\n"
            "Output format: Integer count of vowels."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("Hello World", "3"),
            ("aeiou", "5"),
            ("rhythm", "0"),
        ]
    },

    # ── MATH ────────────────────────────────────────────────────────────────
    {
        "title": "FizzBuzz",
        "description": (
            "Given a number n, print numbers from 1 to n. "
            "For multiples of 3 print Fizz, for multiples of 5 print Buzz, "
            "for multiples of both print FizzBuzz.\n\n"
            "Example:\n"
            "Input: 5\n"
            "Output:\n1\n2\nFizz\n4\nBuzz\n\n"
            "Input format: Single integer n.\n"
            "Output format: One value per line."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("5", "1\n2\nFizz\n4\nBuzz"),
            ("15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"),
        ]
    },
    {
        "title": "Power of Two",
        "description": (
            "Given an integer n, return True if it is a power of two, otherwise False.\n\n"
            "Example:\n"
            "Input: 16\n"
            "Output: True\n\n"
            "Input format: Single integer.\n"
            "Output format: True or False."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("1", "True"),
            ("16", "True"),
            ("3", "False"),
            ("0", "False"),
        ]
    },
    {
        "title": "Prime Numbers up to N",
        "description": (
            "Given a number n, print all prime numbers up to and including n.\n\n"
            "Example:\n"
            "Input: 10\n"
            "Output: 2 3 5 7\n\n"
            "Input format: Single integer n.\n"
            "Output format: Space-separated prime numbers."
        ),
        "difficulty": DifficultyLevel.medium,
        "testcases": [
            ("10", "2 3 5 7"),
            ("2", "2"),
            ("20", "2 3 5 7 11 13 17 19"),
        ]
    },
    {
        "title": "Factorial",
        "description": (
            "Given a non-negative integer n, return its factorial.\n\n"
            "Example:\n"
            "Input: 5\n"
            "Output: 120\n\n"
            "Input format: Single integer.\n"
            "Output format: Single integer."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("0", "1"),
            ("5", "120"),
            ("10", "3628800"),
        ]
    },

    # ── SORTING & SEARCHING ──────────────────────────────────────────────────
    {
        "title": "Binary Search",
        "description": (
            "Given a sorted array and a target, return the index of the target. "
            "Return -1 if not found.\n\n"
            "Example:\n"
            "Input:\n-1 0 3 5 9 12\n9\n"
            "Output: 4\n\n"
            "Input format: First line is space-separated sorted array, second line is target.\n"
            "Output format: Index of target or -1."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("-1 0 3 5 9 12\n9", "4"),
            ("-1 0 3 5 9 12\n2", "-1"),
            ("5\n5", "0"),
        ]
    },
    {
        "title": "Sort an Array",
        "description": (
            "Given an array of integers, return it sorted in ascending order "
            "without using built-in sort.\n\n"
            "Example:\n"
            "Input: 5 2 3 1\n"
            "Output: 1 2 3 5\n\n"
            "Input format: Space-separated integers.\n"
            "Output format: Space-separated sorted integers."
        ),
        "difficulty": DifficultyLevel.medium,
        "testcases": [
            ("5 2 3 1", "1 2 3 5"),
            ("5 1 1 2 0 0", "0 0 1 1 2 5"),
        ]
    },

    # ── RECURSION ────────────────────────────────────────────────────────────
    {
        "title": "Fibonacci Number",
        "description": (
            "Given n, return the nth Fibonacci number (0-indexed).\n"
            "F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)\n\n"
            "Example:\n"
            "Input: 6\n"
            "Output: 8\n\n"
            "Input format: Single integer n.\n"
            "Output format: Single integer."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("0", "0"),
            ("1", "1"),
            ("6", "8"),
            ("10", "55"),
        ]
    },
    {
        "title": "Sum of Digits",
        "description": (
            "Given a non-negative integer, find the sum of its digits using recursion.\n\n"
            "Example:\n"
            "Input: 1234\n"
            "Output: 10\n\n"
            "Input format: Single integer.\n"
            "Output format: Single integer."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("1234", "10"),
            ("0", "0"),
            ("9999", "36"),
        ]
    },

    # ── DYNAMIC PROGRAMMING ──────────────────────────────────────────────────
    {
        "title": "Climbing Stairs",
        "description": (
            "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. "
            "In how many distinct ways can you climb to the top?\n\n"
            "Example:\n"
            "Input: 3\n"
            "Output: 3\n"
            "(1+1+1, 1+2, 2+1)\n\n"
            "Input format: Single integer n.\n"
            "Output format: Single integer."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("1", "1"),
            ("2", "2"),
            ("3", "3"),
            ("5", "8"),
        ]
    },
    {
        "title": "Coin Change",
        "description": (
            "Given an array of coin denominations and a total amount, "
            "find the minimum number of coins needed to make the amount. "
            "Return -1 if it cannot be made.\n\n"
            "Example:\n"
            "Input:\n1 5 6 9\n11\n"
            "Output: 2\n\n"
            "Input format: First line is space-separated coin denominations, second line is amount.\n"
            "Output format: Minimum coins or -1."
        ),
        "difficulty": DifficultyLevel.hard,
        "testcases": [
            ("1 5 6 9\n11", "2"),
            ("2\n3", "-1"),
            ("1 2 5\n11", "3"),
        ]
    },

    # ── LINKED LISTS ────────────────────────────────────────────────────────
    {
        "title": "Reverse a Linked List",
        "description": (
            "Given the head of a singly linked list represented as space-separated values, "
            "return the reversed list.\n\n"
            "Example:\n"
            "Input: 1 2 3 4 5\n"
            "Output: 5 4 3 2 1\n\n"
            "Input format: Space-separated node values.\n"
            "Output format: Space-separated reversed values."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("1 2 3 4 5", "5 4 3 2 1"),
            ("1 2", "2 1"),
            ("1", "1"),
        ]
    },
    {
        "title": "Find Middle of Linked List",
        "description": (
            "Given a linked list represented as space-separated values, "
            "return the middle node's value. If there are two middle nodes, return the second one.\n\n"
            "Example:\n"
            "Input: 1 2 3 4 5\n"
            "Output: 3\n\n"
            "Input format: Space-separated node values.\n"
            "Output format: Middle node value."
        ),
        "difficulty": DifficultyLevel.easy,
        "testcases": [
            ("1 2 3 4 5", "3"),
            ("1 2 3 4 5 6", "4"),
            ("1", "1"),
        ]
    },
]


# ── Seed Function ─────────────────────────────────────────────────────────────

def seed():
    db = SessionLocal()

    try:
        # Create admin user if not exists
        admin = db.query(User).filter(User.email == "admin@codeprep.com").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@codeprep.com",
                hashed_password=hash_password("admin123"),
                is_admin=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("✅ Admin user created — email: admin@codeprep.com | password: admin123")
        else:
            print("ℹ️  Admin user already exists, skipping.")

        # Seed problems
        seeded = 0
        skipped = 0

        for p in PROBLEMS:
            existing = db.query(Problem).filter(Problem.title == p["title"]).first()
            if existing:
                skipped += 1
                continue

            problem = Problem(
                title=p["title"],
                description=p["description"],
                difficulty=p["difficulty"],
                created_by=admin.id
            )
            db.add(problem)
            db.commit()
            db.refresh(problem)

            for input_data, expected_output in p["testcases"]:
                tc = TestCase(
                    problem_id=problem.id,
                    input_data=input_data,
                    expected_output=expected_output,
                    is_hidden=False
                )
                db.add(tc)

            db.commit()
            seeded += 1
            print(f"  ✅ Added: {p['title']} [{p['difficulty'].value}]")

        print(f"\n🎉 Done! {seeded} problems seeded, {skipped} skipped (already exist).")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()