"""Hash actual video inputs, excluding the independent player interface."""
from pathlib import Path
import json,hashlib

def video_inputs(project):
 p=Path(project);slides=json.loads((p/'presentation/slides.json').read_text());names=['index.html','presentation/slides.json','audio/narration.m4a','audio/music.m4a','assets/gsap.min.js','assets/AS_Horizontal_B.svg','assets/font/Outfit-latin.woff2','assets/font/SourceSans3-latin.woff2']+[s['src']for s in slides]
 return {name:hashlib.sha256((p/name).read_bytes()).hexdigest()for name in names}
