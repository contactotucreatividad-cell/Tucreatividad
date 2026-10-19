const MAIL='contacto.tucreatividad@gmail.com';

// Aviso flotante
function aviso(t){
 let a=document.getElementById('aviso');
 if(!a){a=document.createElement('div');a.id='aviso';a.setAttribute('role','status');document.body.appendChild(a)}
 a.textContent=t;a.classList.add('ver');clearTimeout(a._t);a._t=setTimeout(()=>a.classList.remove('ver'),4000);
}

// Enlaces de correo: copian la dirección por si no hay app de correo configurada
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{
 a.addEventListener('click',()=>{
  if(navigator.clipboard)navigator.clipboard.writeText(MAIL).then(()=>aviso('Correo copiado: '+MAIL)).catch(()=>aviso('Escríbenos a '+MAIL));
  else aviso('Escríbenos a '+MAIL);
 });
});

// Formulario: se envía directamente a tu correo (sin abrir ninguna app)
const f=document.getElementById('form-contacto');
if(f){
 const estado=document.getElementById('estado');
 const btn=f.querySelector('button');
 f.addEventListener('submit',async e=>{
  e.preventDefault();
  estado.className='';
  if(f.web.value)return;
  if(!f.checkValidity()){estado.className='error';estado.textContent='Revisa los campos marcados: nombre, un email válido y tu mensaje son obligatorios.';f.reportValidity();return}
  const d=new FormData(f);d.delete('web');
  d.append('_subject','Presupuesto web: '+d.get('nombre'));
  d.append('_replyto',d.get('email'));
  d.append('_captcha','false');
  btn.disabled=true;estado.textContent='Enviando…';
  try{
   const r=await fetch('https://formsubmit.co/ajax/'+MAIL,{method:'POST',headers:{Accept:'application/json'},body:d});
   if(!r.ok)throw 0;
   estado.textContent='¡Mensaje enviado! Te respondemos en menos de 24 horas.';
   f.reset();
  }catch(_){
   estado.className='error';
   estado.innerHTML='No hemos podido enviarlo. Escríbenos directamente a <strong>'+MAIL+'</strong> o <a target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&to='+MAIL+'&su='+encodeURIComponent('Presupuesto web')+'&body='+encodeURIComponent(d.get('mensaje')||'')+'">ábrelo en Gmail</a>.';
  }finally{btn.disabled=false}
 });
}
