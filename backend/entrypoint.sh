#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "✅ PostgreSQL ready"

echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "✅ Redis ready"

echo "Waiting for Elasticsearch..."
timeout=30
counter=0
while ! curl -s http://elasticsearch:9200 > /dev/null 2>&1; do
  sleep 1
  counter=$((counter + 1))
  if [ $counter -gt $timeout ]; then
    echo "⚠️  Elasticsearch timeout, continuing anyway..."
    break
  fi
done
echo "✅ Elasticsearch ready"

echo ""
echo "============================================"
echo "🚀 Starting Gunicorn (Worker: $HOSTNAME)"
echo "============================================"

# Start Gunicorn
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --worker-class gthread
