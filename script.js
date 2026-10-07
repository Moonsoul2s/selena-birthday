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

const loveReasons=[
'Anh yêu cách em luôn quan tâm đến mọi người, dù nhiều lúc em không nói ra. 💖',
'Anh yêu nụ cười của em, nhất là những lúc em cười thật tự nhiên và làm anh cũng vui theo. 😊',
'Anh yêu cảm giác những ngày bình thường cũng trở nên đặc biệt hơn khi có em bên cạnh. ✨',
'Anh yêu sự cố gắng và mạnh mẽ của em, dù nhiều lúc em cũng cứng đầu vi ci eo. 😌',
'Anh yêu cả những lúc em giận dỗi rồi tự làm hết việc nhà một mình. Vừa làm anh lo, vừa làm anh thấy em dễ thương không chịu nổi. 🥹',
'Anh yêu cảm giác được có em trong cuộc sống của anh, vì mọi thứ tự nhiên ấm áp hơn. 🤍',
'Anh yêu những lúc em vui vẻ và nói chuyện nhiều, nhìn em lúc đó làm anh thấy nhẹ lòng. 🌷',
'Anh yêu cả những lúc em im im, vì anh biết trong đầu em đang nghĩ cả trăm thứ cùng lúc. 😂',
'Anh yêu cách em vừa mạnh mẽ vừa rất mềm lòng với những người em thương. 🫶',
'Anh yêu cảm giác được ăn cùng em, dù câu hỏi khó nhất vẫn luôn là “hôm nay ăn gì?”. 🍜',
'Anh yêu cách em chăm chút cho những điều nhỏ nhặt mà người khác có thể chẳng để ý. 🌸',
'Anh yêu những lúc em làm bộ không quan tâm nhưng thật ra để ý hết mọi thứ. 👀',
'Anh yêu cách em cố gắng cho gia đình và cho những người em thương. ❤️',
'Anh yêu cả những lúc em hơi khó chiều, vì cuối cùng anh vẫn muốn chiều em thôi. 😏',
'Anh yêu cách em làm cho một căn nhà có cảm giác giống “nhà” hơn. 🏡',
'Anh yêu những lúc em mệt nhưng vẫn cố gắng hoàn thành những gì em cần làm. 🌙',
'Anh yêu cách em khiến anh muốn cố gắng hơn cho tương lai của hai đứa. 🌱',
'Anh yêu những lúc hai đứa không cần làm gì đặc biệt, chỉ ở cạnh nhau thôi cũng đủ vui. ☁️',
'Anh yêu cả mấy lúc em cằn nhằn anh, dù lúc đó anh sẽ không bao giờ thừa nhận điều này đâu. 😂',
'Anh yêu cảm giác sau tất cả những chuyện vui buồn, anh vẫn muốn người bên cạnh mình là em. ♡',
'Anh yêu cái kiểu em nói “không sao” nhưng nhìn mặt là anh biết có sao rất nhiều. 😂',
'Anh yêu những lúc hai đứa ngồi ăn rồi nói đủ thứ chuyện trên trời dưới đất. 🍲',
'Anh yêu cách em chăm chút cho nhà cửa; nhiều thứ em làm anh chỉ nhận ra sau khi nhìn kỹ. 🏠',
'Anh yêu những lúc em đang giận mà vẫn quan tâm anh như bình thường, chỉ là mặt khó ở hơn chút thôi. 😒❤️',
'Anh yêu cách em nhớ những chuyện nhỏ anh nói, kể cả khi chính anh còn quên mất. 🥹',
'Anh yêu những lúc em kể chuyện rồi càng kể càng nhập tâm, còn anh chỉ ngồi nhìn em nói thôi cũng vui. 😂',
'Anh yêu việc mình có thể làm những chuyện rất bình thường cùng nhau mà vẫn thấy nó vui hơn khi có em. 🤍',
'Anh yêu những lúc em mệt nhưng vẫn cố làm cho xong mọi thứ; anh vừa thương vừa muốn bắt em nghỉ cho rồi. 🥺',
'Anh yêu cái kiểu em có ý kiến rất mạnh về một chuyện nhỏ xíu như thể đó là chuyện quan trọng nhất thế giới. 😂',
'Anh yêu cảm giác được về nhà và biết là có em ở đó. 🏠❤️',
'Anh yêu cách em có thể làm anh hết giận chỉ bằng một biểu cảm rất ngốc. 😭',
'Anh yêu cách em để ý xem mọi người đã ăn chưa, ổn không, cần gì không. 🍚',
'Anh yêu những lúc em ngủ ngon lành còn anh nhìn qua thấy yên tâm một cách rất lạ. 🌙',
'Anh yêu cách em nghiêm túc với những điều em thật sự quan tâm. 💪',
'Anh yêu mấy lúc em quyết định một chuyện rất nhanh rồi sau đó quay sang hỏi anh “được không?”. 😂',
'Anh yêu cách em làm những nơi quen thuộc trở nên có kỷ niệm chỉ vì mình từng đi cùng nhau. 📍',
'Anh yêu những lúc em mặc đồ đẹp rồi giả bộ như không biết mình đẹp. 😌',
'Anh yêu cách em vẫn có thể làm anh cười ngay cả khi ngày hôm đó của anh không tốt. ☀️',
'Anh yêu những lúc em cần anh, vì nó làm anh cảm thấy mình có một vị trí thật sự trong cuộc sống của em. 🤍',
'Anh yêu cách em khiến những bữa ăn đơn giản cũng có cảm giác như một buổi hẹn. 🍽️',
'Anh yêu khi em hào hứng kể về một thứ em thích và mắt em tự nhiên sáng lên. ✨',
'Anh yêu những lúc em giả vờ giận lâu nhưng thật ra mềm lòng rất nhanh. 😏',
'Anh yêu cách em lo cho những người thân yêu trước cả khi nghĩ đến bản thân mình. 🫶',
'Anh yêu những khoảnh khắc hai đứa chỉ lái xe đâu đó mà chẳng cần kế hoạch gì lớn. 🚗',
'Anh yêu những lúc mình cùng nhau mua đồ linh tinh mà cuối cùng lại thành một kỷ niệm. 🛒',
'Anh yêu cách em làm anh nhớ rằng đôi khi niềm vui chỉ cần là một bữa ăn ngon và người mình thích ngồi đối diện. 🍜',
'Anh yêu những lúc em không cần nói gì mà anh vẫn biết em muốn được ôm. 🤗',
'Anh yêu cách em cố gắng tự làm mọi thứ, dù đôi khi anh ước em chịu để anh giúp nhiều hơn. 🥹',
'Anh yêu những lúc em tìm anh để kể chuyện đầu tiên, dù đó là chuyện lớn hay chuyện nhỏ. 💬',
'Anh yêu cái cách em có thể khiến anh vừa bực vừa buồn cười trong cùng một phút. 😂',
'Anh yêu những lúc em chuẩn bị đồ đạc kỹ đến mức anh chỉ việc đi theo. 👜',
'Anh yêu cách em khiến anh muốn chụp lại những khoảnh khắc bình thường vì sau này anh biết mình sẽ nhớ. 📸',
'Anh yêu những hôm mình chẳng làm được gì như kế hoạch nhưng cuối cùng vẫn vui vì có nhau. 🤍',
'Anh yêu khi em dựa vào anh, dù chỉ là một chút. 🫶',
'Anh yêu cái mặt của em mỗi khi anh nói đúng điều em đang nghĩ nhưng em không muốn thừa nhận. 😌',
'Anh yêu những lúc em chăm sóc người khác theo cách rất tự nhiên mà không cần ai khen. 🌷',
'Anh yêu cách em luôn muốn mọi thứ tốt hơn cho những người em thương. 💗',
'Anh yêu những cuộc nói chuyện linh tinh trước khi ngủ mà chẳng có chủ đề gì rõ ràng. 🌙',
'Anh yêu những lúc hai đứa cùng mệt nhưng vẫn cố ngồi cạnh nhau thêm chút nữa. 🥱❤️',
'Anh yêu cách em làm anh cảm thấy được nhớ tới trong những chuyện rất nhỏ. 🥰',
'Anh yêu lúc em bảo anh làm gì đó, rồi vài phút sau tự làm luôn vì không chờ nổi. 😂',
'Anh yêu cái tính muốn mọi thứ phải đúng ý em, dù đôi khi anh phải giả vờ đồng ý để được yên thân. 😭',
'Anh yêu những lúc em cười vì chính câu chuyện em kể trước khi anh kịp cười. 😂',
'Anh yêu cách em vẫn có thể đáng yêu ngay cả khi đang khó chịu với anh. 😤❤️',
'Anh yêu những lúc em hỏi ý kiến anh rồi cuối cùng vẫn làm theo ý em. Rất công bằng luôn. 😂',
'Anh yêu cái cách hai đứa có những câu nói mà chỉ hai đứa mới hiểu. 🤫',
'Anh yêu những lúc em làm mặt nghiêm túc nhưng anh nhìn là biết sắp cười. 😏',
'Anh yêu cách em đôi khi biến một chuyện nhỏ thành cả một cuộc họp gia đình. 😂',
'Anh yêu những lúc em nói “em không cần” nhưng anh biết tốt nhất là vẫn nên mua. 😭',
'Anh yêu lúc em cố tỏ ra mạnh mẽ nhưng chỉ cần anh ôm một cái là mềm xuống. 🫂',
'Anh yêu cách em có thể giận anh nhưng vẫn nhớ nhắc anh ăn uống hay làm việc cần làm. 🥹',
'Anh yêu những lúc em làm anh phải xin lỗi nhưng cuối cùng hai đứa lại cười với nhau. 😂',
'Anh yêu khi em hí hửng vì một món nhỏ xíu mà em thích. 🎁',
'Anh yêu cái cách em nhìn anh khi anh làm một chuyện ngốc và em không biết nên cười hay nên la. 😭',
'Anh yêu những lúc em tranh phần làm việc vì nghĩ em làm nhanh hơn anh. Mà nhiều khi đúng thiệt. 😂',
'Anh yêu cách em làm anh quen với việc luôn nghĩ “Selena sẽ thích cái này không ta?”. 💭',
'Anh yêu những lúc em bất ngờ vì một điều nhỏ anh làm cho em. Ánh mắt đó đáng để anh làm thêm nhiều lần nữa. 🥰',
'Anh yêu cách em có thể vui vì một món ăn ngon như thể hôm đó vừa trúng số. 🍰',
'Anh yêu lúc em giận dỗi nhưng vẫn ở gần anh chứ không thật sự muốn đi đâu hết. 🤍',
'Anh yêu những lúc hai đứa chọc nhau tới mức quên mất ban đầu đang nói chuyện gì. 😂',
'Anh yêu cách em đôi khi nói một câu rất bình thường nhưng anh lại nhớ nó cả ngày. 💬',
'Anh yêu những lúc em tự tin, vì anh thích nhìn em biết rõ mình xứng đáng với điều tốt đẹp. ✨',
'Anh yêu cách em quan tâm đến những chi tiết nhỏ làm mọi thứ trở nên đẹp hơn. 🌸',
'Anh yêu những lúc em cần một ngày nghỉ và cuối cùng chịu cho bản thân được nghỉ thật. ☁️',
'Anh yêu cách em làm anh muốn xây một cuộc sống ổn định hơn, không chỉ cho anh mà cho cả hai đứa. 🏡',
'Anh yêu việc mình có quá nhiều chuyện để nhắc lại rồi cười như hai đứa ngốc. 😂',
'Anh yêu khi em kể lại một kỷ niệm cũ và nhớ được những chi tiết anh đã quên. 🥹',
'Anh yêu những lúc mình đi đâu đó rồi tự nhiên cùng nghĩ “lần sau quay lại nha”. 🌎',
'Anh yêu cách em làm cho chữ “chúng ta” trở thành một điều thật sự có ý nghĩa với anh. 🤍',
'Anh yêu những lúc em buồn và vẫn cho anh cơ hội được ở cạnh em. 🫂',
'Anh yêu cách em làm anh hiểu rằng yêu một người không chỉ là những ngày vui. ❤️',
'Anh yêu những lúc mình bất đồng nhưng rồi vẫn tìm cách quay lại nói chuyện với nhau. 🌷',
'Anh yêu cách em đã trở thành một phần trong rất nhiều kế hoạch tương lai của anh mà anh chẳng cần cố nghĩ. 🌱',
'Anh yêu những lúc anh nhìn thấy một thứ dễ thương và người đầu tiên anh muốn gửi cho là em. 🥰',
'Anh yêu cảm giác được biết em thật sự, cả những phần dễ thương lẫn những phần làm anh đau đầu. 😂',
'Anh yêu cách chúng ta vẫn đang học cách hiểu nhau tốt hơn từng ngày. 🤍',
'Anh yêu những kỷ niệm cũ của mình, nhưng anh còn thích ý nghĩ rằng vẫn còn rất nhiều kỷ niệm mới phía trước. 📸',
'Anh yêu việc dù đã trải qua đủ chuyện, anh vẫn có thể nhìn em và nghĩ “ừ, vẫn là em”. ❤️',
'Anh yêu tất cả những phiên bản của em: lúc vui, lúc mệt, lúc giận, lúc mạnh mẽ và cả lúc yếu lòng. 🫶',
'Anh yêu cảm giác được gọi em là người của anh và được là người của em. ♡',
'Và điều thứ 100: anh yêu em không phải vì một lý do duy nhất. Anh yêu cả một trăm điều này, và còn rất nhiều điều anh chưa viết hết được. ❤️'
];

