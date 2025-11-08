from celery import Celery
import os

BROKER = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
RESULT = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

celery_app = Celery("pdoc", broker=BROKER, backend=RESULT)
celery_app.conf.task_routes = {"app.workers.tasks.*": {"queue": "default"}}
