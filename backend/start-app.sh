#!/bin/bash
set -e

echo "🚀 Starting Instagram Clone Application"
echo "========================================"

# Stop any existing containers
echo "🧹 Cleaning up old containers..."
docker-compose down

# Start infrastructure first
echo "📦 Starting infrastructure services..."
docker-compose up -d db redis elasticsearch zookeeper kafka prometheus grafana

# Wait for health checks
echo "⏳ Waiting for infrastructure to be healthy (40s)..."
sleep 40

# Run migrations and wait for completion
echo "🗄️  Running database migrations..."
docker-compose run --rm migrate

echo "✅ Migrations completed!"

# Start backend services
echo "🖥️  Starting backend services..."
docker-compose up -d backend1 backend2 backend3

# Wait for backends to start
echo "⏳ Waiting for backends to initialize (20s)..."
sleep 20

# Start Celery services
echo "⚙️  Starting Celery workers..."
docker-compose up -d celery_worker celery_beat flower

# Start Nginx
echo "🌐 Starting Nginx load balancer..."
docker-compose up -d nginx

# Start monitoring
echo "📊 Starting monitoring services..."
docker-compose up -d kibana redis-exporter postgres-exporter

echo ""
echo "✅ Application started successfully!"
echo "========================================"
docker-compose ps

echo ""
echo "🏥 Health check..."
sleep 5
curl -s http://localhost/api/health/ | python3 -m json.tool || echo "⚠️  Backend not ready yet, try again in a few seconds"

echo ""
echo "📍 Access Points:"
echo "   API:        http://localhost/api/"
echo "   Admin:      http://localhost/admin/ (admin/admin123)"
echo "   Docs:       http://localhost/api/docs/"
echo "   Grafana:    http://localhost:3000 (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Flower:     http://localhost:5555"
echo ""