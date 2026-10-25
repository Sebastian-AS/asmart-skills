#!/usr/bin/env python3
"""Export an existing ASmartDesign source-sections project as a Campus package."""
from __future__ import annotations

import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys


class SlideHTML(HTMLParser):
    """Keep slide content while removing the source deck's runtime shell."""
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.out: list[str] = []
        self.depth = 0
        self.skip = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if self.skip:
            if tag == "div": self.skip += 1
            return
        attributes = dict(attrs)
        if tag == "div" and "neural-background" in (attributes.get("class") or "").split():
            self.skip = 1
            return
        if tag == "footer":
            self.skip = -1
            return
        if self.skip == -1:
            return
        pairs = []
        for key, value in attrs:
            if key.startswith("data-") or key in {"aria-hidden"}:
                continue
            if key == "id" and value == "brand-1":
                value = "asmart-brand"
            pairs.append(key if value is None else f'{key}="{html.escape(value, quote=True)}"')
        self.out.append("<" + tag + (" " + " ".join(pairs) if pairs else "") + ("/>" if tag in self.VOID else ">"))
        if tag not in self.VOID:
            self.depth += 1

    def handle_endtag(self, tag: str) -> None:
        if self.skip > 0:
            if tag == "div": self.skip -= 1
            return
        if self.skip == -1:
            if tag == "footer": self.skip = 0
            return
        self.out.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if not self.skip: self.out.append(data)

    def handle_entityref(self, name: str) -> None:
        if not self.skip: self.out.append(f"&{name};")

    def handle_charref(self, name: str) -> None:
        if not self.skip: self.out.append(f"&#{name};")


class ContentPolicy(HTMLParser):
    """Reject active or externally loaded content the Campus renderer blocks."""
    FORBIDDEN = {"script", "iframe", "object", "embed", "base"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in self.FORBIDDEN:
            self.errors.append(f"forbidden <{tag}> element")
        attrmap = {k.lower(): (v or "") for k, v in attrs}
        if tag == "meta" and attrmap.get("http-equiv", "").lower() == "refresh":
            self.errors.append("meta refresh is forbidden")
        for name, value in attrmap.items():
            if name.startswith("on"):
                self.errors.append(f"inline event handler {name} is forbidden")
            if name in {"href", "src"} and re.match(r"\s*javascript\s*:", value, re.I):
                self.errors.append(f"javascript URL in {name} is forbidden")
        if tag == "img" and re.match(r"https?://", attrmap.get("src", "").strip(), re.I):
            self.errors.append("external image source is forbidden")

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def validate_styles(styles: str) -> None:
    if re.search(r"</style\b|<script\b", styles, re.I):
        raise ValueError("CSS style breakout or script markup is forbidden")
    if re.search(r"@import\b", styles, re.I):
        raise ValueError("CSS @import is forbidden")
    for quote, value in re.findall(r"url\(\s*(['\"]?)(.*?)\1\s*\)", styles, re.I | re.S):
        if re.match(r"(?:https?:)?//", value.strip(), re.I):
            raise ValueError("external CSS url() is forbidden")


def validate(pkg: dict) -> None:
    if pkg.get("schemaVersion") != 1: raise ValueError("schemaVersion must be 1")
    if not isinstance(pkg.get("title"), str) or not pkg["title"].strip() or len(pkg["title"]) > 160: raise ValueError("title must be 1–160 characters")
    if (pkg.get("width"), pkg.get("height")) != (1920, 1080): raise ValueError("width/height must be 1920×1080")
    if pkg.get("background") not in {"neural", "ripple", "particle-wave", "none"}: raise ValueError("invalid background")
    slides = pkg.get("slides")
    if not isinstance(slides, list) or not 1 <= len(slides) <= 80: raise ValueError("slides must contain 1–80 entries")
    ids = set()
    for slide in slides:
        sid = slide.get("id")
        if not isinstance(sid, str) or not re.fullmatch(r"[a-zA-Z0-9_-]{1,80}", sid) or sid in ids: raise ValueError(f"invalid or duplicate slide id: {sid!r}")
        ids.add(sid)
        if not isinstance(slide.get("title"), str) or not slide["title"].strip() or len(slide["title"]) > 160: raise ValueError(f"invalid title on {sid}")
        if not isinstance(slide.get("html"), str) or len(slide["html"].encode("utf-8")) > 200_000: raise ValueError(f"invalid html on {sid}")
        notes = slide.get("notes", "")
        if not isinstance(notes, str) or len(notes) > 4_000: raise ValueError(f"invalid or too-long notes on {sid}")
        policy = ContentPolicy()
        policy.feed(slide["html"])
        if policy.errors: raise ValueError(f"unsafe html on {sid}: {policy.errors[0]}")
    styles = pkg.get("styles", "")
    if not isinstance(styles, str): raise ValueError("styles must be a string")
    validate_styles(styles)
    if len(json.dumps(pkg, ensure_ascii=False, separators=(",", ":")).encode("utf-8")) > 6 * 1024 * 1024:
        raise ValueError("whole package JSON exceeds 6 MiB")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", type=Path, help="source-sections.json")
    ap.add_argument("--styles", type=Path, required=True, help="source design.css")
    ap.add_argument("--title", required=True)
    ap.add_argument("--output", type=Path, required=True)
    args = ap.parse_args()
    src = json.loads(args.source.read_text())
    styles = args.styles.read_text()
    slides = []
    for i, raw in enumerate(src["sections"]):
        parser = SlideHTML()
        parser.feed(raw)
        parser.close()
        title_match = re.search(r"<h1\b[^>]*>(.*?)</h1>", raw, re.I | re.S)
        title = re.sub(r"<[^>]+>", "", title_match.group(1)).strip() if title_match else f"Slide {i+1}"
        title = html.unescape(title)
        sid_match = re.search(r'\bid="([a-zA-Z0-9_-]+)"', raw)
        sid = sid_match.group(1) if sid_match else f"slide-{i+1}"
        slides.append({"id": sid, "title": title, "html": "".join(parser.out), "notes": src.get("notes", [""] * len(src["sections"]))[i]})
    pkg = {"schemaVersion": 1, "title": args.title, "width": 1920, "height": 1080, "background": "neural", "styles": styles, "slides": slides}
    validate(pkg)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(pkg, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"Wrote {args.output} ({len(slides)} slides)")
    return 0


if __name__ == "__main__":
    try: raise SystemExit(main())
    except (ValueError, KeyError, json.JSONDecodeError) as exc:
        print(f"Invalid source/package: {exc}", file=sys.stderr)
        raise SystemExit(2)
