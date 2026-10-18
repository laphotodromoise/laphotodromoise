#!/usr/bin/env python3
"""Télécharge toutes les photos hébergées chez Webnode dans images/ et met à jour les pages."""
import os, re, hashlib, urllib.request, urllib.parse

PAT = re.compile(r'https://(?:2404070c10\.clvaw-cdnwnd\.com|duyn491kcolsw\.cloudfront\.net)/[^"\')\s]+')
root = os.path.dirname(os.path.abspath(__file__))
imgdir = os.path.join(root, "images"); os.makedirs(imgdir, exist_ok=True)
cache, n = {}, 0
for dp, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if not d.startswith(".") and d != "images"]
    for f in files:
        if not f.endswith(".html"): continue
        p = os.path.join(dp, f); txt = open(p, encoding="utf-8").read()
        depth = os.path.relpath(p, root).count(os.sep)
        def repl(m):
            global n
            url = m.group(0)
            if url not in cache:
                clean = urllib.parse.unquote(url.split("?")[0].rsplit("/", 1)[-1])
                ext = os.path.splitext(clean)[1].lower() or ".jpg"
                name = hashlib.md5(url.encode()).hexdigest()[:10] + ext
                dest = os.path.join(imgdir, name)
                if not os.path.exists(dest):
                    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as o:
                        o.write(r.read())
                    n += 1; print("↓", clean)
                cache[url] = name
            return "../" * depth + "images/" + cache[url]
        new = PAT.sub(repl, txt)
        if new != txt: open(p, "w", encoding="utf-8").write(new)
print(f"Terminé : {n} photos téléchargées dans images/")
