// === КОНФИГУРАЦИЯ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 
const ALL_MEDIA = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png', '/7.png'];

// === БАЗА ДАННЫХ ===
const DATABASE = [
    { type: 'cover', id: '00', img: '/4.png' },
    { key: 'clo',   id: '01', type: 'product', cat:'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '/1.png' },
    { key: 'acc',   id: '02', type: 'product', cat:'Accessory',  name: 'LEATHER BELT',  price: '45', img: '/2.png' },
    { key: 'shoes', id: '03', type: 'product', cat:'Footwear',   name: 'TECH BOOTS',    price: '120', img: '/3.png' },
    { key: 'bag',   id: '04', type: 'product', cat:'Storage',    name: 'SIDE BAG',      price: '65', img: '/4.png' },
    { key: 'hat',   id: '05', type: 'product', cat:'Headwear',   name: 'NYLON CAP',     price: '30', img: '/5.png' },
    { key: 'misc',  id: '06', type: 'product', cat:'Object',     name: 'KEYCHAIN',      price: '15', img: '/6.png' },
    { key: 'final', id: '07', type: 'product', cat:'Archive',    name: 'LOOKBOOK',      price: '00', img: '/7.png' }
];

let galleryState = {};
let currentZoom = 100;

// === ЭЛЕМЕНТЫ ===
const container = document.getElementById('pages-container');
const navContainer = document.getElementById('nav-container');
const pageInput = document.getElementById('page-input');
const totalPagesSpan = document.getElementById('total-pages');
const zoomWrapper = document.getElementById('zoom-wrapper');
const tocBtn = document.getElementById('toc-btn');
const tocPopup = document.getElementById('toc-popup');

// Вспомогательная: Картинка или Видео?
function getMediaHTML(src, className, id = '') {
    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
    const idAttr = id ? `id="${id}"` : '';
    if (isVideo) {
        return `<video src="${src}" class="${className}" ${idAttr} autoplay muted loop playsinline></video>`;
    } else {
        return `<img src="${src}" class="${className}" ${idAttr}>`;
    }
}

function init() {
    totalPagesSpan.innerText = DATABASE.length;

    DATABASE.forEach((item, index) => {
        const sheet = document.createElement('div');
        sheet.id = `page-${index}`;
        
        if (item.type === 'cover') {
            sheet.className = 'paper-sheet cover-sheet';
            sheet.innerHTML = `
                <div class="cover-left">
                    <div class="logo-big">Le®</div>
                    <div class="toc-title">Table of content</div>
                    <div class="toc-list">
                        <p><strong>0. Welcome</strong></p>
                        <p><strong>1. Wearables</strong></p>
                        <p class="toc-sub">1.1 T-shirts</p>
                        <p class="toc-sub">1.2 Longsleeves</p>
                        <p class="toc-sub">1.3 Shirts</p>
                        <p class="toc-sub">1.4 Accessories</p>
                        <p><strong>2. Objects</strong></p>
                    </div>
                </div>
                <div class="cover-right"><img src="${item.img}" class="cube-img"></div>
            `;
        } else {
            sheet.className = 'paper-sheet';
            sheet.setAttribute('data-key', item.key);
            
            const galleryMedia = [item.img];
            const randomExtra = ALL_MEDIA.filter(src => src !== item.img).sort(()=>0.5-Math.random()).slice(0, 2);
            galleryMedia.push(...randomExtra);
            
            sheet.dataset.gallery = JSON.stringify(galleryMedia);
            galleryState[index] = 0;

            let thumbsHTML = '';
            galleryMedia.forEach((src, i) => {
                const activeClass = i === 0 ? 'active' : '';
                thumbsHTML += `<div class="mini-thumb-wrapper ${activeClass}" onclick="setGalleryImage(${index}, ${i})">
                                ${getMediaHTML(src, 'mini-thumb-content')}
                               </div>`;
            });

            sheet.innerHTML = `
                <div class="sheet-top">
                    <span>PATH: .../WEAR/TYPE/${item.key.toUpperCase()}.PDF</span>
                    <span>REF: 35099600 S</span>
                </div>
                <div class="content-grid">
                    <div class="left-col">
                        <div style="font-family:monospace; color:#666; font-size:11px;">Item # ${item.id}<br>${item.cat}</div>
                        <h1>${item.name}</h1>
                        <div class="specs">
                            <p>MATERIAL: LEATHER / SYNTHETIC</p>
                            <p>COLOR: BLACK / GREY</p>
                            <p>WIDTH: 30 MM</p>
                            <p>SPECIAL FEATURES: UNISEX PACKAGE</p>
                        </div>
                        <div class="price-box">€${item.price}</div>
                        <div class="mini-gallery" id="gallery-thumbs-${index}">${thumbsHTML}</div>
                    </div>
                    <div class="right-col">
                        <div class="main-img-wrapper" id="main-wrapper-${index}">
                            <div class="click-zone zone-left" onclick="switchImage(${index}, -1)"></div>
                            <div class="click-zone zone-right" onclick="switchImage(${index}, 1)"></div>
                            ${getMediaHTML(item.img, 'main-img', `main-media-${index}`)}
                        </div>
                        <div class="vertical-code">+(1073) 34 932 6173</div>
                    </div>
                </div>
                <div style="margin-top:auto; padding-top:20px; border-top:2px solid black; display:flex; justify-content:space-between; font-size:9px; font-family:monospace; color:#666;">
                    <span>Copyright © 2025 Love expensive®</span><span>${item.id}.</span>
                </div>
            `;
        }
        container.appendChild(sheet);

        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.id = `nav-${index}`;
        navItem.onclick = () => window.scrollToPage(index);
        navItem.innerHTML = `<div class="nav-thumb">${getMediaHTML(item.type === 'cover' ? item.img : item.img, 'nav-media-content')}</div><span class="nav-label">${item.id || 'Cover'}</span>`;
        navContainer.appendChild(navItem);
    });

    updateZoom(currentZoom);
}

// === МЕНЮ И НАВИГАЦИЯ ===
tocBtn.addEventListener('click', (e) => { e.stopPropagation(); tocPopup.classList.toggle('show'); });
document.body.addEventListener('click', () => { tocPopup.classList.remove('show'); });

window.scrollToPage = function(index) {
    const el = document.getElementById(`page-${index}`);
    if(el) el.scrollIntoView({ behavior: 'auto' });
}

window.filterTo = function(category) { window.scrollToPage(1); }

// === ГАЛЕРЕЯ ===
window.setGalleryImage = function(pageIndex, imgIndex) { updateGalleryView(pageIndex, imgIndex); }
window.switchImage = function(pageIndex, direction) {
    const sheet = document.getElementById(`page-${pageIndex}`);
    const mediaList = JSON.parse(sheet.dataset.gallery);
    let current = galleryState[pageIndex];
    let next = current + direction;
    if (next < 0) next = mediaList.length - 1;
    if (next >= mediaList.length) next = 0;
    updateGalleryView(pageIndex, next);
}

function updateGalleryView(pageIndex, mediaIndex) {
    galleryState[pageIndex] = mediaIndex;
    const sheet = document.getElementById(`page-${pageIndex}`);
    const mediaList = JSON.parse(sheet.dataset.gallery);
    const newSrc = mediaList[mediaIndex];
    const wrapper = document.getElementById(`main-wrapper-${pageIndex}`);
    const zoneL = wrapper.querySelector('.zone-left');
    const zoneR = wrapper.querySelector('.zone-right');
    wrapper.innerHTML = '';
    wrapper.appendChild(zoneL);
    wrapper.appendChild(zoneR);
    wrapper.insertAdjacentHTML('beforeend', getMediaHTML(newSrc, 'main-img', `main-media-${pageIndex}`));
    const thumbs = document.getElementById(`gallery-thumbs-${pageIndex}`).getElementsByClassName('mini-thumb-wrapper');
    Array.from(thumbs).forEach((el, i) => {
        if(i === mediaIndex) el.classList.add('active'); else el.classList.remove('active');
    });
}

// === OBSERVER (С ИСПРАВЛЕНИЕМ ДЛЯ САЙДБАРА) ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-')[1]);
            const item = DATABASE[index];
            if(document.activeElement !== pageInput) pageInput.value = index + 1;
            
            let newUrl = item.type === 'cover' ? `${PREFIX}/index.pdf` : `${PREFIX}/${item.key}.pdf`;
            if(window.location.pathname !== newUrl) window.history.replaceState(null, "", newUrl);

            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            const activeNav = document.getElementById(`nav-${index}`);
            if(activeNav) {
                activeNav.classList.add('active');
                
                // --- ВОТ ИСПРАВЛЕНИЕ ---
                // Прокручиваем сайдбар к активной иконке, если она ушла за экран
                activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
}, { threshold: 0.4 });

