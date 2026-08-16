# Migration Audit — Django/Python Inventory

This document inventories Python/Django features in `dg-web` that must be migrated to a Node/Next.js stack.

Generated: 2026-08-15

## Summary

- Location of Django project: `api/` (Django settings, urls, celery integration)
- Admin UI: `admin_panel/` (custom Firebase admin views and URLs)
- Firebase integrations & auth helpers: `firebase_app/` (views, firebase_admin helpers)
- Core site & pages: `core/` (templates, views used by Django site)
- Background tasks: `api/celery.py` + Celery config in `api/settings.py`
- Cloud tasks/job submission: `api/routers/jobs.py` (FastAPI router using Google Cloud Tasks)
- Health and gateway endpoints: `api/gateway.py`

## Discovered endpoints and features (representative)

- `api/urls.py`
  - `GET /health/` -> `gateway.health_check`
  - `GET /vue-status/` -> `gateway.vue_status`
  - `admin/` -> Django admin
  - `firebase-admin/` -> `admin_panel` app
  - Root includes `core.urls`

- `admin_panel/urls.py`
  - `GET /` -> `admin_dashboard`
  - `GET/POST /collections/` -> `manage_collections`
  - `GET/POST /users/` -> `manage_users`
  - `GET/POST /settings/` -> `firebase_settings`
  - Metrics endpoints: `/api/metrics/django`, `/api/metrics/firebase`, `/api/metrics/system`

- `firebase_app/views.py` (representative APIs)
  - `GET /firebase/test` -> `firebase_test_page` / `firebase_test`
  - `POST /firebase/verify_token` -> `verify_token` (verify Firebase ID token, sign-in flow)
  - `POST /firebase/signin` -> `signin` (ID token verification + session login)
  - `POST /firebase/signout` -> `signout`
  - `GET /firebase/list_users` -> `list_users`
  - Admin helpers: `set_admin_status`, `get_session`, `test_firebase_config`, `test_environment_variables`

- `api/routers/jobs.py` (FastAPI)
  - `POST /submit` -> submits Cloud Task to Cloud Tasks
  - `GET /status/{task_name}` -> query task status

- Background tasks and scheduling
  - Celery configured in `api/celery.py` and `api/settings.py` (Redis broker by default)
  - `django_celery_beat` configured for scheduling

## Files of interest

- `api/settings.py` — Django settings, Firebase credentials loading, Celery config
- `api/celery.py` — Celery app with `app.autodiscover_tasks()`
- `api/routers/*.py` — FastAPI routers used for some job APIs
- `admin_panel/views.py` — Admin dashboard and collection/user management
- `firebase_app/firebase_admin.py` — (helper to initialize Firebase Admin SDK)

## Recommended Node/Next.js replacements (mapping)

- Health endpoints -> Next.js Route Handlers under `src/app/api/health/route.ts`
- Contact intake & validation -> `src/app/api/contact/route.ts` (Zod validation + Firestore write)
- Firebase Admin server-side helpers -> `src/lib/firebase.ts` (initialize `firebase-admin` once)
- Auth flows (verify ID token, signin/signout, session) -> Next.js API routes / NextAuth.js adapter or custom verify endpoints
- Admin UI -> Next.js admin pages under `src/app/admin/` with authenticated server components and REST endpoints
- Metrics endpoints -> Serverless functions or Edge APIs that query Firestore / monitoring services
- Background tasks -> Replace Celery with Cloud Tasks / Cloud Run jobs, or a Node worker (BullMQ + Redis) depending on needs
- Cloud Tasks usage in `api/routers/jobs.py` can be ported to the Node `@google-cloud/tasks` client from a serverless route

## Immediate next actions (proposed)

1. Produce a definitive list of all Django view functions and class-based views to be ported (this file is a first pass).
2. Implement `src/lib/firebase.ts` bootstrapping `firebase-admin` and a simplest `src/app/api/contact/route.ts` that mirrors intake flow.
3. Prototype admin pages in Next.js that call the new Node endpoints and validate parity.
4. Stage and test against a staging Firebase project.

## Notes & risks

- The repo contains both Django and FastAPI pieces; ensure no runtime assumptions rely on Django-specific middleware (sessions, CSRF) once removed.
- Preserve a read-only archive of Python code until Node parity is verified.
