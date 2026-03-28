# Vincent Dania Portfolio Platform

A production-ready personal branding and portfolio platform for Vincent Dania, built with:

- Next.js 16 App Router, TypeScript, Tailwind CSS, and shadcn-style UI primitives
- Django 5, Django REST Framework, and Django admin
- PostgreSQL-ready backend configuration with SQLite fallback for local checks
- Docker, Docker Compose, and Nginx deployment structure

## Project Structure

```text
.
├── backend/
│   ├── api/
│   ├── config/
│   ├── content/
│   ├── core/
│   ├── engagement/
│   ├── media/
│   ├── seed_assets/
│   ├── staticfiles/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── components.json
│   ├── Dockerfile
│   ├── next.config.ts
│   └── package.json
├── nginx/
│   └── default.conf
├── docker-compose.yml
└── .env.example
```

## Local Development

### Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
python manage.py migrate
python manage.py seed_site
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Recommended local environment values:

- `NEXT_INTERNAL_API_BASE_URL=http://127.0.0.1:8000/api`
- `NEXT_PUBLIC_API_BASE_PATH=/api`
- `NEXT_PUBLIC_DEV_API_PROXY_TARGET=http://127.0.0.1:8000`

## Production-Shaped Docker Run

1. Copy `.env.example` to `.env`
2. Replace secrets and database credentials
3. Start Docker Desktop or another Docker daemon
4. Run:

```bash
docker compose up --build -d
```

The Nginx entrypoint serves the frontend on port `80`, proxies `/api/` and `/admin/` to Django, and serves static/media volumes directly.

## Validation Commands

```bash
source .venv/bin/activate && cd backend && python manage.py check
source .venv/bin/activate && cd backend && python manage.py test
cd frontend && npm run lint
cd frontend && npm run typecheck
cd frontend && npm run build
```

## Seeded Content

The backend seeds:

- Vincent's portrait and CV from `backend/seed_assets/`
- profile, experience, impact metrics, education, certifications, and opportunities
- five projects/products
- five articles
- footer social links

## Admin Coverage

The Django admin manages:

- Site settings and profile content
- Credibility stats and impact metrics
- Experience, expertise, education, certifications, and opportunities
- Articles, categories, tags, and projects
- Subscribers and contact messages

Subscribers can be exported to CSV from the admin action menu.
