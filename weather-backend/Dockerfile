FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . /var/www

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Setup Nginx and permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/cache
COPY .render/nginx.conf /etc/nginx/sites-available/default

EXPOSE 80

CMD service nginx start && php-fpm