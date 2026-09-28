"""Check published local references without external dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1] / 'public'
errors = []

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                errors.append(f'Duplicate id: {attrs["id"]}')
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'img' and 'alt' not in attrs:
            errors.append('Image without alt attribute')
        for attr in ('href', 'src'):
            if attr in attrs:
                self.links.append(attrs[attr])

for file in ROOT.glob('*.html'):
    page = Page()
    page.feed(file.read_text())
    if page.h1 != 1:
        errors.append(f'{file.name}: expected one h1, got {page.h1}')
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc:
            continue
        target = (file.parent / unquote(parsed.path)).resolve() if parsed.path else file
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{file.name}: missing {link}')
        if parsed.fragment:
            destination = Page()
            destination.feed(target.read_text())
            if parsed.fragment not in destination.ids:
                errors.append(f'{file.name}: missing anchor {link}')
for css in ROOT.rglob('*.css'):
    for url in re.findall(r'url\([\"\']?([^\)\"\']+)', css.read_text()):
        if not url.startswith(('http:', 'https:', 'data:')) and not (css.parent / url).exists():
            errors.append(f'{css.name}: missing {url}')
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: local HTML/CSS assets, anchors, one h1 per page, image alt attributes.')
