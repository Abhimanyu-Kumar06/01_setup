from __future__ import annotations

import re
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

from flask import Flask, jsonify, request


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "server" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder=str(BASE_DIR),
        static_url_path="",
    )

    @app.get("/")
    def home():
        return app.send_static_file("index.html")

    @app.post("/api/contact")
    def contact() -> Any:
        try:
            payload: Dict[str, Any] = request.get_json(silent=True) or {}
            name = str(payload.get("name", "")).strip()
            email = str(payload.get("email", "")).strip()
            message = str(payload.get("message", "")).strip()

            errors: Dict[str, str] = {}
            if not name:
                errors["name"] = "Name is required."
            if not email:
                errors["email"] = "Email is required."
            elif not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
                errors["email"] = "Enter a valid email."
            if not message:
                errors["message"] = "Message is required."

            if errors:
                return jsonify({"ok": False, "errors": errors}), 400

            record = {
                "name": name,
                "email": email,
                "message": message,
                "received_at": datetime.now(timezone.utc).isoformat(),
                "ip": request.headers.get("X-Forwarded-For", request.remote_addr),
                "ua": request.headers.get("User-Agent", ""),
            }

            with (DATA_DIR / "messages.jsonl").open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")

            return jsonify({"ok": True})

        except Exception as exc:  # pragma: no cover - basic safeguard
            return jsonify({"ok": False, "error": str(exc)}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)


