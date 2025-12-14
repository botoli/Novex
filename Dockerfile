FROM php:8.2-fpm

# === Системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
 && docker-php-ext-install pdo_mysql zip gd

# === Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# === Рабочая директория = Laravel
WORKDIR /var/www/backend

# === Сначала только composer-файлы (кеш)
COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader

# === Потом весь проект
COPY . .

# === Права (обязательно для Laravel)
RUN chown -R www-data:www-data /var/www/backend \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
