.PHONY: help build up down restart logs shell migrate test clean backup restore

help:
	@echo "Instagram Clone - Available commands:"
	@echo "  make build          - Build all Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View logs"
	@echo "  make shell          - Open Django shell"
	@echo "  make migrate        - Run database migrations"
	@echo "  make makemigrations - Create new migrations"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Clean up containers and volumes"
	@echo "  make backup         - Backup database and media"
	@echo "  make restore        - Restore from backup"
	@echo "  make prod-deploy    - Deploy to production"
	@echo "  make monitor        - Open monitoring dashboards"

build:
	docker-compose -f docker-compose.yml build

build-prod:
	docker-compose -f docker-compose.prod.yml build

up:
	docker-compose -f docker-compose.yml up -d

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

down:
	docker-compose -f docker-compose.yml down

down-prod:
	docker-compose -f docker-compose.prod.yml down

restart:
	docker-compose -f docker-compose.yml restart

restart-prod:
	docker-compose -f docker-compose.prod.yml restart

logs:
	docker-compose -f docker-compose.yml logs -f

logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f

shell:
	docker-compose -f docker-compose.yml exec backend1 python manage.py shell

shell-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py shell

migrate:
	docker-compose -f docker-compose.yml exec backend1 python manage.py migrate

migrate-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py migrate

makemigrations:
	docker-compose -f docker-compose.yml exec backend1 python manage.py makemigrations

makemigrations-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py makemigrations

createsuperuser:
	docker-compose -f docker-compose.yml exec backend1 python manage.py createsuperuser

createsuperuser-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py createsuperuser

collectstatic:
	docker-compose -f docker-compose.yml exec backend1 python manage.py collectstatic --noinput

collectstatic-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py collectstatic --noinput

test:
	docker-compose -f docker-compose.yml exec backend1 python manage.py test

search-index:
	docker-compose -f docker-compose.yml exec backend1 python manage.py search_index --rebuild -f

search-index-prod:
	docker-compose -f docker-compose.prod.yml exec backend1 python manage.py search_index --rebuild -f

clean:
	docker-compose -f docker-compose.yml down -v
	docker system prune -f

clean-prod:
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

backup:
	./scripts/backup.sh

restore:
	@read -p "Enter backup file path: " backup_file; \
	./scripts/restore.sh $$backup_file

prod-deploy:
	./scripts/deploy.sh

monitor:
	@echo "Opening monitoring dashboards..."
	@echo "Grafana: http://localhost:3000"
	@echo "Prometheus: http://localhost:9090"
	@echo "Kibana: http://localhost:5602"
	@echo "Flower: http://localhost:5555"
	@echo "HAProxy Stats: http://localhost:9000/stats"

health:
	@echo "Checking service health..."
	@curl -s http://localhost/api/health/ | python -m json.tool

ps:
	docker-compose -f docker-compose.yml ps

ps-prod:
	docker-compose -f docker-compose.prod.yml ps

stats:
	docker stats

db-shell:
	docker-compose -f docker-compose.yml exec db psql -U instagram -d instagram_db

db-shell-prod:
	docker-compose -f docker-compose.prod.yml exec db_primary psql -U instagram -d instagram_db

redis-cli:
	docker-compose -f docker-compose.yml exec redis redis-cli

redis-cli-prod:
	docker-compose -f docker-compose.prod.yml exec redis_master redis-cli

kafka-topics:
	docker-compose -f docker-compose.yml exec kafka kafka-topics --list --bootstrap-server localhost:9092

kafka-topics-prod:
	docker-compose -f docker-compose.prod.yml exec kafka1 kafka-topics --list --bootstrap-server localhost:9092