#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Starting restore from: $BACKUP_FILE"

# Extract backup
TEMP_DIR=$(mktemp -d)
tar -xzf $BACKUP_FILE -C $TEMP_DIR

BACKUP_NAME=$(basename $BACKUP_FILE .tar.gz)

# Restore PostgreSQL
echo "Restoring PostgreSQL..."
docker-compose -f docker-compose.prod.yml exec -T db_primary psql -U instagram instagram_db < $TEMP_DIR/$BACKUP_NAME/postgres_backup.sql

# Restore Redis
echo "Restoring Redis..."
docker cp $TEMP_DIR/$BACKUP_NAME/redis_backup.rdb instagram_redis_master:/data/dump.rdb
docker-compose -f docker-compose.prod.yml restart redis_master

# Restore Media Files
echo "Restoring media files..."
docker cp $TEMP_DIR/$BACKUP_NAME/media/. instagram_backend1:/app/mediafiles/

# Cleanup
rm -rf $TEMP_DIR

echo "Restore complete!"