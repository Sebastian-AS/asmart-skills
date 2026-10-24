"""Build the ASmart learning component gallery; optional isolated HyperFrames proof."""
from pathlib import Path
import argparse, importlib.util,json,shutil
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);parser.add_argument('--proof',type=Path);parser.add_argument('--library',type=Path);args=parser.parse_args()
L=args.library or Path(__file__).resolve().parents[1]/'assets/learning-product/v1';O=args.output;O.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('asmart_renderer',L/'renderer.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
scenes=json.loads((L/'examples.json').read_text());(O/'compositions').mkdir(exist_ok=True)
shutil.copytree(L/'assets',O/'assets',dirs_exist_ok=True)
for s in scenes:(O/'compositions'/f'{s["id"]}.html').write_text(module.render_scene(s))
(O/'examples.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2));shutil.copy2(L/'gallery.html',O/'index.html')
if args.proof:
 P=args.proof;P.mkdir(parents=True,exist_ok=True);shutil.copytree(O/'assets',P/'assets',dirs_exist_ok=True);shutil.copytree(O/'compositions',P/'compositions',dirs_exist_ok=True)
 for i,s in enumerate(scenes):
  (P/'compositions'/f'{s["id"]}.html').write_text(module.render_scene(dict(s,start=i*12)))
 hosts=''.join(f'<div id="{s["id"]}" class="clip" data-composition-id="{s["id"]}" data-composition-src="compositions/{s["id"]}.html" data-start="{i*12}" data-duration="12" data-track-index="0" data-width="1920" data-height="1080"></div>'for i,s in enumerate(scenes))
 (P/'index.html').write_text('<!doctype html><html lang="es"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}.clip{position:absolute;inset:0;width:100%;height:100%}#root{position:relative;width:100%;height:100%}</style></head><body>'+f'<div id="root" data-composition-id="main" data-width="1920" data-height="1080" data-duration="{len(scenes)*12}">{hosts}</div><script src="assets/gsap.min.js"></script><script>window.__timelines.main=gsap.timeline({{paused:true}});</script></body></html>')
 (P/'hyperframes.json').write_text(json.dumps({'paths':{'compositions':'compositions','assets':'assets'},'authoringSkill':'general-video'}))
 (P/'package.json').write_text(json.dumps({'private':True,'scripts':{'check':'npx --yes hyperframes@0.8.163 check'}}))
print('Generated',len(scenes),'shared components at',O)
