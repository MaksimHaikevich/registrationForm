const form = document.querySelector('#form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const birthDate = document.querySelector('#birth-date');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');

let isValid;

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-item success';
    isValid = true
}

function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-item error';
    const small = formControl.querySelector('.error-message');
    small.innerText = message;
    isValid = false
}


function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input)
    } else {
        showError(input, 'Введите email правильно');
    }
}

function checkPassword(input, min) {
    const re = /(?=.*[0-9])(?=.*[!@#$%])(?=.*[A-Z])/g
    checkLength(input, 8, 50)
    if (re.test(input.value.trim())) {
        showSuccess(input)
    } else if (input.value.length < min) {
        showError(input, `Мин. кол-во символов: ${min}`);
    } else {
        showError(input, 'Пароль минимум должен содержать: 1 заглавную букву, одну цифру от 1 до 9, 1 специальный символ из перечисленных !@#$% ');
    }
}

function checkRequired(inputArr) {
    inputArr.forEach(function (input) {
        if (input.value.trim() === '') {
            showError(input, `Обязательное поле`)
        } else {
            showSuccess(input);
        }
    });
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `Мин. кол-во символов: ${min}`);
    } else if (input.value.length > max) {
        showError(input, `Макс. кол-во символов: ${max}`);
    } else {
        showSuccess(input);
    }
}

function checkPasswordMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input1, 'Пароли не совпадают');
        showError(input2, 'Пароли не совпадают');
    } else if (input2.value.length === 0) {
        showError(input2, 'Обязательное поле')
    } else {
        showSuccess(input1)
        showSuccess(input2)
    }
}

function checkBirthDate(input) {
    const date = new Date();
    const maxDate = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear()
    if (input.valueAsNumber > Date.now()) {
        showError(input, `Максимальная дата ${maxDate}`)
    } else {
        showSuccess(input)
    }
}

async function fetchData(firstName, lastName, birthDate, email, password, confirmPassword) {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            firstName,
            lastName,
            birthDate,
            email,
            password,
            confirmPassword,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));

}

firstName.oninput = function () {
    checkLength(firstName, 2, 25)
}
lastName.oninput = function () {
    checkLength(lastName, 2, 25)
}
birthDate.oninput = function () {
    checkBirthDate(birthDate)
}
email.oninput = function () {
    checkEmail(email);
}
password.oninput = function () {
    checkPasswordMatch(password, confirmPassword);
    checkPassword(password, 8)
}
confirmPassword.oninput = function () {
    checkPasswordMatch(password, confirmPassword);
    checkPassword(password, 8)
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const filedArr = [firstName, lastName, birthDate, email, password, confirmPassword]
    const emptyInputs = Array.from(filedArr).filter(input => input.value === '');
    checkRequired(emptyInputs);

    if (isValid) {
        fetchData(firstName.value, lastName.value, birthDate.value, email.value, password.value, confirmPassword.value)
    }

});
