"""Validate static page links, image coverage and CMS image files without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.references = []
        self.ids = set()
        self.images = []
        self.room_depth = 0
        self.stack = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for key in ("src", "href"):
            if key in attrs:
                self.references.append(attrs[key])
        if tag not in ("area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"):
            self.stack.append((tag, "data-room-id" in attrs))
            if "data-room-id" in attrs:
                self.room_depth += 1
        if tag == "img":
            self.images.append((attrs, self.room_depth > 0))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                self.room_depth -= sum(room for _, room in self.stack[index:])
                self.stack = self.stack[:index]
                break


pages = {p.name: Page(p.read_text()) for p in ROOT.glob("*.html")}
images = json.loads((ROOT / "v2/content/images.json").read_text())
references = 0
for filename, page in pages.items():
    for reference in page.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc or not reference or reference == "#":
            continue
        target = unquote(url.path).lstrip("/") if url.path else filename
        if url.path == "/":
            target = "index.html"
        assert (ROOT / target).is_file(), f"{filename}: missing file {reference}"
        if url.fragment and target in pages:
            assert url.fragment in pages[target].ids, f"{filename}: missing anchor {reference}"
        references += 1
    for image, room_image in page.images:
        assert room_image or "data-site-image" in image, f"{filename}: unmanaged image {image}"
        assert not (room_image and "data-site-image" in image), f"{filename}: room image control changed"
        if "data-site-image" in image:
            group, field = image["data-site-image"].split(".")
            assert images[group][field] == "/" + image["src"]

for fields in images.values():
    for src in fields.values():
        assert (ROOT / src.lstrip("/")).is_file(), f"Missing CMS default {src}"

image_map = json.loads((ROOT / "optimized/image-map.json").read_text())
for file in (ROOT / "v2/content/rooms").glob("*.json"):
    for src in json.loads(file.read_text())["gallery"]:
        src = src.replace("/images/legacy/rooms/", "/Rooms/")
        src = image_map.get(src, src)
        assert (ROOT / src.lstrip("/")).is_file(), f"{file.name}: missing gallery image {src}"

for icon in json.loads((ROOT / "site.webmanifest").read_text())["icons"]:
    assert (ROOT / icon["src"].lstrip("/")).is_file(), "Missing app icon"

print(f"PASS: {len(pages)} pages, {references} local references, every fixed image, all room gallery files and manifest icons")
