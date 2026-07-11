# Use a slim Python image
FROM python:3.11-slim

# Make stdout/stderr unbuffered (good for logs)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Recipe output can contain non-ASCII (e.g. Hebrew) text that gets printed to
# stdout for debugging — force UTF-8 so that never crashes the process.
ENV PYTHONIOENCODING=utf-8

# Create app directory
WORKDIR /app

# System deps (curl is handy for debugging)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the agent source code
# (Assumes these files are in the same folder as the Dockerfile)
COPY config.py prompts.py schemas.py ai_client.py recipe_agent.py app.py ./

# Expose FastAPI port
EXPOSE 8000

# The OPEN_ROUTER_API_KEY will be provided as an environment variable at runtime
# CMD runs uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
