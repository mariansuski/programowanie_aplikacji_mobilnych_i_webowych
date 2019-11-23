function addError(parent, text) {
    var element = document.getElementById(parent);

    var p = document.createElement("p");
    var message = document.createTextNode(text);
    p.appendChild(message);

    element.appendChild(p);

}

var error = false;

function validateName() {

    var name = document.getElementById("name")
    var parent = document.getElementById("name-form");
    if (!(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(name.value))) {
        addError("name-form", "Imie musi zaczynać się z dużej litery, potem występują małe")
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validateLastName() {
    var name = document.getElementById("lastname")
    var parent = document.getElementById("lastname-form");
    if (!(/^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(name.value))) {
        addError("lastname-form", "Nazwisko musi zaczynać się z dużej litery, potem występują małe");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validateBirthdate() {
    var name = document.getElementById("birthdate")
    var parent = document.getElementById("birthdate-form");

    if (!(/^[1-2][90][0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/.test(name.value))) {
        addError("birthdate-form", "Data powinna mieć format YYYY-MM-DD i rok musi być większy od 1900");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validateEmail() {
    var name = document.getElementById("email")
    var parent = document.getElementById("email-form");

    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(name.value))) {
        addError("email-form", "E-mail jest nie poprawny!");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validateLogin() {
    var name = document.getElementById("login")
    var parent = document.getElementById("login-form");
    asyncIsLoginFree(name.value).then((result) => {
        if (!result) {
            addError("login-form", "Login znajduje się w użyciu!")
        }

    });

    if (!(/^[a-z]{3,12}$/.test(name.value))) {
        addError("login-form", "Login powinien zawierać 3-12 małych liter");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validatePassword() {
    var name = document.getElementById("password")
    var parent = document.getElementById("password-form");

    if (!(/^[a-zA-z]{8,}$/.test(name.value))) {
        addError("password-form", "Hasło powinno zawierać minimum 8 znaków");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validatePasswordconfirm() {
    var name = document.getElementById("passwordconfirm")
    var parent = document.getElementById("passwordconfirm-form");
    var password = document.getElementById("password")

    if (name.value !== password.value) {
        addError("passwordconfirm-form", "Hasła muszą być jednakowe!");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validatePesel() {
    var name = document.getElementById("pesel")
    var parent = document.getElementById("pesel-form");

    if (!validatepesel(name.value)) {
        addError("pesel-form", "Podaj poprawny pesel!");
        return false;
    } else {
        elements = parent.getElementsByTagName("p");
        while (elements.length !== 0) {
            parent.removeChild(parent.lastChild);
        }
        return true;
    }
}

function validatepesel(pesel) {
    var reg = /^[0-9]{11}$/;
    if (reg.test(pesel) === false)
        return false;
    else {
        var digits = ("" + pesel).split("");
        if ((parseInt(pesel.substring(4, 6)) > 31) || (parseInt(pesel.substring(2, 4)) > 12))
            return false;

        var checksum = (parseInt(digits[0]) + 3 * parseInt(digits[1]) + 7 * parseInt(digits[2]) + 9 * parseInt(digits[3]) + parseInt(digits[4]) + 3 * parseInt(digits[5]) + 7 * parseInt(digits[6]) + 9 * parseInt(digits[7]) + 1 * parseInt(digits[8]) + 3 * parseInt(digits[9])) % 10;
        if (checksum === 0) checksum = 10;
        checksum = 10 - checksum;

        return (parseInt(digits[10]) === checksum);
    }
}

function asyncIsLoginFree(login) {
    return new Promise((resolve, reject) => {
        const url = `https://pi.iem.pw.edu.pl/user/${login}`;
        var request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = function () {
            if (request.status === 404) {
                // User not found so login is free
                console.log("Please ignore this 404 error");
                resolve(true);
            } else if (request.status === 200) {
                // Login is taken
                resolve(false);
            } else {
                reject(Error(`Unable to verify user; error code:${request.statusText}`));
            }
        };
        request.send();
    });
}