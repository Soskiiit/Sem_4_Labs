# ЛР 2. Calculator. JavaScript

## Содержание
- [Задание](#zadanie)
- [Цель](#cel)
- [Вариант и референсы](#variant)
- [Дополнительные вопросы (сниппеты из кода)](#extra)

## <a id="zadanie"></a>Задание
Разработать веб-страницу с калькулятором на HTML/CSS/JavaScript:
- сверстать интерфейс калькулятора;
- реализовать ввод чисел и выбор операции;
- реализовать вычисление результата по нажатию `=`;
- добавить вспомогательные операции: очистка, смена знака, удаление последнего символа;
- оформить страницу стилями.

Файлы проекта:
- `calculator.html` — разметка;
- `style.css` — стили;
- `script.js` — логика.

## <a id="cel"></a>Цель
Познакомиться с базовыми инструментами построения web-интерфейсов (HTML/CSS/JS) и научиться:
- получать доступ к DOM-элементам из JavaScript;
- обрабатывать пользовательские события (клики по кнопкам);
- поддерживать состояние приложения (введённые числа, выбранная операция);
- реализовывать простую бизнес-логику на JS.

## <a id="variant"></a>Вариант и референсы
Вариант оформления — интерфейс в стиле Яндекс (использован логотип и визуальная стилизация).

Референсы:
- Яндекс.Карты (как источник визуального стиля/ассоциации): https://yandex.ru/maps/

В проекте используется изображение `Yandex_Maps_icon.png`, размещённое на странице:
```html
<img src="Yandex_Maps_icon.png" class="yandex-logo" alt="Yandex Maps">
```

## <a id="extra"></a>Дополнительные вопросы (сниппеты из кода)

Ниже — 3 дополнительных вопроса (и ответы), подтверждённые фрагментами из уже реализованного кода.

### 1) Как реализовано автоопределение тёмной темы и ручной переключатель?
Фрагмент из `script.js`:
```js
const darkModeMql = window.matchMedia('(prefers-color-scheme: dark)');
if (darkModeMql.matches)
    document.body.classList.toggle('dark-theme');

document.getElementById("btn_theme").onclick = function () {
    document.body.classList.toggle('dark-theme');
};
```

### 2) Как реализованы операции `+/-` и backspace (`<`)?
Фрагмент из `script.js`:
```js
document.getElementById("btn_op_sign").onclick = function () {
    if (!selectedOperation) {
        first_number = (-first_number).toString();
        outputElement.innerHTML = first_number;
        if (first_number == 0)
            first_number = '';
    } else {
        second_number = (-second_number).toString();
        outputElement.innerHTML = second_number;
        if (second_number == 0)
            second_number = '';
    }
};

document.getElementById("btn_op_backspace").onclick = function () {
    if (!selectedOperation) {
        first_number = first_number.toString().slice(0, -1);
        if (first_number)
            outputElement.innerHTML = first_number;
        else
            outputElement.innerHTML = 0;
    } else {
        second_number = second_number.toString().slice(0, -1);
        if (second_number)
            outputElement.innerHTML = second_number;
        else
            outputElement.innerHTML = 0;
    }
};
```

### 3) Как сделано округление результата деления?
Фрагмент из `script.js`:
```js
case '/':
    expressionResult = +((+first_number) / (+second_number)).toFixed(6);
    break;
```