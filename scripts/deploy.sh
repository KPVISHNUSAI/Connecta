#!/bin/bash

set -e

echo "Starting Instagram Clone Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.prod ]; then
    export $(cat .env.prod | grep -v '#' | awk '/=/ {print $1}')
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ .env.prod file not found${NC}"
    exit 1
fi

# Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 30

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend1 python manage.py migrate --noinput

# Collect static files
echo -e "${YELLOW}Collecting static files...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend1 python manage.py collectstatic --noinput

# Create Elasticsearch indices
echo -e "${YELLOW}Creating Elasticsearch indices...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend1 python manage.py search_index --rebuild -f

# Check health
echo -e "${YELLOW}Checking application health...${NC}"
sleep 10
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health/)

if [ $HEALTH_STATUS -eq 200 ]; then
    echo -e "${GREEN}✓ Deployment successful! Application is healthy.${NC}"
else
    echo -e "${RED}✗ Deployment failed. Health check returned status: $HEALTH_STATUS${NC}"
    exit 1
fi

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Application: http://localhost"
echo -e "Grafana: http://localhost:3000 (admin/admin)"
echo -e "Prometheus: http://localhost:9090"
echo -e "Flower: http://localhost:5555"
echo -e "Kibana: http://localhost:5602"
echo -e "HAProxy Stats: http://localhost:9000/stats"