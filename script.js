// === КОНФИГУРАЦИЯ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 
const VIDEO_POSTER = '/img/shared/head-poster.png'; // Изображение для миниатюры видео

// База Данных
const DATABASE = [
    { type: 'cover', id: '00', img: '/img/cover/4.png' },
    { key: 'clo',   id: '01', type: 'product', cat:'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '/img/products/clo/main.png' },
    { key: 'acc',   id: '02', type: 'product', cat:'Accessory',  name: 'LEATHER BELT',  price: '45', img: '/img/products/acc/main.png' },
    { key: 'shoes', id: '03', type: 'product', cat:'Footwear',   name: 'TECH BOOTS',    price: '120', img: '/img/products/shoes/main.png' },
    { key: 'bag',   id: '04', type: 'product', cat:'Storage',    name: 'SIDE BAG',      price: '65', img: '/img/products/bag/main.png' },
    { key: 'hat',   id: '05', type: 'product', cat:'Headwear',   name: 'NYLON CAP',     price: '30', img: '/img/products/hat/main.png' },
    { key: 'misc',  id: '06', type: 'product', cat:'Object',     name: 'KEYCHAIN',      price: '15', img: '/img/products/misc/main.png' },
    { key: 'final', id: '07', type: 'product', cat:'Archive',    name: 'LOOKBOOK',      price: '00', img: '/img/products/final/main.png' },
    { type: 'contacts', id: '08', img: '/img/cover/4.png' }
];

let galleryState = {};
let currentZoom = 100;
let currentPageIndex = 0; // Добавлено: следим за текущим индексом глобально

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
        } else if (item.type === 'contacts') {
            sheet.className = 'paper-sheet contacts-sheet';
            sheet.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center; text-align: center;">
                    <div class="logo-big" style="margin-bottom: 60px;">Le®</div>
                    <div style="font-family: monospace; font-size: 14px; color: #333; line-height: 2;">
                        <p style="font-size: 18px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase;">Contact</p>
                        <p>+(1073) 34 932 6173</p>
                        <p>info@loveexpensive.com</p>
                        <p style="margin-top: 40px; font-size: 12px;">Copyright © 2025 Love expensive®</p>
                        <p style="font-size: 10px; color: #666; margin-top: 20px;">All rights reserved</p>
                    </div>
                </div>
            `;
        } else {
            sheet.className = 'paper-sheet';
            sheet.setAttribute('data-key', item.key);
            
            // Создаем массив изображений для галереи из папки товара
            const productImages = [
                `/img/products/${item.key}/1.png`,
                `/img/products/${item.key}/2.png`,
                `/img/products/${item.key}/3.png`,
                `/img/products/${item.key}/4.png`,
                `/img/products/${item.key}/5.png`,
                `/img/products/${item.key}/6.png`,
                `/img/products/${item.key}/7.png`
            ];
            
            const galleryImages = [item.img]; // Основное изображение
            // Добавляем случайные дополнительные изображения из папки товара (исключая основное)
            const randomExtra = productImages
                .filter(src => src !== item.img)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);
            galleryImages.push(...randomExtra);
            galleryImages.push('/img/shared/head.mp4'); // Добавляем видео в галерею
            
            sheet.dataset.gallery = JSON.stringify(galleryImages);
            galleryState[index] = 0;

            let thumbsHTML = '';
            galleryImages.forEach((src, i) => {
                if (src.endsWith('.mp4')) {
                    // Для видео используем кастомную миниатюру через poster
                    thumbsHTML += `<video src="${src}" poster="${VIDEO_POSTER}" class="mini-thumb ${i===0?'active':''}" onclick="setGalleryImage(${index}, ${i})" muted preload="metadata"></video>`;
                } else {
                    thumbsHTML += `<img src="${src}" class="mini-thumb ${i===0?'active':''}" onclick="setGalleryImage(${index}, ${i})">`;
                }
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
                            <video class="main-video" id="main-video-${index}" style="display: none;" controls muted loop></video>
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
        
        // Используем специальное изображение для обложки и контактов в навигации
        let navImg = item.img;
        if (item.type === 'cover' || item.type === 'contacts') {
            navImg = '/img/shared/nav-thumb.png';
        }
        
        navItem.innerHTML = `<img src="${navImg}" class="nav-thumb"><span class="nav-label">${item.id || 'Cover'}</span>`;
        navContainer.appendChild(navItem);
    });

    updateZoom(currentZoom);
}

// === ЛОГИКА МЕНЮ ===
tocBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tocPopup.classList.toggle('show');
});

document.body.addEventListener('click', () => {
    tocPopup.classList.remove('show');
});

// Глобальная функция скролла
window.scrollToPage = function(index) {
    const el = document.getElementById(`page-${index}`);
    if(el) {
        // Используем 'auto' для резкого перехода или 'smooth' для плавного, если хотите анимацию
        el.scrollIntoView({ behavior: 'auto' }); 
        // Принудительно обновляем индекс, на случай если Observer не успеет
        currentPageIndex = index;
    }
}

window.filterTo = function(category) {
    window.scrollToPage(1);
}

// === ГАЛЕРЕЯ ТОВАРОВ ===
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
    const currentMedia = images[imgIndex];
    const mainImg = document.getElementById(`main-img-${pageIndex}`);
    const mainVideo = document.getElementById(`main-video-${pageIndex}`);
    
    if (currentMedia.endsWith('.mp4')) {
        // Показываем видео, скрываем изображение
        mainImg.style.display = 'none';
        mainVideo.style.display = 'block';
        mainVideo.src = currentMedia;
        mainVideo.play();
    } else {
        // Показываем изображение, скрываем видео
        mainImg.style.display = 'block';
        mainVideo.style.display = 'none';
        mainVideo.pause();
        mainImg.src = currentMedia;
    }
    
    const thumbs = document.getElementById(`gallery-thumbs-${pageIndex}`).getElementsByClassName('mini-thumb');
    Array.from(thumbs).forEach((t, i) => {
        if(i === imgIndex) t.classList.add('active'); else t.classList.remove('active');
    });
}

// === OBSERVER (Следит за активной страницей) ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-')[1]);
            currentPageIndex = index; // Синхронизируем переменную

            const item = DATABASE[index];
            if(document.activeElement !== pageInput) pageInput.value = index + 1;
            
            // Используем hash для навигации вместо полного пути, чтобы не ломать работу сервера
            let newUrl;
            if (item.type === 'cover') {
                newUrl = `#index`;
            } else if (item.type === 'contacts') {
                newUrl = `#contacts`;
            } else {
                newUrl = `#${item.key}`;
            }
            if(window.location.hash !== newUrl) window.history.replaceState(null, "", newUrl);

            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            const activeNav = document.getElementById(`nav-${index}`);
            if(activeNav) {
                activeNav.classList.add('active');
                
                // --- ПРАВКА 2: Сайдбар следует за активным экраном ---
                // block: 'center' держит активную иконку посередине сайдбара
                activeNav.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}, { threshold: 0.4 });

setTimeout(() => { document.querySelectorAll('.paper-sheet').forEach(el => observer.observe(el)); }, 500);


// === УПРАВЛЕНИЕ КЛАВИАТУРОЙ (ПРАВКА 1) ===
document.addEventListener('keydown', (e) => {
    // Если пользователь пишет в инпуте зума или номера страницы — не перехватываем
    if (e.target.tagName === 'INPUT') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); // Отменяем стандартный мини-скролл
        if (currentPageIndex < DATABASE.length - 1) {
            window.scrollToPage(currentPageIndex + 1);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPageIndex > 0) {
            window.scrollToPage(currentPageIndex - 1);
        }
    }
});


// === ЗУМ И ИНПУТЫ ===
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

// === COOKIE LOGIC (UPDATED) ===
window.addEventListener('load', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    
    // Проверка на существование элемента и записи в памяти
    if (cookieBanner && !localStorage.getItem('cookies_accepted')) {
        cookieBanner.style.display = 'flex';
    }
});

window.acceptCookies = function() {
    const cookieBanner = document.getElementById('cookie-banner');
    localStorage.setItem('cookies_accepted', 'true');
    if (cookieBanner) cookieBanner.style.display = 'none';
}
