from time import time, perf_counter
from srcs.ai.Minimax import minimax, MAX_SCORE, get_best_available_actions, SearchTimeout

# The subject asks for an answer in under 0.5 s on average; keep a margin for the API round trip.
TIME_BUDGET = 0.45
# Candidate moves searched per node, after tactical ordering.
BRANCHING = 10
MEMO_LIMIT = 200_000

class AI_manager():
    BLACK = 1
    DRAW = MAX_SCORE**2
    WHITE = -1 * BLACK
    ZERO = 0 * BLACK

    def __init__(self, difficulty, debug_mode=False) -> None:
        self._difficulty = difficulty
        self._debug_mode = debug_mode
        self._ai_isThinking = False
        self._memo = {}

    def get_depth(self):
        if self._difficulty == 1:
            return 3
        elif self._difficulty == 2:
            return 7
        elif self._difficulty == 3:
            return 11
        raise Exception("Difficulty level not supported")

    def get_best_move(self, board, players, current_player_index):
        self._board = board
        self._depth = self.get_depth()
        self._players = players
        current_time = time()

        if len(board._used_actions) == 0:
            center = self._board._size//2
            elapsed = time() - current_time
            return center, center, elapsed, 0, 0

        if not self._ai_isThinking:
            self._ai_isThinking = True
            # Iterative deepening: search depth 1, 2, ... up to the difficulty's cap and keep
            # the move from the deepest search that finished inside the time budget. Each
            # pass works on copies, so an aborted pass leaves no half-undone state behind.
            if len(self._memo) > MEMO_LIMIT:
                self._memo.clear()
            deadline = perf_counter() + TIME_BUDGET
            nodes_counter = [0]
            score, x, y, depth_reached = 0, None, None, 0
            for depth in range(1, self._depth + 1):
                players_clone = [player.clone() for player in players]
                try:
                    result = minimax(board, board._board.copy(), depth,
                                     players_clone, current_player_index,
                                     used_actions=board._used_actions.copy(),
                                     memo=self._memo, nodes_counter=nodes_counter,
                                     deadline=deadline, branching=BRANCHING)
                except SearchTimeout:
                    break
                if result[1] is not None:
                    score, x, y = result
                    depth_reached = depth
                if abs(score) >= MAX_SCORE:
                    break
            nodes_evaluated = nodes_counter[0]
            if x is None or y is None:
                actions = get_best_available_actions(board._board, board._used_actions, self.ZERO)
                if actions:
                    x, y = actions[0]
                else:
                    center = self._board._size // 2
                    x, y = center, center
            self._ai_isThinking = False
        else:
            raise Exception("AI is already thinking")

        elapsed = time() - current_time

        if self._debug_mode:
            print(f"[AI Debug] depth={depth_reached}/{self._depth} score={score} best_move=({x},{y}) nodes={nodes_evaluated} time={elapsed:.3f}s")
        else:
            print(f"Time to get best move:{elapsed:.2f}s")

        return x, y, elapsed, depth_reached, nodes_evaluated
