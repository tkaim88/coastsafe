"""
Entry point. `flask run` and `flask db migrate` both pick this up via
FLASK_APP=run.py (see .env.example).
"""

import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app

app = create_app(os.environ.get("FLASK_ENV", "development"))

if __name__ == "__main__":
    app.run()
