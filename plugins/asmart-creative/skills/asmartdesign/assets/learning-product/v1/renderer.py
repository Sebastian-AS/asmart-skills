from pathlib import Path
import html, json, re, math
P=Path(__file__).resolve().parent
E=html.escape
css=(P/'design.css').read_text()
def light_cables():
 groups=[]
 for layer in range(3):
  strands=[]
  for j in range(6):
   n=layer*6+j
   d=f'M-150 {810+n*13} C320 {520+n*8} 640 {1220+n*4} 1040 {820+n*7} S1680 {360+n*8} 2090 {650+n*13}'
   strands.append(f'<path class="filament-halo" d="{d}"/><path class="filament-core" d="{d}"/><path class="light-pulse" data-phase="{n*.119}" pathLength="1" d="{d}"/>')
  groups.append(f'<g class="network-layer" data-ambient-band="{layer}">'+''.join(strands)+'</g>')
 return '<svg data-layout-allow-overflow="true" class="deck-network filament-field" viewBox="0 0 1920 1080" aria-hidden="true">'+''.join(groups)+'</svg>'
network=light_cables()
def icon(name):
 if not re.fullmatch(r'[a-z0-9-]+',name): raise ValueError('Invalid icon')
 svg=(P/'assets/icons'/f'{name}.svg').read_text()
 return re.sub(r'<svg[^>]*>', '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',svg,count=1)

def ambient_js(ident,start,duration):
 return f"""const ambient=gsap.timeline({{paused:true}});const absolute={start};const span={duration};root.querySelectorAll('.network-layer').forEach((el,j)=>{{const pose=t=>({{x:reduced?0:Math.sin((absolute+t)/21+j*2)*26,y:reduced?0:Math.cos((absolute+t)/27+j)*18,rotation:reduced?0:Math.sin((absolute+t)/49+j)*1.2}});const p=pose(0);ambient.fromTo(el,p,{{...pose(span),keyframes:Array.from({{length:Math.max(1,Math.ceil(span))}},(_,i)=>({{...pose((i+1)*span/Math.max(1,Math.ceil(span))),ease:'none'}})),duration:span,ease:'none',immediateRender:false}},0);}});root.querySelectorAll('.light-pulse').forEach(el=>{{const phase=Number(el.dataset.phase);ambient.fromTo(el,{{autoRound:false,strokeDashoffset:-phase-(reduced?0:absolute/28)}},{{autoRound:false,strokeDashoffset:-phase-(reduced?0:(absolute+span)/28),duration:span,ease:'none',immediateRender:false}},0);}});window.__backgroundPainters=window.__backgroundPainters||{{}};window.__backgroundPainters['{ident}']=t=>{{if(reduced)return;root.querySelectorAll('.network-layer').forEach((el,j)=>gsap.set(el,{{x:Math.sin(t/21+j*2)*26,y:Math.cos(t/27+j)*18,rotation:Math.sin(t/49+j)*1.2}}));root.querySelectorAll('.light-pulse').forEach(el=>gsap.set(el,{{autoRound:false,strokeDashoffset:-Number(el.dataset.phase)-t/28}}));}};tl.add(ambient,0);ambient.paused(false);window.__ambients=window.__ambients||{{}};window.__ambients['{ident}']=ambient;"""

