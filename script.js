const CORRECT_PIN = '1225'; // placeholder: easy to change later

const lockScreen = document.getElementById('lockScreen');
const birthdayScreen = document.getElementById('birthdayScreen');
const story = document.getElementById('story');
const pins = [...document.querySelectorAll('.pin')];
const unlockBtn = document.getElementById('unlockBtn');
const pinHint = document.getElementById('pinHint');
const blowBtn = document.getElementById('blowBtn');
const flame = document.getElementById('flame');
const startBtn = document.getElementById('startBtn');
const revealDinnerBtn = document.getElementById('revealDinnerBtn');
const dinnerReveal = document.getElementById('dinnerReveal');
const editToggle = document.getElementById('editToggle');
const editorPanel = document.getElementById('editorPanel');
const closeEditor = document.getElementById('closeEditor');
const photoUploader = document.getElementById('photoUploader');
const clearPhotos = document.getElementById('clearPhotos');
const musicUploader = document.getElementById('musicUploader');
const previewMusic = document.getElementById('previewMusic');
const clearMusic = document.getElementById('clearMusic');
const musicStatus = document.getElementById('musicStatus');
const bgMusic = document.getElementById('bgMusic');
const musicChip = document.getElementById('musicChip');
const musicToggle = document.getElementById('musicToggle');
const memoryStrip = document.getElementById('memoryStrip');

let db;
let currentMusicUrl = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('selenaBirthdayDB', 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('assets')) database.createObjectStore('assets');
    };
    request.onsuccess = () => { db = request.result; resolve(db); };
    request.onerror = () => reject(request.error);
  });
}

function dbSet(key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readwrite');
    tx.objectStore('assets').put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function dbGet(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readonly');
    const req = tx.objectStore('assets').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbDelete(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readwrite');
    tx.objectStore('assets').delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

pins.forEach((input, i) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    if (input.value && i < pins.length - 1) pins[i + 1].focus();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && i > 0) pins[i - 1].focus();
  });
});

function unlock() {
  const value = pins.map(p => p.value).join('');
  if (value === CORRECT_PIN) {
    lockScreen.classList.remove('active');
    birthdayScreen.classList.add('active');
    launchConfetti();
  } else {
    document.querySelector('.lock-card').classList.add('shake');
    pinHint.textContent = 'Not quite... try the date again ♡';
    setTimeout(() => document.querySelector('.lock-card').classList.remove('shake'), 360);
  }
}

unlockBtn.addEventListener('click', unlock);
pins[pins.length - 1].addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });

blowBtn.addEventListener('click', () => {
  flame.classList.add('out');
  blowBtn.textContent = 'Wish made ♡';
  blowBtn.disabled = true;
  setTimeout(() => startBtn.classList.remove('hidden'), 450);
});

startBtn.addEventListener('click', async () => {
  birthdayScreen.classList.remove('active');
  story.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (bgMusic.src) {
    try {
      await bgMusic.play();
      musicChip.classList.remove('paused');
      musicToggle.textContent = 'Ⅱ';
    } catch (_) {
      musicChip.classList.add('paused');
      musicToggle.textContent = '▶';
    }
  }
});

document.querySelectorAll('.love-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

revealDinnerBtn.addEventListener('click', () => {
  dinnerReveal.classList.remove('hidden');
  revealDinnerBtn.classList.add('hidden');
  dinnerReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function launchConfetti() {
  const layer = document.getElementById('confettiLayer');
  const palette = ['#d78f99','#d8b77a','#f4c8cf','#e9ded9','#a85f69'];
  for (let i = 0; i < 52; i++) {
    const bit = document.createElement('span');
    bit.className = 'confetti';
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.top = `${-10 - Math.random() * 30}px`;
    bit.style.background = palette[Math.floor(Math.random() * palette.length)];
    bit.style.animationDelay = `${Math.random() * .7}s`;
    bit.style.animationDuration = `${2.1 + Math.random() * 1.8}s`;
    layer.appendChild(bit);
    setTimeout(() => bit.remove(), 4300);
  }
}

function renderPhotos(files) {
  if (!files || !files.length) return;
  memoryStrip.innerHTML = '';
  const captions = [
    'Still one of my favorite days.',
    'This one always makes me smile.',
    'Just us being us.',
    'More of this, please.',
    'A moment I never want to forget.',
    'My favorite person.',
    'One for the memory book.',
    'Always us. ♡'
  ];
  files.slice(0, 8).forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const article = document.createElement('article');
    article.className = `polaroid ${i % 2 ? 'tilt-right' : 'tilt-left'}`;
    article.innerHTML = `<div class="photo"><img src="${url}" alt="Memory ${i + 1}"></div><p>${captions[i]}</p>`;
    memoryStrip.appendChild(article);
  });
}

async function loadSavedPhotos() {
  const photos = await dbGet('photos');
  if (photos?.length) renderPhotos(photos);
}

photoUploader.addEventListener('change', async () => {
  const files = [...photoUploader.files].slice(0, 8);
  if (!files.length) return;
  await dbSet('photos', files);
  renderPhotos(files);
});

clearPhotos.addEventListener('click', async () => {
  await dbDelete('photos');
  location.reload();
});

function applyMusicFile(file) {
  if (currentMusicUrl) URL.revokeObjectURL(currentMusicUrl);
  currentMusicUrl = URL.createObjectURL(file);
  bgMusic.src = currentMusicUrl;
  musicChip.classList.remove('hidden');
  musicStatus.textContent = `Loaded: ${file.name}`;
}

async function loadSavedMusic() {
  const music = await dbGet('music');
  if (music) applyMusicFile(music);
}

musicUploader.addEventListener('change', async () => {
  const file = musicUploader.files[0];
  if (!file) return;
  await dbSet('music', file);
  applyMusicFile(file);
});

previewMusic.addEventListener('click', async () => {
  if (!bgMusic.src) {
    musicStatus.textContent = 'Upload the song first.';
    return;
  }
  if (bgMusic.paused) {
    await bgMusic.play();
    previewMusic.textContent = 'Pause preview';
    musicChip.classList.remove('paused');
  } else {
    bgMusic.pause();
    previewMusic.textContent = 'Preview music';
    musicChip.classList.add('paused');
  }
});

clearMusic.addEventListener('click', async () => {
  bgMusic.pause();
  await dbDelete('music');
  bgMusic.removeAttribute('src');
  musicChip.classList.add('hidden');
  musicStatus.textContent = 'No audio uploaded yet.';
});

musicToggle.addEventListener('click', async () => {
  if (bgMusic.paused) {
    await bgMusic.play();
    musicToggle.textContent = 'Ⅱ';
    musicChip.classList.remove('paused');
  } else {
    bgMusic.pause();
    musicToggle.textContent = '▶';
    musicChip.classList.add('paused');
  }
});

const editMode = new URLSearchParams(location.search).get('edit') === '1';
if (editMode) editToggle.classList.remove('hidden');
editToggle.addEventListener('click', () => editorPanel.classList.remove('hidden'));
closeEditor.addEventListener('click', () => editorPanel.classList.add('hidden'));

(async function initAssets() {
  try {
    await openDB();
    await Promise.all([loadSavedPhotos(), loadSavedMusic()]);
  } catch (error) {
    console.warn('Local asset storage unavailable:', error);
  }
})();
