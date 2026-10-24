"""Parameterized opening and closing, ported from approved presentation/covers.py."""
from pathlib import Path
import html,math
from renderer import css,network,icon,ambient_js
E=html.escape
EXTRA=(Path(__file__).resolve().parent/'covers.css').read_text()
def render_cover(s):
 ident=s['id'];kind=s['kind'];duration=s['duration'];start=s['start']
 if kind not in ['intro','outro'] or duration<=0:raise ValueError('Invalid cover')
 agenda=''
 if kind=='intro':
  for item in s['agenda']:
   cue=item['cue']
   if not math.isfinite(cue)or cue<0 or cue+.5>duration:raise ValueError('Cover cue out of range')
   agenda+=f'<article class="deck-card reveal" data-cue="{cue}"><span class="card-icon">{icon(item["icon"])}</span><h2>{E(item["title"])}</h2></article>'
  content=f'<h1 class="deck-title">{E(s["display_title"])}</h1><p class="deck-lead">Bienvenido a tu módulo</p><div class="cover-agenda">{agenda}</div>'
 else:
  content=f'<h1 class="deck-title">Consultas</h1><p class="deck-lead">{E(s["domain"])}</p><p class="contact-phone">{E(s["phone_display"])}</p><div class="future-social-space" aria-hidden="true"></div>'
 js=f"const root=document.getElementById('{ident}'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,tl=gsap.timeline({{paused:true}});"+ambient_js(ident,start,duration)
 js+="root.querySelectorAll('.reveal').forEach(el=>tl.fromTo(el,{opacity:0,y:reduced?0:20},{opacity:1,y:0,duration:.5,ease:'power3.out',immediateRender:false},Number(el.dataset.cue)));tl.fromTo(root.querySelector('.cover-logo'),{opacity:0,y:reduced?0:10},{opacity:1,y:0,duration:.5,ease:'power3.out'},.05);"
 if kind=='outro':js+=f"tl.to(root.querySelector('.cover-fade'),{{opacity:0,duration:1,ease:'power1.inOut'}},{duration-1});"
 js+=f"window.__timelines['{ident}']=tl;"
 return f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{E(s['title'])}</title></head><body><template><style>{css}{EXTRA}#{ident}{{position:absolute;inset:0;width:100%;height:100%}}</style><div id="{ident}" data-composition-id="{ident}" data-width="1920" data-height="1080" data-duration="{duration}"><section id="frame-{ident}" class="deck-frame cover-{kind} clip" data-start="0" data-duration="{duration}" data-track-index="0"><div class="cover-fade">{network}<img class="cover-logo" src="assets/AS_Horizontal_B.svg" alt="ASmartSolution">{content}</div></section></div><script>(()=>{{{js}}})();</script></template></body></html>'''