setTimeout(() => { document.querySelectorAll('.paper-sheet').forEach(el => observer.observe(el)); }, 500);

// === ЗУМ И ИНПУТ ===
window.changeZoom = function(delta) { updateZoom(currentZoom + delta); }
document.getElementById('zoom-input').addEventListener('change', (e) => updateZoom(parseInt(e.target.value)));
function updateZoom(val) {
    currentZoom = val;
    if(currentZoom < 25) currentZoom = 25;
    if(currentZoom > 200) currentZoom = 200;
    document.getElementById('zoom-input').value = currentZoom;
    zoomWrapper.style.transform = `scale(${currentZoom / 100})`;
}
pageInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if(val < 1) val = 1; if(val > DATABASE.length) val = DATABASE.length;
    window.scrollToPage(val - 1);
});

// === УПРАВЛЕНИЕ С КЛАВИАТУРЫ (Стрелки) ===
document.addEventListener('keydown', (e) => {
    const currentVal = parseInt(document.getElementById('page-input').value);
    const currentIndex = currentVal - 1; 

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); 
        const nextIndex = currentIndex + 1;
        if (nextIndex < DATABASE.length) {
            window.scrollToPage(nextIndex);
        }
    } 
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            window.scrollToPage(prevIndex);
        }
    }
});

init();
