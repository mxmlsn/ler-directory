// === НАСТРОЙКИ И ДАННЫЕ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 

const DATABASE = [
    { key: 'clo',   id: '01', type: 'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '/1.png' },
    { key: 'acc',   id: '02', type: 'Accessory',  name: 'LEATHER BELT',  price: '45', img: '/2.png' },
    { key: 'shoes', id: '03', type: 'Footwear',   name: 'TECH BOOTS',    price: '120', img: '/3.png' },
    { key: 'bag',   id: '04', type: 'Storage',    name: 'SIDE BAG',      price: '65', img: '/4.png' },
    { key: 'hat',   id: '05', type: 'Headwear',   name: 'NYLON CAP',     price: '30', img: '/5.png' },
    { key: 'misc',  id: '06', type: 'Object',     name: 'KEYCHAIN',      price: '15', img: '/6.png' },
    { key: 'final', id: '07', type: 'Archive',    name: 'LOOKBOOK',      price: '00', img: '/7.png' }
];

// === ИНИЦИАЛИЗАЦИЯ ===
const container = document.getElementById('pages-container');
const menuList = document.getElementById('menu-list');
const zoomWrapper = document.getElementById('zoom-wrapper');
const pageInput = document.getElementById('page-input');
const totalPagesSpan = document.getElementById('total-pages');
const zoomInput = document.getElementById('zoom-input');

let currentZoom = 100;

// 1. ГЕНЕРАЦИЯ СТРАНИЦ (Рендерим все сразу)
function init() {
    totalPagesSpan.innerText = DATABASE.length;
    
    DATABASE.forEach((item, index) => {
        const pageNum = index + 1;
        
        // Создаем HTML страницы
        const sheet = document.createElement('div');
        sheet.className = 'paper-sheet';
        sheet.id = `page-${pageNum}`; // ID для навигации
        sheet.setAttribute('data-key', item.key); // Для URL

        // Собираем галерею (берем 3 случайные картинки кроме текущей)
        let galleryHTML = '';
        const otherImages = DATABASE.filter(i => i.img !== item.img).sort(() => 0.5 - Math.random()).slice(0, 3);
        otherImages.forEach(g => {
            galleryHTML += `<img src="${g.img}" class="mini-thumb">`;
        });

        sheet.innerHTML = `
            <div style="border-bottom: 2px solid black; padding-bottom:5px; margin-bottom:30px; display:flex; justify-content:space-between; font-size:10px; font-family:monospace;">
                <span>PATH: .../WEAR/TYPE/${item.key.toUpperCase()}.PDF</span>
                <span>REF: 35099600 S</span>
            </div>

            <div class="content-grid">
                <div class="left-col">
                    <div class="meta">Item # ${item.id}<br>${item.type}</div>
                    <h1>${item.name}</h1>
                    <div class="specs">
                        <p>MATERIAL: LEATHER / SYNTHETIC</p>
                        <p>COLOR: BLACK / GREY / SILVER</p>
                        <p>SPECIAL FEATURES: UNISEX PACKAGE</p>
                        <p>SPECIFICATION: CSS 286.21 A3</p>
                    </div>
                    <div class="price-box">€${item.price}</div>
                    
                    <div class="mini-gallery">
                        ${galleryHTML}
                    </div>
                </div>

                <div class="right-col">
                    <img src="${item.img}" class="main-img">
                    <div class="vertical-code">+(1073) 34 932 6173</div>
                </div>
            </div>

            <div style="margin-top:auto; padding-top:20px; border-top:2px solid black; display:flex; justify-content:space-between; font-size:9px; font-family:monospace; color:#666;">
                <span>Copyright © 2025 Love expensive®</span>
                <span>${item.id}.</span>
            </div>
        `;
        container.appendChild(sheet);

        // Добавляем пункт в меню
        const link = document.createElement('div');
        link.className = 'menu-link';
        link.innerText = `${item.id} ${item.name}`;
        link.onclick = () => scrollToPage(pageNum);
        menuList.appendChild(link);
    });

    // Обработка начального URL
    const initialKey = window.location.pathname.split('/').pop().replace('.pdf', '');
    const foundIndex = DATABASE.findIndex(i => i.key === initialKey);
    if (foundIndex >= 0) {
        scrollToPage(foundIndex + 1);
    }
}

// 2. ФУНКЦИИ СКРОЛЛА И НАВИГАЦИИ
function scrollToPage(num) {
    const el = document.getElementById(`page-${num}`);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

// Слушатель скролла (IntersectionObserver) - обновляет URL и Инпут
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Страница видна более чем на 50%
            const pageId = entry.target.id; // "page-1"
            const pageNum = parseInt(pageId.split('-')[1]);
            const key = entry.target.getAttribute('data-key');

            // Обновляем инпут (если мы не пишем в него прямо сейчас)
            if (document.activeElement !== pageInput) {
                pageInput.value = pageNum;
            }

            // Обновляем URL
            const newUrl = `${PREFIX}/${key}.pdf`;
            if (window.location.pathname !== newUrl) {
                window.history.replaceState(null, "", newUrl);
            }
        }
    });
}, { threshold: 0.5 }); // Срабатывает когда видно 50% страницы

// Запускаем слежение за всеми страницами после их создания
setTimeout(() => {
    document.querySelectorAll('.paper-sheet').forEach(p => observer.observe(p));
}, 500);


// 3. ОБРАБОТЧИКИ ИНПУТОВ
// Инпут страницы
pageInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if(val < 1) val = 1;
    if(val > DATABASE.length) val = DATABASE.length;
    scrollToPage(val);
});

// Инпут зума
zoomInput.addEventListener('change', (e) => {
    updateZoom(parseInt(e.target.value));
});

function changeZoom(delta) {
    updateZoom(currentZoom + delta);
}

function updateZoom(val) {
    currentZoom = val;
    if(currentZoom < 20) currentZoom = 20;
    if(currentZoom > 200) currentZoom = 200;
    
    zoomInput.value = currentZoom;
    zoomWrapper.style.transform = `scale(${currentZoom / 100})`;
    // Важно: зум может сломать скролл, если не увеличить высоту контейнера, 
    // но в простом варианте transform-origin: top center работает нормально.
}

// 4. МЕНЮ (ХОВЕР)
const menuBtn = document.getElementById('menu-btn');
const overlay = document.getElementById('overlay-menu');

menuBtn.addEventListener('mouseenter', () => {
    overlay.classList.add('open');
});
// Закрываем, если увели мышь с меню и с кнопки
overlay.addEventListener('mouseleave', () => {
    overlay.classList.remove('open');
});


// 5. ФУНКЦИЯ СКАЧИВАНИЯ PDF
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    // Проходим по базе и добавляем картинки
    // Примечание: Это упрощенная версия. Мы просто добавляем картинки одну за другой.
    for (let i = 0; i < DATABASE.length; i++) {
        if (i > 0) doc.addPage();
        
        doc.setFontSize(10);
        doc.text(`Item #${DATABASE[i].id} - ${DATABASE[i].name}`, 10, 10);
        
        // Добавляем картинку
        // ВАЖНО: jsPDF требует base64 или image data. 
        // Т.к. картинки локальные, браузер может их загрузить.
        try {
            const img = new Image();
            img.src = DATABASE[i].img;
            doc.addImage(img, 'PNG', 15, 30, 180, 0); // 180mm ширина, высота авто
        } catch (e) {
            doc.text("Image loading error", 10, 50);
        }
    }
    
    doc.save("ler-collection-full.pdf");
}

function openCart() {
    alert("CART WIDGET LOADING...");
}

// Запуск
init();
