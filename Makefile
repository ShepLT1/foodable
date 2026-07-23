SHELL := /bin/bash

# Dynamically find the root directory of the git repo
ROOT_DIR := $(shell git rev-parse --show-toplevel 2>/dev/null)

.PHONY: help check check-backend check-frontend fix fix-backend fix-frontend

# Default target: list commands
help:
	@echo "Foodable Development Commands:"
	@echo "  make check           - Run all CI checks (Backend + Frontend)"
	@echo "  make check-backend   - Run Ruff, MyPy, and Pytest for backend"
	@echo "  make check-frontend  - Run Prettier, ESLint, TypeScript, and Vitest for frontend"
	@echo "  make fix             - Auto-format and fix linting issues across both projects"
	@echo "  make fix-backend     - Auto-fix backend formatting & linting (Ruff)"
	@echo "  make fix-frontend    - Auto-fix frontend formatting (Prettier)"

# ==============================================================================
# LOCAL CI CHECKS
# ==============================================================================

# Run ALL checks (Matches GitHub Actions CI)
check: check-backend check-frontend
	@echo -e "\n✅ All CI checks passed locally!"

# Backend checks
check-backend:
	@echo -e "\n🔍 Checking Backend..."
	cd $(ROOT_DIR)/backend && source .venv/bin/activate && ruff check . && ruff format --check . && mypy . && pytest --cov=app

# Frontend checks
check-frontend:
	@echo -e "\n🔍 Checking Frontend..."
	cd $(ROOT_DIR)/frontend && source $${NVM_DIR:-$$HOME/.nvm}/nvm.sh && nvm use && npm run format:check && npm run lint && npm run type-check && npx vitest run

# ==============================================================================
# AUTO-FIXERS
# ==============================================================================

# Run auto-formatters & linter auto-fixes
fix: fix-backend fix-frontend
	@echo -e "\n✨ Auto-fixes applied to both apps!"

fix-backend:
	@echo -e "\n🛠️ Auto-fixing Backend..."
	cd $(ROOT_DIR)/backend && source .venv/bin/activate && ruff check --fix . && ruff format .

fix-frontend:
	@echo -e "\n🛠️ Auto-fixing Frontend..."
	cd $(ROOT_DIR)/frontend && source $${NVM_DIR:-$$HOME/.nvm}/nvm.sh && nvm use && npm run format
