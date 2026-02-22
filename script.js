const darkModeMql = window.matchMedia('(prefers-color-scheme: dark)');
if (darkModeMql.matches) 
    document.body.classList.toggle('dark-theme');


let a = ''
let b = ''
let expressionResult = ''
let selectedOperation = null

const outputElement = document.getElementById("result")

const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
        if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
            a += digit;
        }
        outputElement.innerHTML = a;
    } else {
        if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
            b += digit;
            outputElement.innerHTML = b;        
        }
    }
}

digitButtons.forEach(button => {
    button.onclick = function() {
        const digitValue = button.innerHTML;
        onDigitButtonClicked(digitValue);
    }
});

document.getElementById("btn_op_mult").onclick = function() { 
    if (a === '') a = '0';
    selectedOperation = 'x';
}
document.getElementById("btn_op_plus").onclick = function() { 
    if (a === '') a = '0';
    selectedOperation = '+';
}
document.getElementById("btn_op_minus").onclick = function() { 
    if (a === '') a = '0';
    selectedOperation = '-';
}
document.getElementById("btn_op_div").onclick = function() { 
    if (a === '') a = '0';
    selectedOperation = '/';
}

document.getElementById("btn_op_clear").onclick = function() { 
    a = ''
    b = ''
    selectedOperation = ''
    expressionResult = ''
    outputElement.innerHTML = 0
}

document.getElementById("btn_op_sign").onclick = function() {
    if (!selectedOperation) {
        a = (-a).toString();
        outputElement.innerHTML = a;
        if (a == 0)
            a = '';
    } else {
        b = (-b).toString();
        outputElement.innerHTML = b;
        if (b == 0)
            b = '';
    }
}

document.getElementById("btn_op_backspace").onclick = function() {
    if (!selectedOperation) {
        a = a.toString().slice(0, -1);
        if (a)
            outputElement.innerHTML = a;
        else
            outputElement.innerHTML = 0;
    } else {
        b = b.toString().slice(0, -1);
        if (b)
            outputElement.innerHTML = b;
        else
            outputElement.innerHTML = 0;
    }
}

document.getElementById("btn_theme").onclick = function() {
    document.body.classList.toggle('dark-theme');
}

document.getElementById("btn_op_equal").onclick = function() { 
    if (a === '' || b === '' || !selectedOperation)
        return
        
    switch(selectedOperation) { 
        case 'x':
            expressionResult = (+a) * (+b)
            break;
        case '+':
            expressionResult = (+a) + (+b)
            break;
        case '-':
            expressionResult = (+a) - (+b)
            break;
        case '/':
            expressionResult = +((+a) / (+b)).toFixed(6)
            break;
    }
    
    a = expressionResult.toString()
    b = ''
    selectedOperation = null

    outputElement.innerHTML = a
}
