"""Presentation-only adaptation of Campus RestoredHeader, Shell.AccountMenu and Landing footer.
Campus session endpoints are deliberately replaced by an optional window.ASmartAccount adapter.
"""
from pathlib import Path
from html import escape as E
L=Path(__file__).resolve().parent
USER='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>'

def header_content(landing='index.html',practice='practicas/index.html',asset='assets/',title=''):
 return f'''<a class="restored-logo" href="{E(landing)}" aria-label="ASmartSolution, inicio del Curso IA"><img class="logo-img" src="{E(asset)}AS_Horizontal_B.svg" alt="ASmartSolution" width="220" height="52"></a><div class="course-navigation"><a class="restored-header-title" href="{E(landing)}">Curso IA</a><a class="material-link" href="{E(practice)}">Materiales de práctica</a></div><div class="restored-header-actions"><div class="restored-account" id="account-root"><button type="button" id="account-toggle" class="restored-account-toggle" aria-label="Cuenta" aria-expanded="false" aria-controls="restored-account-panel">{USER}</button><section id="restored-account-panel" class="restored-account-panel" aria-label="Cuenta" hidden><p class="restored-account-name" id="account-name">Cuenta</p><p class="restored-account-email" id="account-state">Edición local · sin sesión iniciada</p><nav aria-label="Cuenta"><a href="{E(landing)}">Inicio del curso</a><a href="{E(practice)}">Materiales de práctica</a><button type="button" id="account-connect" hidden>Iniciar sesión</button></nav></section></div></div>'''

def render_header():
 return '<header class="restored-header catalogue-header"><nav class="restored-header-inner" aria-label="Navegación principal">'+header_content()+'</nav></header>'

def render_footer():
 return '''<footer class="public-footer"><a class="brand" href="index.html" aria-label="ASmartSolution, inicio del Curso IA"><img src="assets/AS_Horizontal_B.svg" alt="ASmartSolution" width="155" height="37"></a><p>© 2026 ASmartSolution. Todos los derechos reservados.</p><button class="footer-account" type="button" data-open-account>Cuenta</button></footer>'''

def render_player(module):
 shell=(L/'presentation/player-shell.html').read_text()
 req=module.get('prerequisites',[])
 if isinstance(req,list): req=' · '.join(req)
 dialog=f'''<dialog class="module-information" id="module-information" aria-labelledby="module-info-title"><div class="information-heading"><h2 id="module-info-title">{E(module['title'])}</h2><button type="button" class="media-control" data-close-info aria-label="Cerrar información"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><dl><dt>Objetivo</dt><dd>{E(module.get('objective',''))}</dd><dt>Público</dt><dd>{E(module.get('audience',''))}</dd><dt>Conocimientos previos</dt><dd>{E(req)}</dd></dl><nav aria-label="Más información"><a href="recursos.html">Guion y fuentes</a><a href="../../practicas/index.html">Materiales de práctica</a><a href="../../index.html">Colección</a></nav></dialog>'''
 duration=float(module.get('duration',sum(x.get('duration',0) for x in module.get('scenes',[]))))
 sec=round(duration)
 values={'TITLE':E(module['title']),'HEADER_CONTENT':header_content('../../index.html','../../practicas/index.html'),'MODULE_ID':E(module['id']),'INFO_DIALOG':dialog,'SCENE_COUNT':str(len(module.get('scenes',[]))),'DURATION':str(duration),'CLOCK':f'{sec//60}:{sec%60:02d}'}
 for key,value in values.items(): shell=shell.replace('{{'+key+'}}',value)
 if '{{' in shell: raise ValueError('Unresolved player shell placeholder')
 return shell
