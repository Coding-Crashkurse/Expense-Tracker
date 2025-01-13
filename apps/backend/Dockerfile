# Backend
FROM python:3.11-slim

WORKDIR /app
# Install Poetry
RUN pip install poetry

# Kopiere Poetry-Dateien
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --without dev

# Kopiere Code
COPY app ./app

# Expose Port
EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]