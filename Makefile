# =============================================================================
# Gomoku Project Makefile
# =============================================================================
# Cross-platform build system for Gomoku game
# Supports: macOS, Linux, Windows (with WSL/Git Bash)
# =============================================================================

# =============================================================================
# Configuration Variables
# =============================================================================

# Project Information
PROJECT_NAME := Gomoku
VERSION := 1.0.0
PYTHON_VERSION := 3.8

# Directories (must come first as other variables depend on them)
BACKEND_DIR := backend
FRONTEND_DIR := render
VENV_DIR := Gomoku-env
DIST_DIR := .
BUILD_DIR := $(BACKEND_DIR)/build
RENDER_DIST := $(BACKEND_DIR)/render_dist

# Tool Detection
PYTHON := $(shell command -v python3 2> /dev/null || command -v python 2> /dev/null)
PIP := $(shell command -v pip3 2> /dev/null || command -v pip 2> /dev/null)
NPM := $(shell command -v npm 2> /dev/null)

# Platform Detection
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
    PLATFORM := linux
    EXECUTABLE_EXT :=
endif
ifeq ($(UNAME_S),Darwin)
    PLATFORM := macos
    EXECUTABLE_EXT :=
endif
ifeq ($(OS),Windows_NT)
    PLATFORM := windows
    EXECUTABLE_EXT := .exe
endif

# Virtual Environment Activation
# Cross-platform virtual environment activation
ifeq ($(PLATFORM),windows)
    VENV_ACTIVATE := $(VENV_DIR)/Scripts/activate
    VENV_PYTHON := $(VENV_DIR)/Scripts/python
    VENV_PIP := $(VENV_DIR)/Scripts/pip
    VENV_PYINSTALLER := $(VENV_DIR)/Scripts/pyinstaller
    VENV_ACTIVATE_CMD := $(VENV_ACTIVATE) &&
else
    VENV_ACTIVATE := $(VENV_DIR)/bin/activate
    VENV_PYTHON := $(VENV_DIR)/bin/python
    VENV_PIP := $(VENV_DIR)/bin/pip
    VENV_PYINSTALLER := $(VENV_DIR)/bin/pyinstaller
    VENV_ACTIVATE_CMD := source $(VENV_ACTIVATE) &&
endif

# Executable Names
EXECUTABLE := $(PROJECT_NAME)$(EXECUTABLE_EXT)

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# =============================================================================
# Phony Targets
# =============================================================================
.PHONY: all build install clean fclean re help check-deps check-venv activate dev test format lint
.PHONY: install-backend install-frontend build-backend build-frontend
.PHONY: env start stop status debug version

# =============================================================================
# Default Target
# =============================================================================
all: help

# =============================================================================
# Help Target
# =============================================================================
help: ## Show this help message
	@echo "$(BLUE)$(PROJECT_NAME) Build System$(NC)"
	@echo "$(BLUE)Version: $(VERSION)$(NC)"
	@echo "$(BLUE)Platform: $(PLATFORM)$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make env            # Create global virtual environment"
	@echo "  make build          # Build the entire project"
	@echo "  make start          # Build and run the game"
	@echo "  make dev            # Run in development mode"
	@echo "  make clean          # Clean build artifacts"

# =============================================================================
# Dependency Checking
# =============================================================================
check-deps: ## Check if all required dependencies are installed
	@echo "$(BLUE)Checking dependencies...$(NC)"
	@if [ -z "$(PYTHON)" ]; then \
		echo "$(RED)Error: Python not found. Please install Python $(PYTHON_VERSION)+$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(PIP)" ]; then \
		echo "$(RED)Error: pip not found. Please install pip$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(NPM)" ]; then \
		echo "$(RED)Error: npm not found. Please install Node.js and npm$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)All dependencies found$(NC)"

# =============================================================================
# Environment Setup
# =============================================================================
env: check-deps ## Create Python virtual environment
	@echo "$(BLUE)Setting up global Python virtual environment...$(NC)"
	@echo "$(YELLOW)Debug: VENV_DIR = $(VENV_DIR)$(NC)"
	@echo "$(YELLOW)Debug: VENV_PYTHON = $(VENV_PYTHON)$(NC)"
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "$(BLUE)Creating global virtual environment...$(NC)"; \
		$(PYTHON) -m venv $(VENV_DIR); \
		echo "$(GREEN)Global virtual environment created$(NC)"; \
	else \
		echo "$(YELLOW)Global virtual environment already exists$(NC)"; \
	fi
	@if [ -f "$(VENV_PYTHON)" ]; then \
		echo "$(BLUE)Activating virtual environment and upgrading pip...$(NC)"; \
		$(VENV_ACTIVATE_CMD) python -m pip install --upgrade pip; \
		echo "$(BLUE)Installing wheel and setuptools...$(NC)"; \
		$(VENV_ACTIVATE_CMD) pip install wheel setuptools; \
		echo "$(GREEN)Global environment setup complete$(NC)"; \
	else \
		echo "$(RED)Error: Virtual environment Python not found at $(VENV_PYTHON)$(NC)"; \
		echo "$(YELLOW)Please check if virtual environment was created correctly$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Global virtual environment is ready at: $(VENV_DIR)$(NC)"

