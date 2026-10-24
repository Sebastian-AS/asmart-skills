#!/usr/bin/env python3
"""Audit the shared-scene module format; does not certify editorial or audiovisual quality."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
import math
from pathlib import Path
import sys

class Cues(HTMLParser):
    def __init__(self):
        super().__init__(); self.values=[]
    def handle_starttag(self, tag, attrs):
        for key,value in attrs:
            if key=='data-cue': self.values.append(value)

def audit(project, web, scenes_path):
    errors=[]; warnings=[]
    def fail(message): errors.append(message)
    scenes=json.loads((project/scenes_path).read_text())
    if not isinstance(scenes,list) or not scenes: raise ValueError('Scene list must be nonempty.')
    seen=set(); previous=0.; count=0
    for i,scene in enumerate(scenes):
        name=scene.get('id'); label=f'scene {i+1} ({name})'
        if not name or name in seen: fail(f'{label}: missing or duplicate ID')
        seen.add(name)
        start,end,duration=(float(scene[k]) for k in ('start','end','duration'))
        if not all(math.isfinite(v) for v in (start,end,duration)) or start<0 or duration<=0 or end<=start:
            fail(f'{label}: invalid timing');continue
        if abs(start-previous)>.05:fail(f'{label}: unexpected gap/overlap with previous scene')
        if abs(end-start-duration)>.05:fail(f'{label}: inconsistent duration')
        previous=end
        src=Path(scene['src'])
        if src.is_absolute() or '..' in src.parts:fail(f'{label}: source must be project relative');continue
        original=project/src; shipped=web/src
        if not original.is_file() or not shipped.is_file():fail(f'{label}: source or shipped composition missing');continue
        if hashlib.sha256(original.read_bytes()).digest()!=hashlib.sha256(shipped.read_bytes()).digest():
            fail(f'{label}: shipped composition differs from editable source')
        parser=Cues();parser.feed(original.read_text())
        for value in parser.values:
            count+=1
            try: cue=float(value)
            except (ValueError,TypeError):fail(f'{label}: nonnumeric cue');continue
            if not math.isfinite(cue) or cue<0 or cue>=duration:fail(f'{label}: cue outside scene: {value}')
    if not (web/'index.html').is_file():fail('Web entry index.html missing')
    shipped_scenes=web/scenes_path
    if not shipped_scenes.is_file() or json.loads(shipped_scenes.read_text())!=scenes:
        fail('Shipped scene manifest missing or differs from source')
    sizes={'code_fonts_assets':0,'compressed_audio':0,'mp4':0,'other':0}
    forbidden={'.wav','.onnx','.safetensors','.pt','.pth'}
    for f in web.rglob('*'):
        if not f.is_file():continue
        rel=f.relative_to(web)
        if any(x in {'node_modules','.venv','.git','__pycache__','.cache'} for x in rel.parts) or f.suffix.lower() in forbidden:
            fail(f'Production-only resource shipped: {rel}')
        suffix=f.suffix.lower()
        group='mp4' if suffix=='.mp4' else 'compressed_audio' if suffix in {'.m4a','.mp3','.ogg','.opus','.aac'} else 'code_fonts_assets' if suffix in {'.html','.css','.js','.json','.svg','.woff','.woff2','.png','.jpg','.webp','.txt'} else 'other'
        sizes[group]+=f.stat().st_size
    if not sizes['compressed_audio']:warnings.append('No compressed audio found; verify whether this module is intentionally silent.')
    return {'scope':'Scene timing, cue bounds, source/bundle consistency, file inventory and bytes only. Not semantic sync, browser interaction, listening or MP4 certification.',
            'scenes':len(scenes),'cues':count,'duration_seconds':previous,'bytes':sizes,'total_bytes':sum(sizes.values()),
            'checks_passed':not errors,'errors':errors,'warnings':warnings}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project',type=Path,required=True);p.add_argument('--web',type=Path,default=Path('web'))
    p.add_argument('--scenes',type=Path,default=Path('presentation/slides.json'));p.add_argument('--output',type=Path)
    args=p.parse_args();project=args.project.resolve();web=args.web if args.web.is_absolute() else project/args.web
    try:report=audit(project,web,args.scenes)
    except (OSError,ValueError,KeyError,TypeError) as e:report={'checks_passed':False,'errors':[str(e)],'scope':'Mechanical audit could not complete.'}
    out=json.dumps(report,ensure_ascii=False,indent=2)
    if args.output:args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(out+'\n')
    print(out);return 0 if report['checks_passed'] else 1
if __name__=='__main__':sys.exit(main())
