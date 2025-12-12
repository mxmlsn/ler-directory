// === КОНФИГУРАЦИЯ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 
const VIDEO_POSTER = '/img/shared/head-poster.png'; // Изображение для миниатюры видео

// Функция подсчета товаров по тегу
function getProductCountByTag(tag) {
    return DATABASE.filter(item => item.type === 'product' && item.tag === tag).length;
}

// База Данных
const DATABASE = [
    { type: 'cover', id: '00', img: '/img/cover/4.png' },
    { key: 'clo',   id: '01', type: 'product', cat:'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '/img/products/clo/main.png', tag: 'longsleeve' },
    { key: 'acc',   id: '02', type: 'product', cat:'Accessory',  name: 'LEATHER BELT',  price: '45', img: '/img/products/acc/main.png', tag: 'tshirt' },
    { key: 'shoes', id: '03', type: 'product', cat:'Footwear',   name: 'TECH BOOTS',    price: '120', img: '/img/products/shoes/main.png', tag: 'longsleeve' },
    { key: 'bag',   id: '04', type: 'product', cat:'Storage',    name: 'SIDE BAG',      price: '65', img: '/img/products/bag/main.png', tag: 'tshirt' },
    { key: 'hat',   id: '05', type: 'product', cat:'Headwear',   name: 'NYLON CAP',     price: '30', img: '/img/products/hat/main.png', tag: 'tshirt' },
    { key: 'misc',  id: '06', type: 'product', cat:'Object',     name: 'KEYCHAIN',      price: '15', img: '/img/products/misc/main.png', tag: 'shirt' },
    { key: 'final', id: '07', type: 'product', cat:'Archive',    name: 'LOOKBOOK',      price: '00', img: '/img/products/final/main.png' },
    { type: 'contacts', id: '08', img: '/img/cover/4.png' }
];

let galleryState = {};
let currentZoom = 100;
let currentPageIndex = 0; // Добавлено: следим за текущим индексом глобально
let currentFilter = null; // Текущий активный фильтр

// === ЭЛЕМЕНТЫ ===
const container = document.getElementById('pages-container');
const navContainer = document.getElementById('nav-container');
const pageInput = document.getElementById('page-input');
const totalPagesSpan = document.getElementById('total-pages');
const zoomWrapper = document.getElementById('zoom-wrapper');
const tocBtn = document.getElementById('toc-btn');
const tocPopup = document.getElementById('toc-popup');

function init() {
    // Будет обновлено после применения фильтра

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
                        <p><strong onclick="filterTo('all');" style="cursor: pointer;">0. Welcome</strong></p>
                        <p><strong>1. Wearables</strong></p>
                        <p class="toc-sub" onclick="filterTo('tshirt');" style="cursor: pointer;">1.1 T-shirts <span style="color: #666;">(3)</span></p>
                        <p class="toc-sub" onclick="filterTo('longsleeve');" style="cursor: pointer;">1.2 Longsleeves <span style="color: #666;">(2)</span></p>
                        <p class="toc-sub" onclick="filterTo('shirt');" style="cursor: pointer;">1.3 Shirts <span style="color: #666;">(1)</span></p>
                        <p class="toc-sub" onclick="filterTo('accessories');" style="cursor: pointer;">1.4 Accessories <span style="color: #666;">(0)</span></p>
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
        
        navItem.innerHTML = `<img src="${navImg}" class="nav-thumb"><span class="nav-label" data-original-id="${item.id || 'Cover'}">${item.id || 'Cover'}</span>`;
        navContainer.appendChild(navItem);
    });

    updateZoom(currentZoom);
    
    // Применяем фильтр по умолчанию (показываем все)
    applyFilter(null);
}

// === ЛОГИКА МЕНЮ (по ховеру) ===
let menuTimeout = null;

tocBtn.addEventListener('mouseenter', () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    tocPopup.classList.add('show');
});

tocBtn.addEventListener('mouseleave', () => {
    menuTimeout = setTimeout(() => {
        if (!tocPopup.matches(':hover')) {
            tocPopup.classList.remove('show');
        }
    }, 100);
});

tocPopup.addEventListener('mouseenter', () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    tocPopup.classList.add('show');
});

tocPopup.addEventListener('mouseleave', () => {
    menuTimeout = setTimeout(() => {
        tocPopup.classList.remove('show');
    }, 100);
});

