/* Campus AccountMenu state pattern, without Campus API/session bindings.
   Optional integration: window.ASmartAccount = { getState(): Promise<{name,label}>, open(): void }.
   Dispatch asmart:account-ready after installing the adapter dynamically. No data or credentials stored here. */
(()=>{'use strict';
const root=document.getElementById('account-root'),toggle=document.getElementById('account-toggle'),panel=document.getElementById('restored-account-panel');
const setOpen=(open,restore=false)=>{if(!toggle||!panel)return;panel.hidden=!open;panel.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));if(restore)toggle.focus();};
toggle?.addEventListener('click',()=>setOpen(panel.hidden));
document.querySelectorAll('[data-open-account]').forEach(button=>button.addEventListener('click',()=>{setOpen(true);toggle.focus();}));
document.addEventListener('pointerdown',e=>{if(root&&!root.contains(e.target)&&!e.target.closest('[data-open-account]'))setOpen(false);});
root?.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))setOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){setOpen(false,true);e.stopPropagation();}},true);
const connect=document.getElementById('account-connect');
async function updateAccount(){const adapter=window.ASmartAccount;if(!adapter)return;try{const state=await adapter.getState?.();if(state?.name)document.getElementById('account-name').textContent=state.name;if(state?.label)document.getElementById('account-state').textContent=state.label;if(connect&&typeof adapter.open==='function'){connect.hidden=false;connect.textContent=state?.name?'Abrir cuenta':'Iniciar sesión';connect.onclick=()=>adapter.open();}}catch{document.getElementById('account-state').textContent='No se pudo comprobar la cuenta.';}}
window.addEventListener('asmart:account-ready',updateAccount);updateAccount();
const info=document.getElementById('module-info'),dialog=document.getElementById('module-information');
info?.addEventListener('click',()=>dialog.showModal());
dialog?.querySelector('[data-close-info]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>info.focus());
})();
