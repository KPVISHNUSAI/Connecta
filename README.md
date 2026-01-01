# Instagram Clone - Scalable Microservices Architecture

A production-ready, scalable Instagram-like social media platform built with Django REST Framework, React, and modern microservices architecture designed to handle 1M+ users.

## Architecture Overview

### Tech Stack

**Backend:**

- Django REST Framework
- PostgreSQL (with read replicas)
- Redis (clustered with Sentinel)
- Elasticsearch (clustered)
- Kafka (clustered)
- Celery (distributed task queue)

**Infrastructure:**

- Docker & Docker Compose
- Nginx (load balancing)
- HAProxy (advanced load balancing)
- Gunicorn (WSGI server)

**Monitoring & Observability:**

- Prometheus (metrics)
- Grafana (visualization)
- ELK Stack (logging)
- Jaeger (distributed tracing)
- Flower (Celery monitoring)

### Features

- ✅ User authentication & authorization (JWT)
- ✅ User profiles with followers/following
- ✅ Posts with multiple media (images/videos)
- ✅ Comments and replies
- ✅ Stories (24-hour expiry)
- ✅ Likes and saves
- ✅ Real-time notifications
- ✅ Full-text search (Elasticsearch)
- ✅ Feed generation (personalized)
- ✅ Explore page (trending content)
- ✅ Caching (Redis)
- ✅ Message queue (Kafka)
- ✅ Background tasks (Celery)
- ✅ Rate limiting
- ✅ Health checks
- ✅ Auto-scaling support

## Quick Start

### Prerequisites

- Docker & Docker Compose
- 16GB RAM minimum
- 50GB disk space

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/instagram-clone.git
cd instagram-clone
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Build and start services:

```bash
make build
make up
```

4. Run migrations:

```bash
make migrate
```

5. Create superuser:

```bash
make createsuperuser
```

6. Access the application:

- API: http://localhost/api/
- Admin: http://localhost/admin/
- API Docs: http://localhost/api/docs/
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5602
- Flower: http://localhost:5555

### Production Deployment

1. Update production environment:

```bash
cp .env.example .env.prod
# Edit .env.prod with production values
```

2. Deploy:

```bash
make prod-deploy
```

## Architecture Details

### Database

- **Primary-Replica Setup:** Write operations go to primary, reads distributed across replicas
- **Connection Pooling:** Optimized database connections
- **Indexes:** Strategic indexing for query optimization

### Caching Strategy

- **User Feeds:** Cached for 10 minutes
- **Trending Posts:** Cached for 30 minutes
- **User Profiles:** Cached for 1 hour
- **Post Details:** Cached for 10 minutes

### Load Balancing

- **Nginx:** HTTP load balancing with least connections algorithm
- **HAProxy:** Advanced TCP/HTTP load balancing with health checks
- **5 Backend Instances:** Distributed request handling

### Message Queue

- **Kafka Cluster:** 3-node cluster for high availability
- **Topics:**
  - `post_created`: New post events
  - `post_liked`: Like events
  - `notifications`: Notification events

### Background Tasks

- **Celery Workers:** 3 worker instances with 8 concurrent tasks each
- **Scheduled Tasks:**
  - Delete expired stories (hourly)
  - Update trending posts (every 30 minutes)
  - Cleanup old notifications (daily)

### Monitoring

- **Prometheus:** Collects metrics from all services
- **Grafana:** Visualizes metrics with pre-built dashboards
- **ELK Stack:** Centralized logging
- **Alertmanager:** Alert notifications to Slack/Email

## API Endpoints

### Authentication

- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh token
- `POST /api/accounts/users/register/` - Register new user

### Users

- `GET /api/accounts/users/` - List users
- `GET /api/accounts/users/{id}/` - User detail
- `POST /api/accounts/users/{id}/follow/` - Follow user
- `POST /api/accounts/users/{id}/unfollow/` - Unfollow user

### Posts

- `GET /api/posts/` - List posts
- `POST /api/posts/` - Create post
- `GET /api/posts/{id}/` - Post detail
- `GET /api/posts/feed/` - Personalized feed
- `GET /api/posts/explore/` - Explore posts
- `POST /api/posts/{id}/like/` - Like post
- `POST /api/posts/{id}/save/` - Save post

### Comments

- `GET /api/comments/?post_id={id}` - List comments
- `POST /api/comments/` - Create comment
- `POST /api/comments/{id}/like/` - Like comment

### Stories

- `GET /api/stories/` - List stories
- `POST /api/stories/` - Create story
- `GET /api/stories/feed/` - Stories feed
- `POST /api/stories/{id}/view/` - View story

### Search

- `GET /api/search/users/?q={query}` - Search users
- `GET /api/search/posts/?q={query}` - Search posts

## Performance Optimization

### Database

- Read replicas for scaling read operations
- Connection pooling (600s timeout)
- Query optimization with select_related/prefetch_related
- Strategic indexing

### Caching

- Redis cluster with Sentinel for high availability
- Multi-level caching (application, database, CDN)
- Cache invalidation strategies

### API

- Response pagination (20 items per page)
- Rate limiting (1000 req/hour per user)
- Response compression (gzip)

### Media

- CDN integration (CloudFront/Cloudflare)
- Image optimization (compression, resizing)
- Lazy loading

## Scaling Guidelines

### Horizontal Scaling

**Backend:**

```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=10
```

**Celery Workers:**

```bash
docker-compose -f docker-compose.prod.yml up -d --scale celery_worker=5
```

### Vertical Scaling

Adjust resource limits in docker-compose.prod.yml:

```yaml
deploy:
  resources:
    limits:
      cpus: "4"
      memory: 8G
```

## Monitoring & Alerts

### Metrics

- Request rate, latency, error rate
- Database query performance
- Cache hit/miss ratio
- Queue length and processing time
- System resources (CPU, memory, disk)

### Alerts

- High error rate (>5% in 5 minutes)
- High response time (>2s for 95th percentile)
- Service down (Redis, PostgreSQL, Elasticsearch)
- High resource usage (>80% CPU/memory)
- Queue backed up (>1000 pending tasks)

## Maintenance

### Backup

```bash
make backup
```

### Restore

```bash
make restore
```

### Update Dependencies

```bash
pip install -r requirements.txt --upgrade
make build
make up
```

### Database Migrations

```bash
make makemigrations
make migrate
```

## Testing

### Run Tests

```bash
make test
```

### Load Testing

```bash
locust -f load_testing/locustfile.py --host=http://localhost
```

## Troubleshooting

### Check Service Health

```bash
make health
```

### View Logs

```bash
make logs
# Or for specific service
docker-compose logs -f backend1
```

### Service Status

```bash
make ps
```

### Database Shell

```bash
make db-shell
```

### Redis CLI

```bash
make redis-cli
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- GitHub Issues: https://github.com/yourusername/instagram-clone/issues
- Email: support@yourdomain.com
