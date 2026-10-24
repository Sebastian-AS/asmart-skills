#!/usr/bin/env python3
"""Check captured design assets against their provenance manifest."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'references/source-manifest.json').read_text())
entries = manifest['files'] + manifest.get('campus', {}).get('files', [])
errors = []
for entry in entries:
    path = (root / entry['asset']).resolve()
    if not path.is_relative_to(root):
        errors.append(entry['asset'] + ': outside library')
    elif not path.is_file():
        errors.append(entry['asset'] + ': missing')
    elif hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']:
        errors.append(entry['asset'] + ': hash mismatch')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'{len(entries)} captured design assets verified.')
