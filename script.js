const darkModeMql = window.matchMedia('(prefers-color-scheme: dark)');
if (darkModeMql.matches)
    document.body.classList.toggle('dark-theme');

let first_number = '';
let second_number = '';
let expressionResult = '';
let selectedOperation = null;

const outputElement = document.getElementById("result");

const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
        if ((digit !== '.') || (digit === '.' && !first_number.includes('.'))) {
            first_number += digit;
        }
        outputElement.innerHTML = first_number;
    } else if ((digit !== '.') || (digit === '.' && !second_number.includes('.'))) {
        second_number += digit;
        outputElement.innerHTML = second_number;
    }

}

digitButtons.forEach(button => {
    button.onclick = function () {
        const digitValue = button.innerHTML;
        onDigitButtonClicked(digitValue);
    };
});

document.getElementById("btn_op_mult").onclick = function () {
    if (first_number === '') first_number = '0';
    selectedOperation = 'x';
};
document.getElementById("btn_op_plus").onclick = function () {
    if (first_number === '') first_number = '0';
    selectedOperation = '+';
};
document.getElementById("btn_op_minus").onclick = function () {
    if (first_number === '') first_number = '0';
    selectedOperation = '-';
};
document.getElementById("btn_op_div").onclick = function () {
    if (first_number === '') first_number = '0';
    selectedOperation = '/';
};

document.getElementById("btn_op_clear").onclick = function () {
    first_number = '';
    second_number = '';
    selectedOperation = '';
    expressionResult = '';
    outputElement.innerHTML = 0;
};

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

document.getElementById("btn_theme").onclick = function () {
    document.body.classList.toggle('dark-theme');
};

document.getElementById("btn_op_equal").onclick = function () {
    if (first_number === '' || second_number === '' || !selectedOperation)
        return;

    switch (selectedOperation) {
        case 'x':
            expressionResult = (+first_number) * (+second_number);
            break;
        case '+':
            expressionResult = (+first_number) + (+second_number);
            break;
        case '-':
            expressionResult = (+first_number) - (+second_number);
            break;
        case '/':
            expressionResult = +((+first_number) / (+second_number)).toFixed(6);
            break;
    }

    first_number = expressionResult.toString();
    second_number = '';
    selectedOperation = null;

    outputElement.innerHTML = first_number;
};
