# Структура папок изображений

## Структура
```
img/
├── cover/              # Изображения для обложки
│   └── 4.png
├── products/           # Изображения товаров
│   ├── clo/            # HOODIE "DOG"
│   ├── acc/            # LEATHER BELT
│   ├── shoes/          # TECH BOOTS
│   ├── bag/            # SIDE BAG
│   ├── hat/            # NYLON CAP
│   ├── misc/           # KEYCHAIN
│   └── final/          # LOOKBOOK
└── shared/             # Общие файлы
    ├── head.mp4        # Видео для галереи
    └── head-poster.png # Превью для видео
```

## Для каждого товара в products/{key}/
- `main.png` - основное изображение товара
- `1.png` до `7.png` - дополнительные изображения для галереи

## Как добавить новый товар
1. Создайте папку `img/products/{key}/`
2. Добавьте `main.png` - основное изображение
3. Добавьте дополнительные изображения `1.png`, `2.png`, и т.д.
4. Обновите DATABASE в `script.js`

