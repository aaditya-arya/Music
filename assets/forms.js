(() => {
 document.addEventListener('click',e=>{const btn=e.target.closest('[data-aes-role]');if(btn){const select=document.getElementById('appPosition');if(select)select.value=btn.dataset.aesRole;document.getElementById('applyForm')?.scrollIntoView({behavior:'smooth'});}});
 document.querySelectorAll('form[data-aes-form]').forEach(form=>{
  form.removeAttribute('onsubmit');form.onsubmit=null;
  const trap=document.createElement('div');trap.className='aes-trap';trap.setAttribute('aria-hidden','true');trap.innerHTML='<label>Leave blank<input name="website" tabindex="-1" autocomplete="off"></label>';form.appendChild(trap);
  const status=document.createElement('p');status.className='aes-form-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.appendChild(status);
  if(form.querySelector('input[type=file]')){const note=document.createElement('p');note.className='text-xs text-slate-500';note.textContent='Attachments: PDF, JPG or PNG, up to 2 MB per file. Documents are accessible only to the website administrator.';status.before(note);}
  form.addEventListener('submit',async e=>{
   e.preventDefault();e.stopImmediatePropagation();if(form.dataset.busy)return;if(!form.reportValidity())return;
   const fields=[];const data=new FormData();let index=0;let invalid='';
   form.querySelectorAll('input,select,textarea').forEach(el=>{
    if(el.disabled||['submit','button','reset'].includes(el.type)||el.name==='website')return;
    if(['checkbox','radio'].includes(el.type)&&!el.checked)return;
    if(el.type==='file'){for(const f of el.files){if(f.size>2*1024*1024)invalid='Each attachment must be under 2 MB.';data.append('attachment_'+index++,f);}return;}
    const label=el.dataset.aesLabel||el.labels?.[0]?.textContent?.trim()||el.parentElement.querySelector('label')?.textContent?.trim()||el.placeholder||el.name||el.id||'Additional detail';
    fields.push({name:el.name||el.id||'dynamic_'+index++,label,value:el.value});
   });
   if(invalid){status.textContent=invalid;status.dataset.error='true';return;}
   data.append('action','aes_submit');data.append('nonce',AES.nonce);data.append('form',form.dataset.aesForm);data.append('fields',JSON.stringify(fields));data.append('website',form.querySelector('[name=website]').value);
   const buttons=[...form.querySelectorAll('[type=submit]')];buttons.forEach(b=>b.disabled=true);form.dataset.busy='1';status.textContent='Saving your submission…';status.dataset.error='false';
   try{const response=await fetch(AES.ajax,{method:'POST',body:data,credentials:'same-origin'});const result=await response.json();if(!response.ok||!result.success)throw Error(result.data?.message||'Submission failed. Please try again.');status.textContent=result.data.message;status.dataset.error='false';form.reset();if(form.id==='reasonWiseForm'&&typeof window.selectReason==='function')window.selectReason('inquiry');}
   catch(err){status.textContent=err.message||'Connection failed. Your submission was not confirmed. Please try again.';status.dataset.error='true';}
   finally{buttons.forEach(b=>b.disabled=false);delete form.dataset.busy;}
  },true);
 });
})();
