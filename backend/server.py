from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import logging, os
from api.settings import settings_blueprint
from api.game import game_blueprint


app = Flask(__name__)
CORS(app)

app.config['DEBUG'] = True

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app.register_blueprint(settings_blueprint)
app.register_blueprint(game_blueprint)
dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'render_dist')

# Route to serve the `index.html`
@app.route('/')
def serve_index():
    return send_from_directory(dist_dir, 'index.html')

@app.route('/<path>')
def serve_pages(path):
    return send_from_directory(dist_dir, 'index.html')

# Route to serve other static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(dist_dir, path)

def main():
    port = 6969
    print(f"Starting server on port {port}")
    app.run(host='127.0.0.1', port=port, debug=True)

if __name__ == '__main__':
    main()