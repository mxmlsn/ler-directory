// === НАСТРОЙКИ ===
const PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; 

// Здесь связываем короткое имя (clo) с файлом (1.png) и текстом
// ВАЖНО: Убедитесь, что файлы 1.png, 2.png загружены в корень репозитория
const DATA = {
    'clo': { 
        id: '01',
        title: 'Longsleeve "Dog"',
        price: '80', 
        img: '1.png' // Имя вашего файла
    },
    'acc': { 
        id: '02',
        title: 'Leather Belt', 
        price: '45', 
        img: '2.png' 
    },
    'shoes': { 
        id: '03',
        title: 'Tech Boots', 
        price: '120', 
        img: '3.png' 
    }
    // Можете добавлять сколько угодно: 'key': { ... }
};

const DEFAULT = 'clo';

// === ЛОГИКА ===
const navContainer = document.getElementById('nav-container');

function render(key) {
    if (!DATA[key]) key = DEFAULT;
    const item = DATA[key];

    // 1. Заполняем "бумагу" данными
    document.getElementById('item-id').innerText = key.toUpperCase(); // или item.id
    document.getElementById('item-title').innerText = item.title;
    document.getElementById('item-price').innerText = item.price;
    document.getElementById('main-image').src = item.img;
    document.getElementById('path-display').innerText = `PATH: .../wear/type/${key}`;

    // 2. Обновляем URL
    const newUrl = `${PREFIX}/${key}`;
    if (window.location.pathname !== newUrl) {
        window.history.pushState({key}, "", newUrl);
    }

    // 3. Подсветка меню
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(`nav-${key}`);
    if (activeEl) activeEl.classList.add('active');
}

// Создаем кнопки в меню
Object.keys(DATA).forEach(key => {
    const item = DATA[key];
    const btn = document.createElement('div');
    btn.className = 'nav-item';
    btn.id = `nav-${key}`;
    
    // В меню тоже показываем миниатюрку
    btn.innerHTML = `
        <img src="${item.img}" class="nav-thumb">
        <span class="nav-label">Page ${item.id}</span>
        <span style="font-weight:bold; font-size:12px">${key.toUpperCase()}</span>
    `;
    
    btn.onclick = () => render(key);
    navContainer.appendChild(btn);
});

// Старт
const path = window.location.pathname;
const slug = path.split('/').pop();
render(slug || DEFAULT);

// Кнопки браузера "Назад/Вперед"
window.onpopstate = () => {
    render(window.location.pathname.split('/').pop());
};
