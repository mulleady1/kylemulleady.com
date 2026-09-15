#!/usr/bin/env python3
"""Build kylemulleady.com: Markdown posts + Jinja templates -> plain static HTML.

No JavaScript is emitted and no server runs. Code is highlighted at build time by
Pygments, so pages need nothing but HTML and one stylesheet.
"""

import re
import shutil
from datetime import date
from pathlib import Path

import markdown
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pygments.formatters import HtmlFormatter

ROOT = Path(__file__).parent
CONTENT = ROOT / "content" / "posts"
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
DIST = ROOT / "dist"

SITE = {
    "title": "Kyle Mulleady",
    "url": "https://kylemulleady.com",
    "email": "kyle@kylemulleady.com",
    "github": "https://github.com/mulleady1",
}

FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)


def parse_post(path: Path) -> dict:
    """Split a post file into its frontmatter fields and rendered body."""
    raw = path.read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(raw)
    if not match:
        raise ValueError(f"{path.name}: missing frontmatter block")

    meta = {}
    for line in match.group(1).splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip().strip('"')

    md = markdown.Markdown(
        extensions=["fenced_code", "codehilite", "tables", "attr_list", "smarty"],
        extension_configs={"codehilite": {"guess_lang": False, "linenums": False}},
    )
    body_md = match.group(2).strip()
    post = dict(meta)
    post["html"] = md.convert(body_md)
    post["date"] = date.fromisoformat(meta["date"])
    post["legacy_id"] = int(meta["legacy_id"]) if "legacy_id" in meta else None
    post["url"] = f"/blog/{meta['slug']}/"
    post["excerpt"] = make_excerpt(body_md)
    return post


def make_excerpt(body_md: str, limit: int = 180) -> str:
    """First paragraph of a post, stripped to plain text for the index page."""
    first = body_md.split("\n\n", 1)[0]
    text = re.sub(r"[*_`#\[\]]|\(https?://[^)]*\)", "", first).strip()
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "…"


def write(path: Path, html: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def main() -> None:
    posts = sorted(
        (parse_post(p) for p in CONTENT.glob("*.md")),
        key=lambda p: p["date"],
        reverse=True,
    )

    env = Environment(
        loader=FileSystemLoader(TEMPLATES),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["longdate"] = lambda d: d.strftime("%B %-d, %Y")

    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(STATIC, DIST)

    # Pygments stylesheet, generated rather than hand-maintained.
    css = HtmlFormatter(style="friendly").get_style_defs(".codehilite")
    write(DIST / "css" / "pygments.css", css)

    write(DIST / "index.html", env.get_template("index.html").render(site=SITE, posts=posts[:3]))
    write(DIST / "blog" / "index.html", env.get_template("blog_list.html").render(site=SITE, posts=posts))
    for post in posts:
        html = env.get_template("post.html").render(site=SITE, post=post)
        write(DIST / "blog" / post["slug"] / "index.html", html)

    write(DIST / "404.html", env.get_template("404.html").render(site=SITE))

    print(f"built {len(posts)} posts -> {DIST}")
    for p in posts:
        print(f"  {p['date']}  {p['url']}")


if __name__ == "__main__":
    main()
