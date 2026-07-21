.PHONY: help check check-backend check-frontend fix fix-backend fix-frontend

# Default target: list commands
help:
	@echo "Foodable Development Commands:"
	@echo "  make check          - Run all CI checks (Backend + Frontend)"
	@echo "  make check-backend  - Run Ruff, MyPy, and Pytest for backend"
	@echo "  make check-frontend - Run Prettier, ESLint, TypeScript, and Vitest for frontend"
	@echo "  make fix            - Auto-format and fix linting issues across both projects"
	@echo "  make fix-backend    - Auto-fix backend formatting & linting (Ruff)"
	@echo "  make fix-frontend   - Auto-fix frontend formatting (Prettier)"

# ==============================================================================
# LOCAL CI CHECKS
# ==============================================================================

# Run ALL checks (Matches GitHub Actions CI)
check: check-backend check-frontend
	@echo "\n✅ All CI checks passed locally!"

# Backend checks
check-backend:
	@echo "\n🔍 Checking Backend..."
	cd backend && ruff check .
	cd backend && ruff format --check .
	cd backend && mypy .
	cd backend && pytest --cov=app

# Frontend checks
check-frontend:
	@echo "\n🔍 Checking Frontend..."
	cd frontend && npm run format:check
	cd frontend && npm run lint
	cd frontend && npm run type-check
	cd frontend && npx vitest run

# ==============================================================================
# AUTO-FIXERS
# ==============================================================================

# Run auto-formatters & linter auto-fixes
fix: fix-backend fix-frontend
	@echo "\n✨ Auto-fixes applied to both apps!"

fix-backend:
	@echo "\n🛠️ Auto-fixing Backend..."
	cd backend && ruff check --fix .
	cd backend && ruff format .

fix-frontend:
	@echo "\n🛠️ Auto-fixing Frontend..."
	cd frontend && npm run format

# ==============================================================================
# ALTERNATIVE: PRE-COMMIT HOOKS
# ==============================================================================
# If you prefer checks to run automatically before every 'git commit' without
# remembering to run 'make check', install pre-commit:
#
#   1. Install package:    pip install pre-commit
#   2. Add config file:    Create '.pre-commit-config.yaml' at the root
#   3. Activate git hook:  pre-commit install
#
# Once enabled, Git will automatically run 'ruff', 'mypy', and 'tsc' on stage
# files during 'git commit' and block the commit if any check fails.