# Virtual Environment Activation Check
check-venv: ## Check if virtual environment exists and is activated
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "$(RED)Error: Virtual environment not found. Run 'make env' first$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(VENV_ACTIVATE)" ]; then \
		echo "$(RED)Error: Virtual environment activation script not found$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(VENV_PYTHON)" ]; then \
		echo "$(RED)Error: Virtual environment Python not found$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Virtual environment is ready$(NC)"

# Activate Virtual Environment (for manual use)
activate: check-venv ## Show how to manually activate global virtual environment
	@echo "$(BLUE)To manually activate the global virtual environment, run:$(NC)"
	@echo "$(YELLOW)  $(VENV_ACTIVATE_CMD) bash$(NC)"
	@echo "$(BLUE)Or for one-time activation:$(NC)"
	@echo "$(YELLOW)  $(VENV_ACTIVATE_CMD) your_command$(NC)"
	@echo "$(BLUE)To deactivate, simply run:$(NC)"
	@echo "$(YELLOW)  deactivate$(NC)"

# =============================================================================
# Installation Targets
# =============================================================================
install: install-backend install-frontend ## Install all dependencies

install-backend: env check-venv ## Install backend dependencies
	@echo "$(BLUE)Installing backend dependencies in global virtual environment...$(NC)"
	@$(VENV_ACTIVATE_CMD) pip install -r $(BACKEND_DIR)/requirements.txt
	@echo "$(BLUE)Installing PyInstaller in global virtual environment...$(NC)"
	@$(VENV_ACTIVATE_CMD) pip install pyinstaller
	@echo "$(GREEN)Backend dependencies installed in global virtual environment$(NC)"

install-frontend: ## Install frontend dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) install
	@echo "$(GREEN)Frontend dependencies installed$(NC)"

# =============================================================================
# Build Targets
# =============================================================================
build: install build-frontend build-backend ## Build the entire project
	@echo "$(GREEN)Building frontend and backend completed$(NC)"

build-frontend: ## Build frontend
	@echo "$(BLUE)Building frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run build
	@echo "$(BLUE)Copying dist folder to backend/render_dist$(NC)"
	@rm -rf $(RENDER_DIST)
	@cp -rf $(FRONTEND_DIR)/dist $(RENDER_DIST)
	@echo "$(GREEN)Frontend build completed$(NC)"

build-backend: check-venv ## Build backend executable
	@echo "$(BLUE)Building backend with global virtual environment...$(NC)"
	@if [ ! -d "$(RENDER_DIST)" ]; then \
		echo "$(RED)Error: Frontend not built. Run 'make build-frontend' first$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(VENV_PYINSTALLER)" ]; then \
		echo "$(RED)Error: PyInstaller not found in global virtual environment$(NC)"; \
		echo "$(YELLOW)Run 'make install-backend' to install PyInstaller$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Activating global virtual environment and building...$(NC)"
	@cd $(BACKEND_DIR) && \
		$(VENV_ACTIVATE_CMD) pyinstaller \
		--onedir \
		--distpath .. \
		--name $(PROJECT_NAME) \
		--add-data "render_dist:render_dist" \
		--add-data "api:api" \
		--add-data "srcs:srcs" \
		--hidden-import=numpy \
		--hidden-import=flask \
		--hidden-import=flask_cors \
		--hidden-import=numpy.linalg \
		--hidden-import=numpy.linalg._umath_linalg \
		--hidden-import=hashlib \
		--hidden-import=ssl \
		--hidden-import=_scproxy \
		--collect-all=numpy \
		--collect-all=flask \
		--collect-all=werkzeug \
		--collect-binaries=ssl \
		--collect-binaries=cryptography \
		--paths=. \
		server.py
	@echo "$(GREEN)Backend build completed$(NC)"

# =============================================================================
# Development Targets
# =============================================================================
dev: install check-venv ## Run in development mode
	@echo "$(BLUE)Starting development server with global virtual environment...$(NC)"
	@echo "$(YELLOW)Backend will run on http://localhost:5000$(NC)"
	@echo "$(YELLOW)Frontend will run on http://localhost:3000$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	@trap 'kill %1; kill %2' INT; \
		cd $(BACKEND_DIR) && $(VENV_ACTIVATE_CMD) python server.py & \
		cd $(FRONTEND_DIR) && $(NPM) run dev & \
		wait

# =============================================================================
# Execution Targets
# =============================================================================
start: build ## Build and start the game
	@echo "$(BLUE)Starting $(PROJECT_NAME)...$(NC)"
	@if [ ! -d "$(PROJECT_NAME)" ]; then \
		echo "$(RED)Error: Build directory not found. Run 'make build' first$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(PROJECT_NAME)/$(EXECUTABLE)" ]; then \
		echo "$(RED)Error: Executable not found in $(PROJECT_NAME)/$(EXECUTABLE). Run 'make build' first$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Game starting...$(NC)"
	@cd $(PROJECT_NAME) && ./$(EXECUTABLE)