// Закрываем при клике вне меню
document.body.addEventListener('click', (e) => {
    if (!tocPopup.contains(e.target) && !tocBtn.contains(e.target)) {
        tocPopup.classList.remove('show');
    }
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

// Функция применения фильтра
function applyFilter(filterTag) {
    currentFilter = filterTag;
    
    DATABASE.forEach((item, index) => {
        const page = document.getElementById(`page-${index}`);
        const navItem = document.getElementById(`nav-${index}`);
        
        if (!page) return;
        
        let shouldShow = false;
        
        // Обложка и контакты всегда видимы
        if (item.type === 'cover' || item.type === 'contacts') {
            shouldShow = true;
        } else if (filterTag === null || filterTag === 'all') {
            // Если фильтр не выбран (all), показываем все
            shouldShow = true;
        } else {
            // Показываем только товары с нужным тегом
            shouldShow = (item.tag === filterTag);
        }
        
        // Применяем эффект с blur
        if (shouldShow) {
            // Показываем элемент
            if (page.style.display === 'none') {
                page.style.display = 'block';
                page.style.filter = 'blur(10px)';
                page.style.opacity = '0';
                // Анимация появления
                setTimeout(() => {
                    page.style.filter = 'blur(0px)';
                    page.style.opacity = '1';
                }, 10);
            } else {
                page.style.filter = 'blur(0px)';
                page.style.opacity = '1';
            }
            page.style.transition = 'filter 0.3s, opacity 0.3s';
            
            if (navItem) {
                if (navItem.style.display === 'none') {
                    navItem.style.display = 'block';
                    navItem.style.filter = 'blur(10px)';
                    navItem.style.opacity = '0';
                    setTimeout(() => {
                        navItem.style.filter = 'blur(0px)';
                        navItem.style.opacity = '1';
                    }, 10);
                } else {
                    navItem.style.filter = 'blur(0px)';
                    navItem.style.opacity = '1';
                }
                navItem.style.transition = 'filter 0.3s, opacity 0.3s';
            }
        } else {
            // Эффект исчезновения через blur
            page.style.filter = 'blur(10px)';
            page.style.opacity = '0';
            page.style.transition = 'filter 0.3s, opacity 0.3s';
            setTimeout(() => {
                if (page.style.opacity === '0') {
                    page.style.display = 'none';
                }
            }, 300);
            
            if (navItem) {
                navItem.style.filter = 'blur(10px)';
                navItem.style.opacity = '0';
                navItem.style.transition = 'filter 0.3s, opacity 0.3s';
                setTimeout(() => {
                    if (navItem.style.opacity === '0') {
                        navItem.style.display = 'none';
                    }
                }, 300);
            }
        }
    });
    
    // Обновляем активное состояние в меню
    document.querySelectorAll('.toc-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранному пункту
    let activeItem;
    if (filterTag === null || filterTag === 'all') {
        activeItem = document.querySelector('.toc-item[onclick*="filterTo(\'all\')"]') ||
                     document.querySelector('.toc-item[onclick*="filterTo(\"all\")"]');
    } else {
        activeItem = document.querySelector(`.toc-item[onclick*="filterTo('${filterTag}')"]`) ||
                     document.querySelector(`.toc-item[onclick*="filterTo(\"${filterTag}\")"]`);
    }
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Показываем/скрываем красную точку на иконке меню
    const menuTrigger = document.getElementById('toc-btn');
    let filterIndicator = document.getElementById('filter-indicator');
    
    if (filterTag && filterTag !== 'all' && filterTag !== null) {
        if (!filterIndicator) {
            filterIndicator = document.createElement('div');
            filterIndicator.id = 'filter-indicator';
            menuTrigger.appendChild(filterIndicator);
        }
        filterIndicator.style.display = 'block';
    } else {
        if (filterIndicator) {
            filterIndicator.style.display = 'none';
        }
    }
    
    // Обновляем заголовок документа с тегом
    const docTitle = document.querySelector('.doc-title');
    if (docTitle) {
        if (filterTag && filterTag !== 'all' && filterTag !== null) {
            docTitle.innerHTML = `(${filterTag}) ler-lookbook(2026).pdf`;
        } else {
            docTitle.innerHTML = 'ler-lookbook(2026).pdf';
        }
    }
    
    // Проверяем, есть ли товары с выбранным тегом
    let hasEmptyPage = false;
    if (filterTag && filterTag !== 'all' && filterTag !== null) {
        const productsWithTag = DATABASE.filter(item => 
            item.type === 'product' && item.tag === filterTag
        );
        
        // Если товаров нет, добавляем пустую страницу
        if (productsWithTag.length === 0) {
            hasEmptyPage = true;
            let emptyPage = document.getElementById('empty-page');
            if (!emptyPage) {
                emptyPage = document.createElement('div');
                emptyPage.id = 'empty-page';
                emptyPage.className = 'paper-sheet empty-sheet';
                emptyPage.innerHTML = `
                    <div style="display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center; text-align: center;">
                        <div style="font-family: monospace; font-size: 18px; color: #333; margin-bottom: 40px;">
                            empty. choose something else
                        </div>
                        <div class="toc-list" style="text-align: left;">
                            <p><strong onclick="filterTo('all');" style="cursor: pointer;">0. Welcome</strong></p>
                            <p><strong>1. Wearables</strong></p>
                            <p class="toc-sub" onclick="filterTo('tshirt');" style="cursor: pointer;">1.1 T-shirts <span style="color: #666;">(3)</span></p>
                            <p class="toc-sub" onclick="filterTo('longsleeve');" style="cursor: pointer;">1.2 Longsleeves <span style="color: #666;">(2)</span></p>
                            <p class="toc-sub" onclick="filterTo('shirt');" style="cursor: pointer;">1.3 Shirts <span style="color: #666;">(1)</span></p>
                            <p class="toc-sub" onclick="filterTo('accessories');" style="cursor: pointer;">1.4 Accessories <span style="color: #666;">(0)</span></p>
                            <p><strong>2. Objects</strong></p>
                        </div>
                    </div>
                `;
                container.appendChild(emptyPage);
            }
            emptyPage.style.display = 'block';
            emptyPage.style.filter = 'blur(0px)';
            emptyPage.style.opacity = '1';
        } else {
            // Удаляем пустую страницу если она есть
            const emptyPage = document.getElementById('empty-page');
            if (emptyPage) {
                emptyPage.style.display = 'none';
            }
        }
    } else {
        // Удаляем пустую страницу при выборе "all"
        const emptyPage = document.getElementById('empty-page');
        if (emptyPage) {
            emptyPage.style.display = 'none';
        }
    }
    
    // Используем requestAnimationFrame для обновления после применения всех стилей
    requestAnimationFrame(() => {
        // Собираем все видимые страницы в правильном порядке
        const visiblePagesOrder = [];
        DATABASE.forEach((item, index) => {
            const page = document.getElementById(`page-${index}`);
            if (page) {
                const computedStyle = window.getComputedStyle(page);
                if (computedStyle.display !== 'none' && page.style.display !== 'none') {
                    visiblePagesOrder.push({ index, item, type: item.type });
                }
            }
        });
        
        // Добавляем пустую страницу если есть
        if (hasEmptyPage) {
            const emptyPage = document.getElementById('empty-page');
            if (emptyPage) {
                const computedStyle = window.getComputedStyle(emptyPage);
                if (computedStyle.display !== 'none' && emptyPage.style.display !== 'none') {
                    visiblePagesOrder.push({ index: -1, item: { type: 'empty' }, type: 'empty' });
                }
            }
        }
        
        const visibleCount = visiblePagesOrder.length;
        
        // Обновляем количество страниц
        const totalPagesSpan = document.getElementById('total-pages');
        if (totalPagesSpan) {
            totalPagesSpan.innerText = visibleCount;
        }
        
        // Обновляем нумерацию в левом меню - последовательно для всех видимых элементов
        let pageNumber = 0;
        visiblePagesOrder.forEach((pageInfo) => {
            const { index, item } = pageInfo;
            
            if (index === -1) {
                // Пустая страница не имеет навигации
                return;
            }
            
            const navItem = document.getElementById(`nav-${index}`);
            if (navItem) {
                const navLabel = navItem.querySelector('.nav-label');
                if (navLabel) {
                    // Все страницы нумеруются последовательно: 00, 01, 02, 03...
                    navLabel.textContent = String(pageNumber).padStart(2, '0');
                    pageNumber++;
                }
            }
        });
        
        // Скрываем нумерацию для невидимых элементов
        DATABASE.forEach((item, index) => {
            const page = document.getElementById(`page-${index}`);
            const navItem = document.getElementById(`nav-${index}`);
            if (navItem && page) {
                const computedStyle = window.getComputedStyle(page);
                const isVisible = computedStyle.display !== 'none' && page.style.display !== 'none';
                if (!isVisible) {
                    const navLabel = navItem.querySelector('.nav-label');
                    if (navLabel) {
                        navLabel.textContent = '--';
                    }
                }
            }
        });
    });
    
    // Скроллим к ближайшему видимому товару или не скроллим если уже в кадре
    setTimeout(() => {
        const visiblePages = Array.from(document.querySelectorAll('.paper-sheet')).filter(el => 
            el.style.display !== 'none' && window.getComputedStyle(el).display !== 'none'
        );
        
        if (visiblePages.length === 0) return;
        
        // Проверяем, есть ли видимые страницы в viewport
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;
        
        let nearestPage = null;
        let minDistance = Infinity;
        let pageInViewport = false;
        
        visiblePages.forEach(page => {
            const rect = page.getBoundingClientRect();
            const pageTop = rect.top + window.scrollY;
            const pageBottom = pageTop + rect.height;
            
            // Проверяем, видна ли страница в viewport
            if (pageTop >= viewportTop && pageBottom <= viewportBottom) {
                pageInViewport = true;
                return;
            }
            
            // Находим ближайшую страницу
            const distance = Math.min(
                Math.abs(pageTop - viewportTop),
                Math.abs(pageBottom - viewportBottom)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestPage = page;
            }
        });
        
        // Скроллим только если нет видимых страниц в viewport
        if (!pageInViewport && nearestPage) {
            nearestPage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
}

window.filterTo = function(category) {
    if (category === 'all' || !category) {
        applyFilter(null);
    } else {
        applyFilter(category);
    }
    // Закрываем меню после выбора
    tocPopup.classList.remove('show');
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
