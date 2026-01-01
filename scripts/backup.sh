#!/bin/bash

set -e

echo "Starting backup process..."

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/instagram_backup_$TIMESTAMP"

mkdir -p $BACKUP_PATH

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker-compose -f docker-compose.prod.yml exec -T db_primary pg_dump -U instagram instagram_db > $BACKUP_PATH/postgres_backup.sql

# Backup Redis
echo "Backing up Redis..."
docker-compose -f docker-compose.prod.yml exec -T redis_master redis-cli --rdb /data/dump.rdb SAVE
docker cp instagram_redis_master:/data/dump.rdb $BACKUP_PATH/redis_backup.rdb

# Backup Media Files
echo "Backing up media files..."
docker cp instagram_backend1:/app/mediafiles $BACKUP_PATH/media

# Compress backup
echo "Compressing backup..."
tar -czf $BACKUP_PATH.tar.gz -C $BACKUP_DIR instagram_backup_$TIMESTAMP

# Remove uncompressed backup
rm -rf $BACKUP_PATH

# Keep only last 7 backups
echo "Cleaning old backups..."
ls -t $BACKUP_DIR/instagram_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "Backup complete: $BACKUP_PATH.tar.gz"