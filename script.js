// === НАСТРОЙКИ ПУТИ ===
// Часть URL, которая будет всегда висеть в браузере
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 

// === ВАШИ ДАННЫЕ (7 ФАЙЛОВ) ===
// 'clo' - это то, что будет в конце ссылки.
// img: '1.png' - это имя файла на GitHub
const DATABASE = {
    'clo':    { id: '01', type: 'Longsleeve', name: 'HOODIE "DOG"',  price: '80', img: '1.png' },
    'acc':    { id: '02', type: 'Accessory',  name: 'LEATHER BELT',  price: '45', img: '2.png' },
    'shoes':  { id: '03', type: 'Footwear',   name: 'TECH BOOTS',    price: '120', img: '3.png' },
    'bag':    { id: '04', type: 'Storage',    name: 'SIDE BAG',      price: '65', img: '4.png' },
    'hat':    { id: '05', type: 'Headwear',   name: 'NYLON CAP',     price: '30', img: '5.png' },
    'misc':   { id: '06', type: 'Object',     name: 'KEYCHAIN',      price: '15', img: '6.png' },
    'final':  { id: '07', type: 'Archive',    name: 'LOOKBOOK',      price: '00', img: '7.png' }
};

// С какой страницы начинать
const DEFAULT_KEY = 'clo';

// === ЛОГИКА РАБОТЫ ===
const navContainer = document.getElementById('nav-container');

function render(key) {
    if (!DATABASE[key]) key = DEFAULT_KEY;
    const item = DATABASE[key];

    // 1. Заполняем тексты на странице
    document.getElementById('path-display').innerText = `PATH: .../WEAR/TYPE/${key.toUpperCase()}`;
    document.getElementById('item-id').innerText = item.id;
    document.getElementById('item-category').innerText = item.type;
    document.getElementById('item-title').innerText = item.name;
    document.getElementById('item-price').innerText = item.price;
    document.getElementById('page-number').innerText = `${item.id}.`;
    
    // 2. Ставим картинку
    document.getElementById('main-image').src = item.img;

    // 3. Подсвечиваем кнопку в меню
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${key}`);
    if (activeBtn) activeBtn.classList.add('active');

    // 4. Меняем URL в браузере (самое важное!)
    const targetUrl = `${PREFIX}/${key}`;
    if (window.location.pathname !== targetUrl) {
        window.history.pushState({key}, "", targetUrl);
    }
}

// Генерируем меню слева
const keys = Object.keys(DATABASE);
keys.forEach(key => {
    const item = DATABASE[key];
    const btn = document.createElement('div');
    btn.className = 'nav-btn';
    btn.id = `btn-${key}`;
    // В меню показываем маленькую картинку и номер
    btn.innerHTML = `
        <img src="${item.img}" class="nav-thumb">
        <div class="nav-caption">${item.id}</div>
    `;
    btn.onclick = () => render(key);
    navContainer.appendChild(btn);
});

// Клик по картинке - следующая страница
function nextPage() {
    const currentPath = window.location.pathname.split('/').pop();
    let idx = keys.indexOf(currentPath);
    if (idx === -1) idx = 0;
    const nextIdx = (idx + 1) % keys.length;
    render(keys[nextIdx]);
}

// При загрузке страницы
window.onload = () => {
    const slug = window.location.pathname.split('/').pop();
    render(slug || DEFAULT_KEY);
};

// Кнопка "Назад" в браузере
window.onpopstate = () => {
    render(window.location.pathname.split('/').pop());
};
