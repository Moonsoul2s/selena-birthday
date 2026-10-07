const CORRECT_PIN='0707';
const $=id=>document.getElementById(id);
const lockScreen=$('lockScreen'),birthdayScreen=$('birthdayScreen'),story=$('story');
const pins=[...document.querySelectorAll('.pin')],unlockBtn=$('unlockBtn'),pinHint=$('pinHint');
const blowBtn=$('blowBtn'),flame=$('flame'),startBtn=$('startBtn');
const revealDinnerBtn=$('revealDinnerBtn'),dinnerReveal=$('dinnerReveal');
const editToggle=$('editToggle'),editorPanel=$('editorPanel'),closeEditor=$('closeEditor');
const photoUploader=$('photoUploader'),clearPhotos=$('clearPhotos'),memoryStrip=$('memoryStrip');
const musicUploader=$('musicUploader'),previewMusic=$('previewMusic'),clearMusic=$('clearMusic');
const musicStatus=$('musicStatus'),bgMusic=$('bgMusic'),musicChip=$('musicChip'),musicToggle=$('musicToggle');
let db,currentMusicUrl=null;

const heroEyebrow=birthdayScreen?.querySelector('.eyebrow');
if(heroEyebrow) heroEyebrow.textContent='December 2 • just for you';
const editorHelp=editorPanel?.querySelector('.editor-block .editor-help');
if(editorHelp) editorHelp.textContent='Choose up to 8 photos here whenever you are ready. This private editor only appears in edit mode.';

function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('selenaBirthdayDB',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('assets'))r.result.createObjectStore('assets')};r.onsuccess=()=>{db=r.result;resolve(db)};r.onerror=()=>reject(r.error)})}
function dbSet(k,v){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(v,k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
function dbGet(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly'),r=tx.objectStore('assets').get(k);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbDelete(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete(k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}

pins.forEach((input,i)=>{input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,1);if(input.value&&i<pins.length-1)pins[i+1].focus()});input.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!input.value&&i>0)pins[i-1].focus()})});
function unlock(){const value=pins.map(p=>p.value).join('');if(value===CORRECT_PIN){lockScreen.classList.remove('active');birthdayScreen.classList.add('active');launchConfetti()}else{document.querySelector('.lock-card').classList.add('shake');pinHint.textContent='Not quite... try the date again ♡';setTimeout(()=>document.querySelector('.lock-card').classList.remove('shake'),360)}}
unlockBtn.addEventListener('click',unlock);pins[pins.length-1].addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});

blowBtn.addEventListener('click',()=>{flame.classList.add('out');blowBtn.textContent='Wish made ♡';blowBtn.disabled=true;setTimeout(()=>startBtn.classList.remove('hidden'),450)});
startBtn.addEventListener('click',async()=>{birthdayScreen.classList.remove('active');story.classList.remove('hidden');window.scrollTo({top:0,behavior:'instant'});if(bgMusic.src){try{await bgMusic.play();musicChip.classList.remove('paused');musicToggle.textContent='Ⅱ'}catch{musicChip.classList.add('paused');musicToggle.textContent='▶'}}});
document.querySelectorAll('.love-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('flipped')));
revealDinnerBtn.addEventListener('click',()=>{dinnerReveal.classList.remove('hidden');revealDinnerBtn.classList.add('hidden');dinnerReveal.scrollIntoView({behavior:'smooth',block:'center'})});

function launchConfetti(){const layer=$('confettiLayer'),palette=['#d78f99','#d8b77a','#f4c8cf','#e9ded9','#a85f69'];for(let i=0;i<52;i++){const bit=document.createElement('span');bit.className='confetti';bit.style.left=`${Math.random()*100}%`;bit.style.top=`${-10-Math.random()*30}px`;bit.style.background=palette[Math.floor(Math.random()*palette.length)];bit.style.animationDelay=`${Math.random()*.7}s`;bit.style.animationDuration=`${2.1+Math.random()*1.8}s`;layer.appendChild(bit);setTimeout(()=>bit.remove(),4300)}}

function renderPhotos(files){if(!files?.length)return;memoryStrip.innerHTML='';const captions=['Still one of my favorite days.','This one always makes me smile.','Just us being us.','More of this, please.','A moment I never want to forget.','My favorite person.','One for the memory book.','Always us. ♡'];files.slice(0,8).forEach((file,i)=>{const url=URL.createObjectURL(file),article=document.createElement('article');article.className=`polaroid ${i%2?'tilt-right':'tilt-left'}`;article.innerHTML=`<div class="photo"><img src="${url}" alt="Memory ${i+1}"></div><p>${captions[i]}</p>`;memoryStrip.appendChild(article)})}
async function loadSavedPhotos(){const photos=await dbGet('photos');if(photos?.length)renderPhotos(photos)}
photoUploader.addEventListener('change',async()=>{const files=[...photoUploader.files].slice(0,8);if(!files.length)return;await dbSet('photos',files);renderPhotos(files)});
clearPhotos.addEventListener('click',async()=>{await dbDelete('photos');location.reload()});

function applyMusicFile(file){if(currentMusicUrl)URL.revokeObjectURL(currentMusicUrl);currentMusicUrl=URL.createObjectURL(file);bgMusic.src=currentMusicUrl;musicChip.classList.remove('hidden');musicStatus.textContent=`Loaded: ${file.name}`}
async function loadSavedMusic(){const music=await dbGet('music');if(music)applyMusicFile(music)}
musicUploader.addEventListener('change',async()=>{const file=musicUploader.files[0];if(!file)return;await dbSet('music',file);applyMusicFile(file)});
previewMusic.addEventListener('click',async()=>{if(!bgMusic.src){musicStatus.textContent='Upload the song first.';return}if(bgMusic.paused){await bgMusic.play();previewMusic.textContent='Pause preview';musicChip.classList.remove('paused')}else{bgMusic.pause();previewMusic.textContent='Preview music';musicChip.classList.add('paused')}});
clearMusic.addEventListener('click',async()=>{bgMusic.pause();await dbDelete('music');bgMusic.removeAttribute('src');musicChip.classList.add('hidden');musicStatus.textContent='No audio uploaded yet.'});
musicToggle.addEventListener('click',async()=>{if(bgMusic.paused){await bgMusic.play();musicToggle.textContent='Ⅱ';musicChip.classList.remove('paused')}else{bgMusic.pause();musicToggle.textContent='▶';musicChip.classList.add('paused')}});

const editMode=new URLSearchParams(location.search).get('edit')==='1';
if(editMode)editToggle.classList.remove('hidden');
editToggle.addEventListener('click',()=>editorPanel.classList.remove('hidden'));
closeEditor.addEventListener('click',()=>editorPanel.classList.add('hidden'));

(async()=>{try{await openDB();await Promise.all([loadSavedPhotos(),loadSavedMusic()])}catch(e){console.warn('Local asset storage unavailable:',e)}})();