const loveSection=document.querySelector('.love-section');
if(loveSection){
  const eyebrow=loveSection.querySelector('.eyebrow');
  const title=loveSection.querySelector('h3');
  const grid=loveSection.querySelector('.love-grid');
  const note=loveSection.querySelector('.tap-note');
  if(eyebrow) eyebrow.textContent='A few little truths';
  if(title) title.textContent='100 Things I Love About You';
  if(note) note.textContent='Tap each card ♡';
  if(grid){
    grid.innerHTML=loveReasons.map((reason,i)=>`<button class="love-card"><span class="front">${String(i+1).padStart(2,'0')}</span><span class="back">${reason}</span></button>`).join('');
  }
}

const letterSection=document.querySelector('.letter-section');
if(letterSection){
  const eyebrow=letterSection.querySelector('.eyebrow');
  const title=letterSection.querySelector('h3');
  if(eyebrow) eyebrow.textContent='For you';
  if(title) title.textContent='My Birthday Letter';
}

function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open('selenaBirthdayDB',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('assets'))r.result.createObjectStore('assets')};r.onsuccess=()=>{db=r.result;resolve(db)};r.onerror=()=>reject(r.error)})}
function dbSet(k,v){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(v,k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
function dbGet(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly'),r=tx.objectStore('assets').get(k);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbDelete(k){return new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete(k);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}

pins.forEach((input,i)=>{input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,1);if(input.value&&i<pins.length-1)pins[i+1].focus()});input.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!input.value&&i>0)pins[i-1].focus()})});
function unlock(){const value=pins.map(p=>p.value).join('');if(value===CORRECT_PIN){lockScreen.classList.remove('active');birthdayScreen.classList.add('active');launchConfetti()}else{document.querySelector('.lock-card').classList.add('shake');pinHint.textContent='Not quite... try the date again ♡';setTimeout(()=>document.querySelector('.lock-card').classList.remove('shake'),360)}}
unlockBtn.addEventListener('click',unlock);pins[pins.length-1].addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});