def render_scene(s):
 """Render approved geometry. Caller chooses meaning, explicit icons, surface and cues."""
 if not re.fullmatch(r'[a-z][a-z0-9-]+',s['id']):raise ValueError('Invalid composition id')
 for value in [s['start'],s['duration'],*s['times']]:
  if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError('Times must be finite numbers')
 if s['start']<0 or s['duration']<=0:raise ValueError('Invalid scene span')
 k=s['kind']; records=s['items']; items=[(x['title'],x['body'])for x in records]
 expected={'pair':2,'columns':3,'flow':3,'code':2,'hero':2,'delegate':3}
 if k not in [*expected,'rows']:raise ValueError('Unknown component '+k)
 if k in expected and len(items)!=expected[k]:raise ValueError('Wrong component arity')
 if k=='rows' and not 1<=len(items)<=5:raise ValueError('Rows support 1 to 5 items')
 times=s['times']
 if len(times)!=len(items) or any(t<0 or t+.8>s['duration']for t in times):raise ValueError('Invalid cues')
 allowed={'','bubble-list','agent-comparison','stagger-pair','fan-cards','open-paper'}
 compatible={'bubble-list':('rows','floating'),'agent-comparison':('pair','floating'),'stagger-pair':('pair','floating'),'fan-cards':('columns','floating'),'open-paper':('code','paper')}
 if s.get('variant') in compatible and compatible[s['variant']]!=(k,s.get('surface')):raise ValueError('Incompatible component variant')
 tail=1.55 if k=='delegate' else 1.22 if k=='flow' else .8
 if k in ['delegate','flow'] and any(t+tail>s['duration']+.00001 for t in times[1:]):raise ValueError('Signal extends beyond scene')
 if s.get('variant','') not in allowed:raise ValueError('Unknown variant')
 if any(x.get('role','neutral') not in ['neutral','avoid','recommended','scope']for x in records):raise ValueError('Unknown semantic role')
 variant=' '+s.get('variant','')
 if s.get('surface') not in ['floating','paper']:raise ValueError('Explicit surface required')
 floating=s['surface']=='floating';ix=0;intro_duration=0
 semantics={'icons':[[x['icon']for x in records]],'signals':{'0':[(x.get('role','neutral'),x.get('label',''))for x in records]},'myths':{'0':s.get('myth','')}}
 for x in records:
  if x.get('role')=='avoid' and not x.get('label'):raise ValueError('Avoid requires visible label')
 def item(t,b,i,klass='deck-card'):
  signal=semantics['signals'].get(str(ix),[])
  role,label=signal[i] if signal else ('neutral','')
  badge=f'<span class="semantic-tag">{E(label)}</span>' if label else ''
  symbol=f'<span class="card-icon">{icon(semantics["icons"][ix][i])}</span>'
  return f'<article class="{klass} tone-{role}{" has-signal" if label else ""} reveal" data-cue="{times[i]}">{symbol}{badge}<h2>{E(t)}</h2><p>{E(b)}</p></article>'
 if k=='rows':
  content='<div class="deck-rows">'+''.join(item(t,b,i,'deck-row') for i,(t,b) in enumerate(items))+'</div>'
 elif k in ('pair','columns','flow'):
  content=f'<div class="deck-{k}">'+''.join(item(t,b,i,'deck-card'+(' emphasis' if k=='pair' and i==1 else '')) for i,(t,b) in enumerate(items))+'</div>'
  if k=='flow':
   content='<div class="flow-stage"><svg class="flow-wire" viewBox="0 0 1452 490"><path class="reveal" data-cue="'+str(times[1])+'" pathLength="1" d="M441 245 H505"/><path class="reveal" data-cue="'+str(times[2])+'" pathLength="1" d="M946 245 H1010"/></svg>'+content+'<i class="flow-packet" aria-hidden="true"></i></div>'
 elif k=='code':
  content=f'<div class="deck-code"><pre class="reveal" data-cue="{times[0]}"><span class="card-icon">{icon(semantics["icons"][ix][0])}</span>{E(items[0][1])}</pre><div class="code-context reveal" data-cue="{times[1]}"><span class="card-icon">{icon(semantics["icons"][ix][1])}</span><h2>{E(items[1][0])}</h2><p>{E(items[1][1])}</p></div></div>'
 elif k=='hero':
  content='<div class="hero-link reveal" data-cue="'+str(times[1])+'"></div><div class="deck-hero">'+item(*items[0],0,'deck-agent')+item(*items[1],1,'deck-method')+'</div>'
 elif k=='delegate':
  content='<div class="deck-delegate"><svg class="delegate-connectors" viewBox="0 0 1452 490"><path class="reveal" pathLength="1" data-cue="'+str(times[1])+'" d="M415 234 C575 234 620 115 780 115"/><path class="reveal" pathLength="1" data-cue="'+str(times[2])+'" d="M415 234 C575 234 620 375 780 375"/><circle class="delegate-packet top" r="8" fill="#d7e6ff" opacity="0"/><circle class="delegate-packet bottom" r="8" fill="#d7e6ff" opacity="0"/></svg>'+item(*items[0],0,'delegate-agent')+item(*items[1],1,'delegate-card top')+item(*items[2],2,'delegate-card bottom')+'</div>'
 myth=semantics['myths'].get(str(ix),'');myth_markup=f'<div class="deck-myth">{icon("circle-x")}<strong>Mito descartado:</strong><span>{E(myth)}</span></div>' if myth else ''
 html=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{E(s['title'])}</title></head><body><template><style>{css}\n#{s['id']}{{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}}</style><div id="{s['id']}" data-composition-id="{s['id']}" data-width="1920" data-height="1080" data-duration="{s['duration']}"><section id="frame-{s['id']}" class="deck-frame{variant} clip" data-start="0" data-duration="{s['duration']}" data-track-index="0">{network.replace("network-shade",s["id"]+"-shade").replace("network-mask",s["id"]+"-mask")}<div class="deck-meta"><span>{E(s.get('series','ASmartSolution / Curso IA'))}</span><span>{E(s['chapter'])}</span></div><div class="deck-rule"></div><h1 class="deck-title">{E(s['title'])}</h1><p class="deck-lead">{E(s['lead'])}</p>{myth_markup}<div class="deck-content{' floating' if floating else ' reading-paper'}">{content}</div><p class="deck-note">{E(s['note'])}</p><div class="deck-pagination">{s.get('number',1):02} / {s.get('total',1):02}</div></section></div><script>(()=>{{const root=document.getElementById('{s['id']}');const tl=gsap.timeline({{paused:true}});const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;{ambient_js(s['id'],s['start'],s['duration'])}const paper=root.querySelector('.reading-paper');if(paper)tl.fromTo(paper,{{opacity:0,scaleY:reduced?1:.94}},{{opacity:1,scaleY:1,duration:.4,ease:'power3.out',immediateRender:false}},Math.max(0,Number(paper.querySelector('.reveal')?.dataset.cue||0)-.2));tl.fromTo(root.querySelector('.deck-rule'),{{scaleX:0}},{{scaleX:1,duration:.6,ease:'power2.out'}},0);tl.fromTo(root.querySelector('.deck-title'),{{y:reduced?0:16,opacity:0}},{{y:0,opacity:1,duration:.42,ease:'power3.out'}},.05);root.querySelectorAll('.reveal').forEach((el,i)=>{{const at=Number(el.dataset.cue);if(el.tagName.toLowerCase()==='path'){{tl.fromTo(el,{{opacity:0,strokeDashoffset:1}},{{opacity:1,strokeDashoffset:0,duration:.6,ease:'power2.out',immediateRender:false}},at);}}else{{const card=el.matches('.deck-card,.deck-agent,.deck-method,.delegate-agent,.delegate-card'),row=el.matches('.deck-row'),fan=root.classList.contains('fan-cards'),flow=!!el.closest('.deck-flow'),hero=!!el.closest('.deck-hero');const n=[...el.parentElement.children].indexOf(el);const x=fan?(1-n)*260:hero?(n===0?-110:110):row?24:flow?-75:(n%2?90:-90);const y=fan?65:hero?30:card?48:row?0:12;const angle=fan?(n-1)*7:hero?(n===0?-7:6):card?(n%2?3:-3):0;tl.fromTo(el,{{x:reduced?0:x,y:reduced?0:y,scale:reduced?1:(card?.9:1),rotation:reduced?0:angle,opacity:0}},{{x:0,y:0,scale:1,rotation:0,opacity:1,duration:card?.72:row?.5:.48,ease:'power3.out',immediateRender:false}},at);const body=el.querySelector('p');if(body&&!reduced&&!row)tl.fromTo(body,{{clipPath:'inset(0% 100% 0% 0%)',x:14}},{{clipPath:'inset(0% 0% 0% 0%)',x:0,duration:.55,ease:'power2.out',immediateRender:false}},at+.1);}}}});root.querySelectorAll('.delegate-packet').forEach((dot,i)=>{{if(reduced)return;const at={json.dumps(times)}[i+1]+.65,endY=i===0?115:375;gsap.set(dot,{{attr:{{cx:415,cy:234}}}});const points=Array.from({{length:30}},(_,j)=>{{const t=(j+1)/30,u=1-t;return {{attr:{{cx:u*u*u*415+3*u*u*t*575+3*u*t*t*620+t*t*t*780,cy:u*u*u*234+3*u*u*t*234+3*u*t*t*endY+t*t*t*endY}},ease:'none'}};}});tl.fromTo(dot,{{opacity:0}},{{opacity:1,duration:.12,immediateRender:false}},at);tl.to(dot,{{keyframes:points,duration:.75,ease:'power1.inOut'}},at);tl.to(dot,{{opacity:0,duration:.15}},at+.75);}});const cards=root.querySelectorAll('.deck-flow .deck-card');cards.forEach((card,i)=>{{if(i<cards.length-1){{const at=Number(cards[i+1].dataset.cue)+.55;tl.fromTo(card,{{borderColor:'#6d8fc4'}},{{borderColor:'#d7e6ff',duration:.25,repeat:1,yoyo:true,immediateRender:false}},at);}}}});const packet=root.querySelector('.flow-packet');if(packet&&!reduced){{cards.forEach((card,i)=>{{if(i===0)return;const at=Number(card.dataset.cue)+.6;const origin=(i-1)*505;tl.fromTo(packet,{{x:origin,opacity:0}},{{x:origin+64,opacity:1,duration:.5,ease:'power1.inOut',immediateRender:false}},at);tl.to(packet,{{opacity:0,duration:.12}},at+.5);}});}}window.__timelines['{s['id']}']=tl;}})();</script></template></body></html>'''
 return html
