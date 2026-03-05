# Лабораторная работа №1 — Вёрстка веб‑калькулятора (HTML/CSS)

## Содержание

- [Задание](#задание)
- [Цель](#цель)
- [Вариант и референсы (Яндекс Карты)](#вариант-и-референсы-яндекс-карты)
- [Реализация](#реализация)
  - [Структура страницы (HTML)](#структура-страницы-html)
  - [Стили (CSS)](#стили-css)
- [Доп. вопросы на защите (реализованные фичи)](#доп-вопросы-на-защите-реализованные-фичи)
  - [1) Как сделать сворачивающийся блок «Автор» без JavaScript?](#1-как-сделать-сворачивающийся-блок-автор-без-javascript)
  - [2) Как реализовать различие кнопок по приоритету (primary/secondary) одним базовым классом?](#2-как-реализовать-различие-кнопок-по-приоритету-primarysecondary-одним-базовым-классом)
  - [3) Как оформить интерактивные состояния кнопки (:hover и :active)?](#3-как-оформить-интерактивные-состояния-кнопки-hover-и-active)

---

## Задание

1. Сверстать интерфейс простого калькулятора в HTML.
2. Подключить таблицу стилей и оформить калькулятор с помощью CSS.
3. Применить классы для:
   - кнопок цифр;
   - кнопок второстепенных операций;
   - кнопок основных операций;
   - поля вывода результата.
4. Дополнительно (в рамках варианта/самостоятельных пунктов):
   - центрировать калькулятор на странице;
   - сделать кнопки квадратными со скруглением;
   - добавить интерактивные состояния при наведении/нажатии;
   - добавить блок с информацией об авторе.
5. Продемонстрировать страницу, используя веб-сервер или расширение для IDE
## Цель

Познакомиться с основами построения пользовательских интерфейсов web‑страниц средствами **HTML** и **CSS**: разметка, стилизация элементов, работа с классами/селектором, базовые интерактивные состояния (`:hover`, `:active`) и простые компоненты без JavaScript.

## Вариант и референсы (Яндекс Карты)

**Вариант:** стилизация интерфейса «в духе карточек» (светлый фон, тени, скругления) + использование шрифта, близкого к интерфейсам Яндекса.

**Референсы:**

- Яндекс Карты (веб): https://yandex.ru/maps/

## Реализация

### Структура страницы (HTML)

- Основной контейнер калькулятора: `.calculator-container`.
- Поле вывода результата: `#result.result`.
- Блок кнопок: `.buttons-grid`.
- Информация об авторе оформлена нативным сворачивающимся блоком `details/summary`.

Фрагмент разметки из `calculator.html`:

```html
<div class="calculator-container">
  <details class="info-details">
    <summary>Автор</summary>
    <p>ФИО: Аксёнкин Никита</p>
    <p>Группа: ИУ5-44Б</p>
  </details>

  <div id="result" class="result">
    0
  </div>

  <div class="buttons-grid">
    <div>
      <button id="btn_op_clear" class="my-btn secondary">C</button>
      <button id="btn_op_sign" class="my-btn secondary">+/-</button>
      <button id="btn_op_percent" class="my-btn secondary">%</button>
      <button id="btn_op_div" class="my-btn primary">/</button>
    </div>
    <!-- ... -->
  </div>
</div>
```

### Стили (CSS)

В `style.css` реализованы:

- центрирование калькулятора по вертикали и горизонтали через flex;
- «карточный» контейнер (фон, padding, тень, скругление);
- стили для поля вывода результата;
- базовый стиль кнопки + модификаторы `.primary`, `.secondary`, `.execute`;
- анимация/обратная связь на `:hover` и `:active`.

Ключевые фрагменты из `style.css`:

```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'YS Text', Arial;
  margin: 0;
  padding: 20px 0;
}

.calculator-container {
  width: 280px;
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

---

## Доп. вопросы на защите (реализованные фичи)

Ниже — примеры доп. вопросов «на защите» и фрагменты кода, которые демонстрируют реализацию (все примеры уже присутствуют в проекте).

### 1) Как сделать сворачивающийся блок «Автор» без JavaScript?

Используется нативная пара тегов `details/summary` + стилизация маркера/стрелки через псевдоэлементы.

```html
<details class="info-details">
  <summary>Автор</summary>
  <p>ФИО: Аксёнкин Никита</p>
  <p>Группа: ИУ5-44Б</p>
</details>
```

```css
.info-details summary::before {
  content: "▶ ";
  display: inline-block;
  transition: transform 0.2s ease;
}

.info-details[open] summary::before {
  transform: rotate(90deg);
}
```

### 2) Как реализовать различие кнопок по приоритету (primary/secondary) одним базовым классом?

Применяется подход: **базовый класс** `.my-btn` + **модификаторы** `.primary`/`.secondary`.

```html
<button id="btn_op_clear" class="my-btn secondary">C</button>
<button id="btn_op_plus" class="my-btn primary">+</button>
<button id="btn_op_equal" class="my-btn primary execute">=</button>
```

```css
.my-btn {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 12px;
  border: none;
  background: #ffffff;
  color: #212121;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.my-btn.secondary {
  background: #f2f2f2;
  color: #212121;
}

.my-btn.primary {
  background: linear-gradient(146deg, rgba(255, 50, 0, 1) 0%, rgba(237, 102, 72, 1) 100%);
  color: #ffffff;
  font-weight: bold;
}
```

### 3) Как оформить интерактивные состояния кнопки (:hover и :active)?

Состояния реализованы через CSS псевдоклассы и плавные переходы (`transition`).

```css
.my-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.my-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  filter: brightness(95%);
}
```
