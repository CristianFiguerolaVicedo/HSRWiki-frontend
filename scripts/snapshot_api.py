"""Saves every public HSRWiki API response as a static JSON file in public/data/.

The site reads these files from Vercel's CDN, so it opens instantly even while the backend on
Render's free plan is asleep. Only "My Account" (live showcases from Enka.Network) still needs
the backend. Run by .github/workflows/data-snapshot.yml against a backend started in the runner:

    python scripts/snapshot_api.py http://localhost:8080/api

URL -> file (keep in sync with snapshotPath() in src/services/apiClient.js):
    /characters              -> characters.json
    /characters/{id}         -> characters/{id}.json
    /lightcones              -> lightcones.json
    /lightcones/{id}         -> lightcones/{id}.json
    /lightcones/name/{name}  -> lightcones/name/{slug}.json
    /relics                  -> relics.json
    /relics/{name}           -> relics/{slug}.json
    /items, /items/{id}      -> items.json, items/{id}.json
    /planner, /changelog, /version -> planner.json, changelog.json, version.json
"""

import json
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data")


def slug(name):
    """Same as slug() in src/services/apiClient.js."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def main(base):
    base = base.rstrip("/")

    def get(path):
        with urllib.request.urlopen(base + path, timeout=60) as r:
            return json.load(r)

    files = {}  # relative file -> data

    def add(file, data):
        if file in files:
            raise SystemExit(f"Two URLs map to the same file: {file}")
        files[file] = data

    for name in ["characters", "lightcones", "relics", "items", "planner", "changelog", "version"]:
        add(f"{name}.json", get(f"/{name}"))

    jobs = []  # (file, path)
    jobs += [(f"characters/{c['id']}.json", f"/characters/{c['id']}") for c in files["characters.json"]]
    jobs += [(f"items/{i['id']}.json", f"/items/{i['id']}") for i in files["items.json"]]
    for lc in files["lightcones.json"]:
        jobs.append((f"lightcones/{lc['id']}.json", f"/lightcones/{lc['id']}"))
        jobs.append((f"lightcones/name/{slug(lc['name'])}.json", "/lightcones/name/" + urllib.parse.quote(lc["name"], safe="")))
    jobs += [(f"relics/{slug(r['name'])}.json", "/relics/" + urllib.parse.quote(r["name"], safe="")) for r in files["relics.json"]]

    with ThreadPoolExecutor(8) as pool:
        for file, data in zip([f for f, _ in jobs], pool.map(lambda j: get(j[1]), jobs)):
            add(file, data)

    # Write into a fresh folder, then swap, so removed characters/items don't leave old files behind
    tmp = OUT + ".tmp"
    shutil.rmtree(tmp, ignore_errors=True)
    for file, data in files.items():
        path = os.path.join(tmp, file)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    shutil.rmtree(OUT, ignore_errors=True)
    os.rename(tmp, OUT)

    size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(OUT) for f in fs)
    print(f"Saved {len(files)} files ({size / 1e6:.1f} MB) in public/data, version {files['version.json'].get('gameVersion')}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080/api")