let micStream=null,micContext=null,micFrame=null,blowHits=0,candleOut=false;

function extinguishCandle(){
  if(candleOut)return;
  candleOut=true;
  flame.classList.add('out');
  blowBtn.textContent='Wish made ♡';
  blowBtn.disabled=true;
  stopBlowListening();
  setTimeout(()=>startBtn.classList.remove('hidden'),450);
}

function stopBlowListening(){
  if(micFrame)cancelAnimationFrame(micFrame);
  micFrame=null;
  if(micStream)micStream.getTracks().forEach(track=>track.stop());
  micStream=null;
  if(micContext&&micContext.state!=='closed')micContext.close().catch(()=>{});
  micContext=null;
}

async function startBlowListening(){
  if(candleOut||micStream||!navigator.mediaDevices?.getUserMedia)return;
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    micContext=new (window.AudioContext||window.webkitAudioContext)();
    await micContext.resume();
    const source=micContext.createMediaStreamSource(micStream);
    const analyser=micContext.createAnalyser();
    analyser.fftSize=1024;
    analyser.smoothingTimeConstant=.25;
    source.connect(analyser);
    const data=new Uint8Array(analyser.fftSize);
    blowBtn.textContent='Blow out the candle 🎂';
    const listen=()=>{
      if(candleOut||!micContext)return;
      analyser.getByteTimeDomainData(data);
      let sum=0;
      for(let i=0;i<data.length;i++){const x=(data[i]-128)/128;sum+=x*x}
      const rms=Math.sqrt(sum/data.length);
      if(rms>.11)blowHits++;else blowHits=Math.max(0,blowHits-1);
      if(blowHits>=5){extinguishCandle();return}
      micFrame=requestAnimationFrame(listen);
    };
    listen();
  }catch(e){
    stopBlowListening();
    blowBtn.textContent='Tap to make a wish ✨';
  }
}

blowBtn.addEventListener('click',async()=>{
  if(candleOut)return;
  if(!micStream){
    await startBlowListening();
    if(!micStream)extinguishCandle();
  }else{
    extinguishCandle();
  }
});

birthdayScreen.addEventListener('click',()=>{
  if(!candleOut&&!micStream)startBlowListening();
},{once:true});
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
