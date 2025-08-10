from __future__ import annotations

import re
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List
from urllib.request import Request, urlopen
import time

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "server" / "data"
ASSETS_DIR = BASE_DIR / "assets" / "images"
DATA_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)


def download_image(url: str, output_path: Path, timeout_seconds: int = 20, retries: int = 3) -> bool:
    for attempt in range(retries):
        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible)"})
            with urlopen(req, timeout=timeout_seconds) as resp:  # nosec - remote asset download intended
                data = resp.read()
            if not data:
                raise ValueError("empty response")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(data)
            return True
        except Exception:
            if attempt < retries - 1:
                time.sleep(1.0 * (attempt + 1))
                continue
            return False


def ensure_cached_images(force_refresh: bool = False) -> Dict[str, bool]:
    # Tech-focused images via Unsplash Source (random but on-topic)
    image_sources: List[Dict[str, str]] = [
        {"file": "hero.jpg", "url": "https://source.unsplash.com/1200x900/?programming,code,developer&sig=1001"},
        {"file": "about.jpg", "url": "https://source.unsplash.com/800x800/?portrait,software%20developer&sig=1002"},
        {"file": "project-1.jpg", "url": "https://source.unsplash.com/1200x800/?web%20app,dashboard,analytics&sig=1003"},
        {"file": "project-2.jpg", "url": "https://source.unsplash.com/1200x800/?laptop,coding,software%20engineering&sig=1004"},
        {"file": "project-3.jpg", "url": "https://source.unsplash.com/1200x800/?mobile%20development,ui,ux&sig=1005"},
        {"file": "project-4.jpg", "url": "https://source.unsplash.com/1200x800/?cloud%20computing,server,api&sig=1006"},
        {"file": "project-5.jpg", "url": "https://source.unsplash.com/1200x800/?react,frontend,typescript&sig=1007"},
        {"file": "project-6.jpg", "url": "https://source.unsplash.com/1200x800/?cybersecurity,devops,terminal&sig=1008"},
    ]

    results: Dict[str, bool] = {}
    for item in image_sources:
        dest = ASSETS_DIR / item["file"]
        if not force_refresh and dest.exists() and dest.stat().st_size > 0:
            results[item["file"]] = True
            continue
        results[item["file"]] = download_image(item["url"], dest)
    return results


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder=str(BASE_DIR),
        static_url_path="",
    )
    # Disable caching for local assets to avoid stale images during development
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    # Pre-cache images on startup (best-effort)
    ensure_cached_images(force_refresh=False)

    @app.get("/")
    def home():
        return app.send_static_file("index.html")

    @app.after_request
    def no_cache_assets(resp):
        try:
            path = request.path or ""
            if path.startswith("/assets/images/"):
                resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
                resp.headers["Pragma"] = "no-cache"
                resp.headers["Expires"] = "0"
        finally:
            return resp

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

    @app.post("/api/upload-image")
    def upload_image() -> Any:
        if 'file' not in request.files:
            return jsonify({"ok": False, "error": "No file uploaded"}), 400
        file = request.files['file']
        original_name = file.filename or ""
        if not original_name:
            return jsonify({"ok": False, "error": "Empty filename"}), 400

        allowed = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}
        name_override = str(request.form.get('name') or '').strip()
        filename = secure_filename(name_override or original_name)
        ext = ('.' + filename.rsplit('.', 1)[-1].lower()) if '.' in filename else ''
        if ext not in allowed:
            return jsonify({"ok": False, "error": f"Unsupported file type: {ext}"}), 415

        dest = ASSETS_DIR / filename
        file.save(dest)
        rel_path = f"assets/images/{filename}"
        return jsonify({"ok": True, "path": rel_path})

    @app.post("/api/cache-images")
    def cache_images() -> Any:
        payload = request.get_json(silent=True) or {}
        force = bool(payload.get("force", False))
        results = ensure_cached_images(force_refresh=force)
        ok = all(results.values())
        return jsonify({"ok": ok, "results": results})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)


