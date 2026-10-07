const CORRECT_PIN='0707';
const $=id=>document.getElementById(id);
const pins=[...document.querySelectorAll('.pin')];
const lockScreen=$('lockScreen'),lockCard=$('lockCard'),birthdayContent=$('birthdayContent');
const unlockBtn=$('unlockBtn'),pinHint=$('pinHint'),wishBtn=$('wishBtn'),wishIcon=$('wishIcon');
const editToggle=$('editToggle'),editorPanel=$('editorPanel'),closeEditor=$('closeEditor');
const photoUploader=$('photoUploader'),clearPhotos=$('clearPhotos'),memoryStrip=$('memoryStrip');
const musicUploader=$('musicUploader'),previewMusic=$('previewMusic'),clearMusic=$('clearMusic');
const musicStatus=$('musicStatus'),bgMusic=$('bgMusic'),musicChip=$('musicChip'),musicToggle=$('musicToggle');
const revealDinnerBtn=$('revealDinnerBtn'),dinnerReveal=$('dinnerReveal');
let db,currentMusicUrl=null;

function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('selenaBirthdayDB',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('assets'))r.result.createObjectStore('assets')};r.onsuccess=()=>{db=r.result;resolve(db)};r.onerror=()=>reject(r.error)})}
function dbSet(k,v){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(v,k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
function dbGet(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly');const r=tx.objectStore('assets').get(k);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbDelete(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete(k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}

pins.forEach((input,i)=>{input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,1);if(input.value&&i<pins.length-1)pins[i+1].focus()});input.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!input.value&&i>0)pins[i-1].focus();if(e.key==='Enter'&&i===pins.length-1)unlock()})});
function unlock(){const value=pins.map(p=>p.value).join('');if(value===CORRECT_PIN){lockScreen.classList.add('hidden');birthdayContent.classList.remove('hidden');window.scrollTo({top:0,behavior:'instant'});setTimeout(()=>wishBtn?.focus(),250)}else{lockCard.classList.add('shake');pinHint.textContent='Not quite... try the date again ♡';setTimeout(()=>lockCard.classList.remove('shake'),360)}}
unlockBtn.addEventListener('click',unlock);

wishBtn.addEventListener('click',async()=>{wishBtn.innerHTML='<span class="text-xs text-[#e4b9a9]">Wish made ♡ Start your birthday story</span><span>✨</span>';wishIcon?.remove();document.getElementById('moments')?.scrollIntoView({behavior:'smooth',block:'start'});if(bgMusic.src){try{await bgMusic.play();musicToggle.textContent='Ⅱ'}catch{musicToggle.textContent='▶'}}});

revealDinnerBtn.addEventListener('click',()=>{dinnerReveal.classList.toggle('hidden');revealDinnerBtn.textContent=dinnerReveal.classList.contains('hidden')?"Tap for tonight's plan":'Tonight ♡'});

function renderPhotos(files){if(!files?.length)return;const captions=['Still one of my favorite days.','This one always makes me smile.','Just us being us.','More of this, please.','A moment I never want to forget.','My favorite person.','One for the memory book.','Always us. ♡'];memoryStrip.innerHTML='';files.slice(0,8).forEach((file,i)=>{const url=URL.createObjectURL(file);const card=document.createElement('article');card.className='min-w-[240px] max-w-[240px] bg-[#24140f] border border-[#44271e] rounded-2xl p-3 shadow-md flex-shrink-0';card.innerHTML=`<div class="w-full h-44 rounded-xl bg-[#341b14] overflow-hidden mb-3"><img src="${url}" alt="Memory ${i+1}" class="w-full h-full object-cover"></div><span class="text-[10px] uppercase tracking-widest text-[#9d7d74] font-bold">Photo ${i+1}</span><p class="text-xs text-[#f2e2db] font-medium mt-0.5">${captions[i]}</p>`;memoryStrip.appendChild(card)})}
async function loadSavedPhotos(){const photos=await dbGet('photos');if(photos?.length)renderPhotos(photos)}
photoUploader.addEventListener('change',async()=>{const files=[...photoUploader.files].slice(0,8);if(!files.length)return;await dbSet('photos',files);renderPhotos(files)});
clearPhotos.addEventListener('click',async()=>{await dbDelete('photos');location.reload()});

function applyMusicFile(file){if(currentMusicUrl)URL.revokeObjectURL(currentMusicUrl);currentMusicUrl=URL.createObjectURL(file);bgMusic.src=currentMusicUrl;musicChip.classList.remove('hidden');musicStatus.textContent=`Loaded: ${file.name}`}
async function loadSavedMusic(){const music=await dbGet('music');if(music)applyMusicFile(music)}
musicUploader.addEventListener('change',async()=>{const file=musicUploader.files[0];if(!file)return;await dbSet('music',file);applyMusicFile(file)});
previewMusic.addEventListener('click',async()=>{if(!bgMusic.src){musicStatus.textContent='Upload the song first.';return}if(bgMusic.paused){await bgMusic.play();previewMusic.textContent='Pause preview';musicToggle.textContent='Ⅱ'}else{bgMusic.pause();previewMusic.textContent='Preview music';musicToggle.textContent='▶'}});
clearMusic.addEventListener('click',async()=>{bgMusic.pause();await dbDelete('music');bgMusic.removeAttribute('src');musicChip.classList.add('hidden');musicStatus.textContent='No audio uploaded yet.';musicToggle.textContent='▶'});
musicToggle.addEventListener('click',async()=>{if(bgMusic.paused){await bgMusic.play();musicToggle.textContent='Ⅱ'}else{bgMusic.pause();musicToggle.textContent='▶'}});

const editMode=new URLSearchParams(location.search).get('edit')==='1';
if(editMode)editToggle.classList.remove('hidden');
editToggle.addEventListener('click',()=>editorPanel.classList.remove('hidden'));
closeEditor.addEventListener('click',()=>editorPanel.classList.add('hidden'));
editorPanel.addEventListener('click',e=>{if(e.target===editorPanel)editorPanel.classList.add('hidden')});

(async()=>{try{await openDB();await Promise.all([loadSavedPhotos(),loadSavedMusic()])}catch(e){console.warn('Local asset storage unavailable:',e)}})();