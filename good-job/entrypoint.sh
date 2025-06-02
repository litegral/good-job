#!/bin/sh
set -e

# Run database migrations
php artisan migrate --force

# Then exec the container's main process (what's set as CMD in the Dockerfile or docker-compose.yml)
exec "$@" 