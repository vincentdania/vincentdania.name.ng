#!/bin/sh
set -e

python - <<'PY'
import os
import time

import psycopg

database_url = os.getenv("DATABASE_URL", "")
if database_url.startswith("postgres"):
    for attempt in range(30):
        try:
            with psycopg.connect(database_url):
                break
        except psycopg.OperationalError:
            if attempt == 29:
                raise
            time.sleep(1)
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_site

python - <<'PY'
import os

from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
import django

django.setup()

email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
name = os.getenv("DJANGO_SUPERUSER_NAME", "Vincent Admin")

if email and password:
    User = get_user_model()
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            username=email,
            email=email,
            password=password,
            first_name=name,
        )
PY

exec "$@"
