"""AI checks: answers within the subject's 0.5 s average and blocks an open line.

Run from backend/:  python tests/check_ai.py
"""
import os
import sys
import logging

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
logging.disable(logging.CRITICAL)

from server import app

client = app.test_client()


def new_game(difficulty):
    client.post(f"/api/settings/difficulty/{difficulty}")
    client.post("/api/game/init", json={"isAI": False})


def play(x, y):
    return client.post("/api/game/move", json={"x": x, "y": y}).get_json().get("played")


def ai_move():
    move = client.get("/api/game/best_move").get_json()
    play(move["x"], move["y"])
    return move


def check_speed(difficulty):
    new_game(difficulty)
    times = []
    for x, y in [(9, 9), (10, 10), (8, 10), (11, 8), (7, 11), (12, 12)]:
        if play(x, y):
            times.append(ai_move()["thinking_time_seconds"])
    average = sum(times) / len(times)
    assert average < 0.5, f"{difficulty}: average {average:.3f}s per move"
    print(f"{difficulty:<6} average {average:.3f}s, slowest {max(times):.3f}s over {len(times)} moves")


def check_blocks_line(difficulty):
    new_game(difficulty)
    for y in range(5, 12):
        if not play(4, y):
            return
        move = ai_move()
        if move["x"] == 4:
            print(f"{difficulty:<6} blocked the line at (4, {move['y']})")
            return
    raise AssertionError(f"{difficulty}: AI never blocked a straight line")


if __name__ == "__main__":
    for level in ("easy", "medium", "hard"):
        check_speed(level)
        check_blocks_line(level)
    print("all AI checks passed")
