"""Campus-derived course library, data driven; no backend or customer content."""
from pathlib import Path
from html import escape as E
import shutil
import importlib.util
_ui_spec=importlib.util.spec_from_file_location('learning_product_ui',Path(__file__).resolve().parent/'ui.py')
_ui=importlib.util.module_from_spec(_ui_spec);_ui_spec.loader.exec_module(_ui)
L=Path(__file__).resolve().parent

def build_catalogue(output,modules):
 output=Path(output);assets=output/'assets';assets.mkdir(exist_ok=True)
 for name in ['catalogue.css','catalogue-background.js','product-ui.css','product-ui.js']:
  shutil.copy2(L/name,assets/name)
 shutil.copy2(L/'campus/constellation-field.js',assets/'constellation-field.js')
 for mid in ['agentes-y-skills']+[m['id']for m in modules]:
  if not (assets/'posters'/f'{mid}.jpg').exists():raise ValueError('Missing real video poster: '+mid)
 titles={m['id']:m['title']for m in modules};sections=''
 for group in ['Criterio y fundamentos','Trabajo con información','Sistemas de trabajo']:
  members=[m for m in modules if m['group']==group or group=='Sistemas de trabajo' and m['group']not in ['Criterio y fundamentos','Trabajo con información']]
  if not members:continue
  cards=''
  for m in members:
   mid=E(m['id']);base='modules/'+mid;sec=round(m['duration']);prereq=' · '.join(titles.get(x,x)for x in m['prerequisites'])
   cards+=f'''<article class="client-row" id="{mid}"><a class="lesson-link" href="{base}/presentation.html"><span class="poster"><img src="assets/posters/{mid}.jpg" alt="" loading="lazy" width="320" height="180"><span class="play-mark" aria-hidden="true">▶</span><span class="duration">{sec//60}:{sec%60:02}</span></span><span class="lesson-copy"><span class="number">Cápsula {mid[:2]}</span><h3>{E(m['title'])}</h3><span class="objective">{E(m['objective'])}</span></span></a><details class="lesson-details"><summary>Público y requisitos</summary><div><p><strong>Para quién:</strong> {E(m['audience'])}</p><p><strong>Antes de empezar:</strong> {E(prereq)}</p><p class="secondary-links"><a href="{base}/recursos.html">Guion y fuentes</a><a href="{base}/renders/capsula.mp4" download>Descargar MP4 · {m['mp4_bytes']/1e6:.1f} MB</a></p></div></details></article>'''
  sections+=f'<section class="client-library"><div class="section-heading"><h2>{E(group)}</h2><span>{len(members):02} cápsulas</span></div>{cards}</section>'
 # Fallback vector guarantees a branded field if WebGL is unavailable; only one engine is active.
 import importlib.util
 spec=importlib.util.spec_from_file_location('as_scene',L/'renderer.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
 bg=r.light_cables()
 return f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Trabajar con IA · ASmartSolution</title><link rel="stylesheet" href="assets/catalogue.css"><link rel="stylesheet" href="assets/product-ui.css"></head><body><a class="skip" href="#capsulas">Ir a las cápsulas</a><div class="landing-hero-region"><div class="animated-backdrop" aria-hidden="true"><div id="hero-network"></div><div id="field-fallback">{bg}</div><div class="animated-backdrop-scrim"></div></div>{_ui.render_header()}<section class="public-hero"><div class="hero-copy"><p class="eyebrow">Formación para el trabajo</p><h1>Entender la IA.<br>Trabajar con criterio.</h1><p class="hero-description">Conceptos claros, aplicaciones concretas y prácticas para pasar de una conversación a un trabajo que puedas comprobar.</p><a class="hero-action" href="#capsulas">Explorar las cápsulas <span aria-hidden="true">↓</span></a><p class="hero-footnote">11 cápsulas · a tu ritmo · con materiales locales</p></div><a class="featured" href="agentes-y-skills/index.html"><span class="feature-media"><img src="assets/posters/agentes-y-skills.jpg" alt="Mapa de funciones del módulo Agentes y skills" width="960" height="540"><span class="feature-play" aria-hidden="true">▶</span></span><span class="feature-caption"><span><small>El primer módulo</small><strong>Agentes y skills</strong></span><span class="feature-length">7:09 </span></span></a></section></div><main id="capsulas"><div class="course-heading"><div><p class="eyebrow">Biblioteca de aprendizaje</p><h2>Elige lo que necesitas aprender.</h2></div><p>Empieza por fundamentos, encargos y evidencia. Después, sigue la aplicación que te resulte útil.</p></div><p class="review-state">Edición para revisión. Las cápsulas nuevas están en revisión visual del usuario; la revisión audiovisual completa sigue pendiente.</p><div class="portal-grid admin-portal-grid"><div class="course-sections">{sections}</div><aside class="tool-library"><h2>Para practicar</h2><a class="tool-link" href="practicas/index.html"><span><strong>Materiales locales</strong><p>Datos, actas, prototipos y criterios para comprobar tu trabajo.</p></span></a><div class="route-note"><p class="eyebrow">Un recorrido posible</p><p>Comprender las capacidades. Formular un encargo. Verificar la respuesta. Llevarlo a una aplicación.</p><p>Para diseñar automatizaciones o pilotos, revisa primero cómo evaluar sus resultados.</p></div></aside></div></main>{_ui.render_footer()}<script src="assets/constellation-field.js"></script><script src="assets/catalogue-background.js"></script><script src="assets/product-ui.js"></script></body></html>'''
