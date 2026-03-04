from flask import request, jsonify, Blueprint
from srcs.game.game_manager import game_manager
import api.settings as settings

game_manager_module = None
settings_module = settings.settings_module
game_blueprint = Blueprint('game', __name__)

@game_blueprint.route('/api/game/init', methods=['POST'])
def initilize_game():
    global game_manager_module
    try:
        data = request.get_json()
        if not data or 'isAI' not in data:
            return jsonify({"message": "Missing JSON body or 'isAI' field."}), 400
        game_manager_module = game_manager(settings_module, data["isAI"])
        return jsonify({"message": "success"})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/delete', methods=['POST'])
def delete_game():
    global game_manager_module
    try:
        game_manager_module = None
        return jsonify({"message": "success"})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/move', methods=['POST'])
def move():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        data = request.get_json()
        played = game_manager_module.play_turn(data["x"], data["y"])
        return jsonify({"played": played})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/board', methods=['GET'])
def get_board():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        return jsonify({"message": game_manager_module.board.tolist()})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/turns', methods=['GET'])
def get_turn():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        return jsonify({"message": game_manager_module.turn})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/currentPlayer', methods=['GET'])
def get_current_player():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        return jsonify({"message": game_manager_module.current_player_index})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/captured', methods=['GET'])
def get_peercaptured():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        player1_captured = game_manager_module.player1_captured
        player2_captured = game_manager_module.player2_captured
        return jsonify({"message": [player1_captured, player2_captured]})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/players_name', methods=['GET'])
def get_names():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        return jsonify({"message": [game_manager_module.player1_name, game_manager_module.player2_name]})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/best_move', methods=['GET'])
def get_best_moves():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        result = game_manager_module.best_move()
        x, y = result[0], result[1]
        thinking_time_seconds = result[2] if len(result) >= 3 else 0.0
        depth_used = result[3] if len(result) >= 5 else 0
        nodes_evaluated = result[4] if len(result) >= 5 else 0
        return jsonify({
            "x": x, "y": y,
            "thinking_time_seconds": thinking_time_seconds,
            "depth_used": depth_used,
            "nodes_evaluated": nodes_evaluated
        })
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@game_blueprint.route('/api/game/winner', methods=['GET'])
def get_winner_color():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        if game_manager_module.is_game_over:
            kwargs = {"winner_name": game_manager_module.winner_name}
            lp = game_manager_module.line_pos_win
            if lp and lp.get("x0") is not None and lp.get("y0") is not None and lp.get("x1") is not None and lp.get("y1") is not None:
                kwargs["winning_line"] = {
                    "start": [lp["y0"], lp["x0"]],
                    "end": [lp["y1"], lp["x1"]]
                }
            return jsonify({"message": kwargs})
        else:
            return jsonify({"message": None})
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
@game_blueprint.route('/api/game/ai_player', methods=['GET'])
def get_ai_index_player():
    global game_manager_module
    if game_manager_module is None:
        return jsonify({"message": "No game initialized. Call /api/game/init first."}), 400
    try:
        return jsonify({"message": game_manager_module.AI_Player})
    except Exception as e:
        return jsonify({"message": str(e)}), 400
