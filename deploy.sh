#!/bin/bash

# Скрипт для автоматического пуша и мерджа в main
# Использование: ./deploy.sh "описание коммита"

CURRENT_BRANCH=$(git branch --show-current)
MAIN_BRANCH="main"
COMMIT_MSG=${1:-"Update"}

echo "🚀 Начинаем деплой из ветки: $CURRENT_BRANCH"

# Проверяем, что есть изменения
if [ -z "$(git status --porcelain)" ]; then
    echo "❌ Нет изменений для коммита"
    exit 1
fi

# Добавляем все изменения (кроме .DS_Store)
git add -A
git reset HEAD .DS_Store 2>/dev/null || true

# Коммитим
echo "📝 Создаём коммит..."
git commit -m "$COMMIT_MSG" || {
    echo "❌ Ошибка при создании коммита"
    exit 1
}

# Пушим текущую ветку
echo "⬆️  Пушим ветку $CURRENT_BRANCH..."
git push origin "$CURRENT_BRANCH" || {
    echo "❌ Ошибка при пуше"
    exit 1
}

# Переключаемся на main
echo "🔄 Переключаемся на $MAIN_BRANCH..."
git checkout "$MAIN_BRANCH" || {
    echo "❌ Ошибка при переключении на $MAIN_BRANCH"
    exit 1
}

# Обновляем main
echo "⬇️  Обновляем $MAIN_BRANCH..."
git pull origin "$MAIN_BRANCH" || {
    echo "❌ Ошибка при обновлении $MAIN_BRANCH"
    exit 1
}

# Мержим текущую ветку в main
echo "🔀 Мержим $CURRENT_BRANCH в $MAIN_BRANCH..."
git merge "$CURRENT_BRANCH" || {
    echo "❌ Ошибка при мердже"
    exit 1
}

# Пушим main
echo "⬆️  Пушим $MAIN_BRANCH..."
git push origin "$MAIN_BRANCH" || {
    echo "❌ Ошибка при пуше $MAIN_BRANCH"
    exit 1
}

# Возвращаемся на исходную ветку
echo "🔄 Возвращаемся на $CURRENT_BRANCH..."
git checkout "$CURRENT_BRANCH"

echo "✅ Готово! Все изменения запушены и смержены в $MAIN_BRANCH"

