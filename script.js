// === КОНФИГУРАЦИЯ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 
const ALL_IMAGES = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png', '/7.png'];

// База Данных
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
            
            const galleryImages = [item.img];
            const randomExtra = ALL_IMAGES.filter(src => src !== item.img).sort(()=>0.5-Math.random()).slice(0, 2);
            galleryImages.push(...randomExtra);
            
            sheet.dataset.gallery = JSON.stringify(galleryImages);
            galleryState[index] = 0;

            let thumbsHTML = '';
            galleryImages.forEach((src, i) => {
                thumbsHTML += `<img src="${src}" class="mini-thumb ${i===0?'active':''}" onclick="setGalleryImage(${index}, ${i})">`;
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
                        <div class="main-img-wrapper">
                            <div class="click-zone zone-left" onclick="switchImage(${index}, -1)"></div>
                            <div class="click-zone zone-right" onclick="switchImage(${index}, 1)"></div>
                            <img src="${item.img}" class="main-img" id="main-img-${index}">
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
        navItem.onclick = () => window.scrollToPage(index); // Важно: вызываем глобальную функцию
        navItem.innerHTML = `<img src="${item.type === 'cover' ? item.img : item.img}" class="nav-thumb"><span class="nav-label">${item.id || 'Cover'}</span>`;
        navContainer.appendChild(navItem);
    });

    updateZoom(currentZoom);
}

// === ЛОГИКА МЕНЮ ===
tocBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Чтобы клик не ушел на body
    tocPopup.classList.toggle('show');
});

// Закрыть меню при клике в любое другое место
document.body.addEventListener('click', () => {
    tocPopup.classList.remove('show');
});

// Глобальная функция для использования в HTML onclick
window.scrollToPage = function(index) {
    const el = document.getElementById(`page-${index}`);
    if(el) {
        el.scrollIntoView({ behavior: 'auto' });
    }
}

// Фильтр заглушка (просто скроллит к одежде)
window.filterTo = function(category) {
    // В реальном проекте тут можно фильтровать, сейчас просто скроллим к первому товару
    window.scrollToPage(1);
}


// === ГАЛЕРЕЯ, ЗУМ, СКРОЛЛ ===
window.setGalleryImage = function(pageIndex, imgIndex) { updateGalleryView(pageIndex, imgIndex); }
window.switchImage = function(pageIndex, direction) {
    const sheet = document.getElementById(`page-${pageIndex}`);
    const images = JSON.parse(sheet.dataset.gallery);
    let current = galleryState[pageIndex];
    let next = current + direction;
    if (next < 0) next = images.length - 1;
    if (next >= images.length) next = 0;
    updateGalleryView(pageIndex, next);
}

function updateGalleryView(pageIndex, imgIndex) {
    galleryState[pageIndex] = imgIndex;
    const sheet = document.getElementById(`page-${pageIndex}`);
    const images = JSON.parse(sheet.dataset.gallery);
    document.getElementById(`main-img-${pageIndex}`).src = images[imgIndex];
    const thumbs = document.getElementById(`gallery-thumbs-${pageIndex}`).getElementsByClassName('mini-thumb');
    Array.from(thumbs).forEach((t, i) => {
        if(i === imgIndex) t.classList.add('active'); else t.classList.remove('active');
    });
}

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
            if(activeNav) activeNav.classList.add('active');
        }
    });
}, { threshold: 0.4 });

setTimeout(() => { document.querySelectorAll('.paper-sheet').forEach(el => observer.observe(el)); }, 500);

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

init();


// === УПРАВЛЕНИЕ С КЛАВИАТУРЫ (Стрелки) ===
document.addEventListener('keydown', (e) => {
    // Получаем номер текущей страницы из инпута (он обновляется сам при скролле)
    const currentVal = parseInt(document.getElementById('page-input').value);
    const currentIndex = currentVal - 1; // Превращаем в индекс (0, 1, 2...)

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); // Запрещаем обычный скролл
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
