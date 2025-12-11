// --- НАСТРОЙКИ ---
const LONG_PATH_PREFIX = '/root/services/usr/+1073/pckg/data/wear/type'; // Ваш длинный путь

// Список страниц. Ключ (clo, acc) будет в конце URL.
// img: имя файла картинки, который вы загрузили на GitHub
const PAGES = {
    'clo':   { title: 'CLOTHING',    img: '1.png' },
    'acc':   { title: 'ACCESSORIES', img: '2.png' },
    'shoes': { title: 'FOOTWEAR',    img: '3.png' }
};

const DEFAULT_PAGE = 'clo'; // С чего начинать

// --- ЛОГИКА ---

// Функция обновления страницы
function render(pageKey) {
    if (!PAGES[pageKey]) pageKey = DEFAULT_PAGE;
    
    // 1. Меняем картинку
    document.getElementById('main-image').src = PAGES[pageKey].img;
    
    // 2. Меняем текст пути на "бумаге"
    document.getElementById('path-display').innerText = `PATH: .../wear/type/${pageKey}`;
    
    // 3. Подсвечиваем меню
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${pageKey}`);
    if(activeBtn) activeBtn.classList.add('active');

    // 4. ГЛАВНОЕ: Меняем реальный URL в браузере без перезагрузки
    const fullUrl = `${LONG_PATH_PREFIX}/${pageKey}`;
    // Если мы уже не там, меняем историю
    if (window.location.pathname !== fullUrl) {
        window.history.pushState({key: pageKey}, "", fullUrl);
    }
}

// Генерация меню
const navContainer = document.getElementById('nav-container');
Object.keys(PAGES).forEach(key => {
    const btn = document.createElement('div');
    btn.className = 'nav-item';
    btn.id = `btn-${key}`;
    btn.innerHTML = `<span class="nav-code">ITEM #${key.toUpperCase()}</span><span class="nav-title">${PAGES[key].title}</span>`;
    btn.onclick = () => render(key);
    navContainer.appendChild(btn);
});

// Клик по картинке листает дальше
function nextPage() {
    const keys = Object.keys(PAGES);
    // Находим текущий ключ из URL
    const currentPath = window.location.pathname;
    const currentKey = currentPath.split('/').pop();
    
    let currentIndex = keys.indexOf(currentKey);
    if (currentIndex === -1) currentIndex = 0;
    
    // Следующий или первый
    const nextIndex = (currentIndex + 1) % keys.length;
    render(keys[nextIndex]);
}

// При загрузке страницы проверяем URL
window.onload = () => {
    const path = window.location.pathname;
    // Берем последнее слово из пути
    const potentialKey = path.split('/').pop();
    
    if (PAGES[potentialKey]) {
        render(potentialKey);
    } else {
        // Если путь пустой или неправильный - ставим дефолт
        render(DEFAULT_PAGE);
    }
};

// Чтобы работали кнопки "Назад" в браузере
window.onpopstate = () => {
    const key = window.location.pathname.split('/').pop();
    render(key);
};
