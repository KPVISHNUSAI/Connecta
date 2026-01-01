from pathlib import Path
from decouple import config
from datetime import timedelta

from .celery import app as celery_app

__all__ = ('celery_app',)