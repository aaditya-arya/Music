(() => {
 document.querySelectorAll('.aes-controls').forEach(root=>{
  const sync=()=>{const values={};root.querySelectorAll('.aes-value').forEach(el=>values[el.dataset.key]=el.value);root.querySelector('.aes-json').value=JSON.stringify(values);};
  sync();root.addEventListener('input',sync);root.closest('form')?.addEventListener('submit',sync);
  root.querySelector('.aes-filter').addEventListener('input',e=>{const q=e.target.value.toLowerCase();root.querySelectorAll('.aes-group').forEach(group=>{let hits=0;group.querySelectorAll('.aes-row').forEach(row=>{const match=(row.textContent+' '+row.querySelector('textarea').value).toLowerCase().includes(q);row.hidden=!match;hits+=match?1:0;});group.hidden=!hits;if(q&&hits)group.open=true;});});
  root.querySelectorAll('.aes-media').forEach(btn=>btn.addEventListener('click',()=>{const frame=wp.media({title:'Select an image or document',multiple:false});frame.on('select',()=>{btn.parentElement.querySelector('textarea').value=frame.state().get('selection').first().toJSON().url;sync();});frame.open();}));
 });
})();