# =============================================================================
# Testing Targets
# =============================================================================
test: ## Run tests (placeholder for future implementation)
	@echo "$(BLUE)Running tests...$(NC)"
	@echo "$(YELLOW)Tests not yet implemented$(NC)"

# =============================================================================
# Code Quality Targets
# =============================================================================
format: ## Format code (placeholder for future implementation)
	@echo "$(BLUE)Formatting code...$(NC)"
	@echo "$(YELLOW)Code formatting not yet implemented$(NC)"

lint: ## Lint code (placeholder for future implementation)
	@echo "$(BLUE)Linting code...$(NC)"
	@echo "$(YELLOW)Code linting not yet implemented$(NC)"

# =============================================================================
# Cleanup Targets
# =============================================================================
clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	@echo "$(BLUE)Removing executable directory$(NC)"
	@rm -rf $(PROJECT_NAME)
	@echo "$(BLUE)Removing backend build files$(NC)"
	@rm -f $(BACKEND_DIR)/$(PROJECT_NAME).spec
	@rm -rf $(BUILD_DIR)
	@rm -rf $(RENDER_DIST)
	@echo "$(BLUE)Removing Python cache files$(NC)"
	@find $(BACKEND_DIR) -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	@find $(BACKEND_DIR) -name '*.pyc' -delete 2>/dev/null || true
	@echo "$(BLUE)Removing frontend build$(NC)"
	@rm -rf $(FRONTEND_DIR)/dist
	@echo "$(GREEN)Clean completed$(NC)"

fclean: clean ## Full clean (including global virtual environment)
	@echo "$(BLUE)Performing full clean...$(NC)"
	@echo "$(BLUE)Removing global virtual environment$(NC)"
	@rm -rf $(VENV_DIR)
	@echo "$(BLUE)Removing node modules$(NC)"
	@rm -rf $(FRONTEND_DIR)/node_modules
	@echo "$(GREEN)Full clean completed$(NC)"

re: fclean build ## Rebuild everything from scratch

# =============================================================================
# Utility Targets
# =============================================================================
debug: ## Show debug information about variables
	@echo "$(BLUE)Debug Information:$(NC)"
	@echo "  Platform: $(PLATFORM)"
	@echo "  UNAME_S: $(UNAME_S)"
	@echo "  OS: $(OS)"
	@echo "  BACKEND_DIR: $(BACKEND_DIR)"
	@echo "  VENV_DIR: $(VENV_DIR)"
	@echo "  VENV_ACTIVATE: $(VENV_ACTIVATE)"
	@echo "  VENV_ACTIVATE_CMD: $(VENV_ACTIVATE_CMD)"
	@echo "  VENV_PYTHON: $(VENV_PYTHON)"
	@echo "  VENV_PIP: $(VENV_PIP)"
	@echo "  VENV_PYINSTALLER: $(VENV_PYINSTALLER)"
	@echo "  PYTHON: $(PYTHON)"
	@echo "  PIP: $(PIP)"
	@echo "  NPM: $(NPM)"

status: ## Show project status
	@echo "$(BLUE)Project Status:$(NC)"
	@echo "  Platform: $(PLATFORM)"
	@echo "  Python: $(PYTHON)"
	@echo "  pip: $(PIP)"
	@echo "  npm: $(NPM)"
	@echo "  Global Virtual Environment: $(if $(wildcard $(VENV_DIR)),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "  Global VENV Python: $(if $(wildcard $(VENV_PYTHON)),$(GREEN)Available$(NC),$(RED)Missing$(NC))"
	@echo "  Global VENV pip: $(if $(wildcard $(VENV_PIP)),$(GREEN)Available$(NC),$(RED)Missing$(NC))"
	@echo "  Global VENV PyInstaller: $(if $(wildcard $(VENV_PYINSTALLER)),$(GREEN)Available$(NC),$(RED)Missing$(NC))"
	@echo "  Executable: $(if $(wildcard $(PROJECT_NAME)/$(EXECUTABLE)),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "  Frontend Build: $(if $(wildcard $(RENDER_DIST)),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"

stop: ## Stop any running processes
	@echo "$(BLUE)Stopping processes...$(NC)"
	@pkill -f "python.*server.py" 2>/dev/null || true
	@pkill -f "npm.*dev" 2>/dev/null || true
	@echo "$(GREEN)Processes stopped$(NC)"

# =============================================================================
# Version Information
# =============================================================================
version: ## Show version information
	@echo "$(BLUE)$(PROJECT_NAME) Version $(VERSION)$(NC)"
	@echo "Platform: $(PLATFORM)"
	@echo "Python: $(PYTHON)"
	@echo "Node.js: $(shell node --version 2>/dev/null || echo 'Not installed')"
	@echo "npm: $(shell npm --version 2>/dev/null || echo 'Not installed')"