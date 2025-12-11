// === НАСТРОЙКИ ПУТИ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 

// === ВАШИ ДАННЫЕ ===
// Слэш / перед именами файлов обязателен
const DATABASE = {
    'clo':    { id: '01', type: 'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '/1.png' },
    'acc':    { id: '02', type: 'Accessory',  name: 'LEATHER BELT',  price: '45', img: '/2.png' },
    'shoes':  { id: '03', type: 'Footwear',   name: 'TECH BOOTS',    price: '120', img: '/3.png' },
    'bag':    { id: '04', type: 'Storage',    name: 'SIDE BAG',      price: '65', img: '/4.png' },
    'hat':    { id: '05', type: 'Headwear',   name: 'NYLON CAP',     price: '30', img: '/5.png' },
    'misc':   { id: '06', type: 'Object',     name: 'KEYCHAIN',      price: '15', img: '/6.png' },
    'final':  { id: '07', type: 'Archive',    name: 'LOOKBOOK',      price: '00', img: '/7.png' }
};

const DEFAULT_KEY = 'clo';

// === ЛОГИКА РАБОТЫ ===
const navContainer = document.getElementById('nav-container');

// Вспомогательная функция: очищает .pdf из URL, чтобы получить чистый ключ (clo, acc)
function getKeyFromUrl(path) {
    let filename = path.split('/').pop(); // Берем последнее слово
    return filename.replace('.pdf', '');  // Убираем .pdf если есть
}

function render(key) {
    // Очищаем ключ на всякий случай
    key = key.replace('.pdf', '');
    
    if (!DATABASE[key]) key = DEFAULT_KEY;
    const item = DATABASE[key];

    // 1. Заполняем тексты
    // Добавляем .PDF визуально на листе бумаги
    document.getElementById('path-display').innerText = `PATH: .../WEAR/TYPE/${key.toUpperCase()}.PDF`;
    document.getElementById('item-id').innerText = item.id;
    document.getElementById('item-category').innerText = item.type;
    document.getElementById('item-title').innerText = item.name;
    document.getElementById('item-price').innerText = item.price;
    document.getElementById('page-number').innerText = `${item.id}.`;
    
    // 2. Ставим картинку
    document.getElementById('main-image').src = item.img;

    // 3. Подсветка меню
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${key}`);
    if (activeBtn) activeBtn.classList.add('active');

    // 4. Меняем URL в браузере (ДОБАВЛЯЕМ .pdf)
    const targetUrl = `${PREFIX}/${key}.pdf`;
    
    // Меняем историю только если URL отличается
    if (window.location.pathname !== targetUrl) {
        window.history.pushState({key}, "", targetUrl);
    }
}

// Генерируем меню
const keys = Object.keys(DATABASE);
keys.forEach(key => {
    const item = DATABASE[key];
    const btn = document.createElement('div');
    btn.className = 'nav-btn';
    btn.id = `btn-${key}`;
    btn.innerHTML = `
        <img src="${item.img}" class="nav-thumb">
        <div class="nav-caption">${item.id}</div>
    `;
    btn.onclick = () => render(key); // При клике вызовется render('clo') -> URL станет clo.pdf
    navContainer.appendChild(btn);
});

// Клик по картинке - листаем дальше
function nextPage() {
    const currentKey = getKeyFromUrl(window.location.pathname);
    let idx = keys.indexOf(currentKey);
    if (idx === -1) idx = 0;
    const nextIdx = (idx + 1) % keys.length;
    render(keys[nextIdx]);
}

// При загрузке страницы (F5)
window.onload = () => {
    const slug = getKeyFromUrl(window.location.pathname);
    render(slug || DEFAULT_KEY);
};

// Кнопка "Назад" в браузере
window.onpopstate = () => {
    const slug = getKeyFromUrl(window.location.pathname);
    render(slug);
};
