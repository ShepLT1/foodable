# Foodable Web App - Backend

The backend is built with **FastAPI** & **Python**.

This project uses **Python 3.13**. Run the following to verify local version:

```bash
python3 --version
```

## Setup

Creates a virtual environment and installs dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Run

Runs the local dev server with auto-reload enabled:

```bash
cd backend
source .venv/bin/activate
fastapi dev app/main.py # should start up at http://localhost:8000
```

- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs