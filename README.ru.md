# Part Scope

**Язык:** [EN](README.md) · [RU](README.ru.md)

SPA поиска автозапчастей и аналогов через API «Проценка»: React, TypeScript, Vite, Feature-Sliced Design.

## Возможности

1. Поиск по артикулу → список уникальных производителей.
2. Выбор производителя → исходная деталь и аналоги с ценами и остатками по складам.
3. Состояния загрузки, пустого ответа, ошибок API и сети с повторной попыткой.
4. Светлая / тёмная тема (системная по умолчанию, выбор сохраняется).
5. Адаптивный интерфейс: таблица на широких экранах, карточки на узких.

Цена и остаток берутся только из складских предложений (`warehouses[].price` / `stock`). Поле `goods.price` не используется.

## Стек

- React 19 + TypeScript (`strict`) + Vite
- TanStack Query — серверное состояние и кеш
- React Router — маршруты `/`, `/search`, 404
- Feature-Sliced Design: `app` → `pages` → `features` → `entities` → `shared`
- CSS Modules + семантические CSS-переменные
- Vitest + React Testing Library

## Требования

- Node.js 20+ (рекомендуется LTS)
- npm
- Действующий ключ покупателя API «Проценка»

## Быстрый старт

```bash
cp .env.example .env
# укажите реальный VITE_API_KEY в .env
npm install
npm run dev
```

Приложение откроется на адресе Vite (обычно `http://localhost:5173`).

## Скрипты

| Команда              | Назначение                       |
| -------------------- | -------------------------------- |
| `npm run dev`        | Dev-сервер                       |
| `npm run build`      | Production-сборка (`tsc` + Vite) |
| `npm run preview`    | Превью production-сборки         |
| `npm run typecheck`  | Проверка типов                   |
| `npm run lint`       | ESLint                           |
| `npm run lint:fsd`   | Steiger (Feature-Sliced Design)  |
| `npm run test`       | Тесты (Vitest)                   |
| `npm run test:watch` | Тесты в watch-режиме             |
| `npm run format`     | Prettier                         |

## Окружение

Скопируйте `.env.example` в `.env`. Не коммитьте файл с реальным ключом.

| Переменная          | Назначение                 |
| ------------------- | -------------------------- |
| `VITE_API_BASE_URL` | Базовый URL API «Проценка» |
| `VITE_API_KEY`      | Ключ покупателя            |

Ключ попадает в клиентскую сборку. Если ключ секретный или браузер блокирует запросы (CORS / mixed content HTTP→HTTPS), нужен серверный прокси — это отдельный объём работ.

## Маршруты

| Путь                       | Экран                                   |
| -------------------------- | --------------------------------------- |
| `/`                        | Стартовая страница с поиском            |
| `/search?number=…&brand=…` | Результаты: производители и предложения |
| любой другой               | 404                                     |

Динамический поиск помечен `noindex`; в `public/robots.txt` путь `/search` закрыт от индексации.

## Структура проекта

```text
src/
  app/        # точка входа, роутер, провайдеры, shell
  pages/      # home, parts-search, not-found
  features/   # поиск по артикулу (форма + URL)
  entities/   # part: API, типы, нормализация
  shared/     # HTTP, UI-kit, конфиг, токены, утилиты
```

Импорты между срезами — только через публичный `index.ts`. Алиас: `@/*` → `src/*`.

## Лицензия

MIT
