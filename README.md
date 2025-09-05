# 🎯 Gomoku - Advanced AI-Powered Strategy Game

A sophisticated Gomoku (Five-in-a-Row) game featuring an intelligent AI opponent built with Python and React. This project showcases advanced game AI techniques including Minimax algorithm with alpha-beta pruning, heuristic evaluation, and performance optimizations.

![Gomoku Game](https://img.shields.io/badge/Game-Gomoku-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![AI](https://img.shields.io/badge/AI-Minimax%20%2B%20Alpha--Beta-orange)

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Make** (for build automation)

### One-Command Setup & Run
```bash
# Clone and navigate to the project
git clone <repository-url>
    cd Gomoku

# Build and run everything (first time)
make start
```

That's it! The game will be available at `http://localhost:6969`

### Development Mode
```bash
# Run in development mode (hot reload)
make dev
```

### Available Commands
```bash
make help          # Show all available commands
make check-deps    # Verify all dependencies
make build         # Build the entire project
make dev           # Run in development mode
make start         # Build and start the game
make clean         # Clean build artifacts
make status        # Check project status
```

## 🎮 Game Features

### Core Gameplay
- **Classic Gomoku Rules**: First to get 5 stones in a row wins
- **Stone Capture**: Capture opponent stones by surrounding them
- **Configurable Board**: 19x19 standard board size
- **Turn-based Play**: Alternating moves between players
- **Win Detection**: Automatic detection of winning conditions

### AI Features
- **Intelligent Opponent**: Advanced AI using Minimax algorithm
- **Alpha-Beta Pruning**: Optimized search tree traversal
- **Heuristic Evaluation**: Smart position scoring system
- **Configurable Difficulty**: Multiple AI difficulty levels
- **Performance Optimization**: Memoization for faster decisions
- **Move Ordering**: Efficient move prioritization

### User Interface
- **Modern React UI**: Clean, responsive interface
- **Real-time Updates**: Live game state synchronization
- **Interactive Board**: Click-to-play stone placement
- **Game History**: Move tracking and replay
- **Settings Panel**: Customizable game options

## 🏗️ Project Architecture

### Backend (Python)
```
backend/
├── api/                    # REST API endpoints
│   ├── game.py            # Game API routes
│   └── settings.py        # Settings API routes
├── srcs/
│   ├── ai/                # AI implementation
│   │   ├── Minimax.py     # Core Minimax algorithm
│   │   ├── heuristic_evaluation.py  # Position evaluation
│   │   └── ai_manager.py  # AI decision management
│   ├── game/              # Game logic
│   │   ├── board.py       # Board representation
│   │   ├── game_manager.py # Game state management
│   │   ├── player.py      # Player/AI classes
│   │   └── rules/         # Game rules implementation
│   └── settings/          # Configuration
└── server.py              # Flask server
```

### Frontend (React + TypeScript)
```
render/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript definitions
├── dist/                 # Built frontend
└── package.json          # Dependencies
```

## 🤖 AI Implementation Details

### Minimax Algorithm with Alpha-Beta Pruning
The AI uses a sophisticated Minimax algorithm enhanced with alpha-beta pruning for optimal performance:

```python
def minimax(board, board_array, depth, players, ai_player_index,
            maximizing_player=True, alpha=float('-inf'),
            beta=float('inf'), used_actions={}, memo={}):
    # Core Minimax implementation with alpha-beta pruning
    # Memoization for performance optimization
    # Move ordering for efficiency
```

### Heuristic Evaluation System
The AI evaluates board positions using a comprehensive scoring system:

- **Winning Conditions**: Immediate win detection (score: 1000)
- **Threat Assessment**: Near-win positions (score: 500)
- **Position Value**: Stone placement quality
- **Capture Potential**: Stone capture opportunities
- **Spatial Analysis**: Board control and territory

### Performance Optimizations
- **Memoization**: Caches evaluated board states
- **Move Ordering**: Prioritizes promising moves
- **Depth Limiting**: Configurable search depth
- **Early Termination**: Stops on winning/losing positions

## 🛠️ Development

### Backend Development
```bash
# Activate virtual environment
source Gomoku-env/bin/activate  # Linux/macOS
# or
Gomoku-env\Scripts\activate     # Windows

# Install dependencies
pip install -r backend/requirements.txt

# Run server
python backend/server.py
```

### Frontend Development
```bash
cd render
npm install
npm run dev
```

### Building for Production
```bash
# Build everything
make build

# The built application will be in the Gomoku/ directory
```

## 📋 Requirements

### System Requirements
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **Memory**: 512MB RAM minimum
- **Storage**: 100MB free space

### Dependencies
- **Backend**: Flask, NumPy, Flask-CORS, PyInstaller
- **Frontend**: React, TypeScript, Vite, Tailwind CSS

## 🎯 Game Rules

### Basic Rules
1. **Objective**: Get 5 stones in a row (horizontal, vertical, or diagonal)
2. **Turns**: Players alternate placing stones
3. **Captures**: Surround opponent stones to capture them
4. **Winning**: First to achieve 5-in-a-row wins

### AI Difficulty Levels
- **Easy**: Shallow search depth, basic heuristics
- **Medium**: Moderate depth, improved evaluation
- **Hard**: Deep search, advanced heuristics
- **Expert**: Maximum depth, optimal play

## 🔧 Configuration

### Game Settings
- **Board Size**: 19x19 (configurable)
- **Connect Number**: 5 stones to win
- **AI Difficulty**: Multiple levels available
- **Debug Mode**: Enhanced logging and visualization

### Server Settings
- **Port**: 6969 (configurable)
- **Host**: localhost
- **CORS**: Enabled for frontend communication

## 📊 Performance

### AI Performance
- **Search Depth**: Configurable (typically 3-6 levels)
- **Move Evaluation**: ~100-1000 positions per second
- **Memory Usage**: Optimized with memoization
- **Response Time**: <1 second for most moves

### System Performance
- **Memory**: ~50MB base usage
- **CPU**: Moderate during AI calculations
- **Network**: Minimal (local server)

## 🐛 Troubleshooting

### Common Issues
1. **Port 6969 in use**: Run `make check-port-6969` to free the port
2. **Dependencies missing**: Run `make check-deps` to verify installation
3. **Build failures**: Run `make clean` then `make build`
4. **AI not responding**: Check difficulty settings and game state

### Debug Mode
Enable debug mode for detailed logging:
```python
# In settings
debug_mode = True
```

## 📝 License

This project is part of the 42 curriculum and follows the 42 coding standards.

## 🤝 Contributing

This is an educational project. For improvements or bug reports, please create an issue.

## 📚 Additional Resources

- [Gomoku Rules](https://en.wikipedia.org/wiki/Gomoku)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Alpha-Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
- [Game Tree Search](https://en.wikipedia.org/wiki/Game_tree)

---

**Enjoy playing Gomoku against our intelligent AI opponent!** 🎮✨ 