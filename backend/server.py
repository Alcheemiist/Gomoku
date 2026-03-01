from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import logging, os, socket, time, sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Also add the project root to the path for srcs imports
project_root = os.path.dirname(backend_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

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
    if not os.path.isdir(dist_dir) or not os.path.isfile(os.path.join(dist_dir, 'index.html')):
        return jsonify({"error": "Frontend not built. Run 'make build-frontend' or 'make build'."}), 503
    return send_from_directory(dist_dir, 'index.html')

# Route to serve other static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static_files(path):
    if not os.path.isdir(dist_dir):
        return jsonify({"error": "Frontend not built."}), 503
    return send_from_directory(dist_dir, path)

# Shutdown endpoint
@app.route('/api/shutdown', methods=['POST'])
def shutdown():
    """Gracefully shutdown the server"""
    def shutdown_server():
        os._exit(0)
    
    shutdown_server()
    return jsonify({"message": "Server shutting down..."})

def is_port_in_use(port):
    """Check if a port is in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('127.0.0.1', port))
            return False
        except OSError:
            return True

def kill_processes_on_port(port):
    """Kill processes using the specified port"""
    try:
        import subprocess
        result = subprocess.run(['lsof', '-ti', f':{port}'], 
                              capture_output=True, text=True)
        if result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                if pid:
                    subprocess.run(['kill', '-9', pid], capture_output=True)
                    print(f"Killed process {pid} on port {port}")
    except Exception as e:
        print(f"Error killing processes on port {port}: {e}")

def main():
    port = 6969
    
    # Check if port is in use and clean it up
    if is_port_in_use(port):
        print(f"Port {port} is in use, attempting to clean up...")
        kill_processes_on_port(port)
        time.sleep(2)  # Wait for cleanup
        
        # Check again after cleanup
        if is_port_in_use(port):
            print(f"Port {port} is still in use after cleanup. Please run 'make kill-port' manually.")
            return
    
    print(f"Starting server on port {port}")
    try:
        app.run(host='127.0.0.1', port=port, debug=False, use_reloader=False)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"Port {port} is still in use. Please run 'make kill-port' and try again.")
        else:
            print(f"Error starting server: {e}")
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == '__main__':
    main()