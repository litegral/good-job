FROM php:8.2-fpm-alpine AS base

# Install system dependencies
RUN apk update && apk add --no-cache \
    curl \
    zip \
    unzip \
    git \
    supervisor \
    nginx \
    libzip-dev \
    libpng-dev \
    libxml2-dev \
    mariadb-client \
    oniguruma-dev \
    # PHP extensions
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd xml zip

# Set working directory
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . .

# Copy .env.example to .env if .env does not exist (for build purposes)
# In production, .env should be managed via secrets or environment variables in docker-compose
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Install dependencies
RUN composer install --optimize-autoloader --no-dev --no-interaction --no-plugins --no-scripts

# Clear caches and optimize
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Chown to appropriate user (www-data is common for nginx/php-fpm)
RUN chown -R www-data:www-data storage bootstrap/cache public
RUN chmod -R 775 storage bootstrap/cache

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port 9000 and start php-fpm server (this will be CMD for entrypoint)
EXPOSE 9000
CMD ["php-fpm"] 