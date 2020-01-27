"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = {
        label: 0, sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
        }, trys: [], ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;

    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {value: op[1], done: false};
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {value: op[0] ? op[1] : void 0, done: true};
    }
};
var _this = this;
var PASSWORD_REQUIREMENTS_DICT = {
    'eight letters': /.*[a-zA-Z]{8,}.*/,
};
var LOGIN_REQUIREMENTS_DICT = {
    'three to twelve small letters': /^[a-z]{3,12}$/,
};
var NAME_REQUIREMENTS_DICT = {
    'capital and small letters': /^[A-Z]{1}[a-z]+$/,
};
var PESEL_REQUIREMENTS_DICT = {
    'eleven numbers': /^[0-9]{11}$/,
};
var REQUIREMENTS = {
    'first_name': NAME_REQUIREMENTS_DICT,
    'last_name': NAME_REQUIREMENTS_DICT,
    'password': PASSWORD_REQUIREMENTS_DICT,
    'login': LOGIN_REQUIREMENTS_DICT,
    'pesel': PESEL_REQUIREMENTS_DICT,
};

function validateField(password, requirements) {
    var issues = [];
    for (var name_1 in requirements) {
        if (password.match(requirements[name_1]) == null) {
            issues.push(name_1);
        } else if (name_1 == 'eleven numbers') {
            var weights = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
            var checksum = 0;
            for (var i = 0; i < 10; i++) {
                checksum += weights[i] * parseInt(password[i]);
            }
            if (checksum % 10 != parseInt(password[10])) {
                issues.push('numbers with correct checksum');
            }
        }
    }
    return issues;
}
;

function createParagraph(text, className) {
    var paragraph = document.createElement("p");
    var small = document.createElement('small');
    small.innerText = text;
    paragraph.appendChild(small);
    paragraph.className = className;
    return paragraph;
}

function removeElementsByClassName(className) {
    var comments = document.getElementsByClassName(className);
    while (comments[0]) {
        comments[0].parentNode.removeChild(comments[0]);
    }
}

function createComments(element) {
    var name = element.id;
    var issues = validateField(element.value, REQUIREMENTS[name]);
    for (var issue = 0; issue < issues.length; issue++) {
        var comment = createParagraph(name + " must contain " + issues[issue], name + "-issue");
        element.parentNode.insertBefore(comment, element.nextSibling);
    }
    if (issues.length > 0 || element.value === '') {
        changeFieldStatus(element, false);
    } else {
        changeFieldStatus(element, true);
    }
    return issues.length;
}

function changeFieldStatus(element, status) {
    if (status) {
        if (element.classList.contains('border-danger')) {
            element.classList.replace('border-danger', 'border-success');
        } else {
            element.classList.add('border-success');
        }
    } else {
        if (element.classList.contains('border-success')) {
            element.classList.replace('border-success', 'border-danger');
        } else {
            element.classList.add('border-danger');
        }
    }
}

function checkLoginAvailability(login) {
    return __awaiter(this, void 0, void 0, function () {
        var availability, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    availability = false;
                    // siema
                    return [4 /*yield*/, fetch(`/user/${login}`, {
                        method: 'GET',
                        mode: 'cors'
                    }).then(function (response) {
                        if (response.status === 200) {
                            availability = false;
                        } else {
                            availability = true;
                        }
                    })
                        .catch(function (error) {
                            console.log(error);
                            availability = false;
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, availability];
                case 2:
                    return [2 /*return*/, _a.sent()];
            }
        });
    });
}

var form = document.getElementById('registrationForm');
var inputs = document.getElementsByClassName('form-control');
var _loop_1 = function (i) {
    if (inputs[i].id === 'login') {
        inputs[i].oninput = function (event) {
            return __awaiter(_this, void 0, void 0, function () {
                var issues_size, classes, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            removeElementsByClassName(inputs[i].id + "-issue");
                            issues_size = createComments(inputs[i]);
                            if (!(issues_size === 0)) return [3 /*break*/, 2];
                            classes = inputs[i].classList;
                            return [4 /*yield*/, checkLoginAvailability(inputs[i].value)];
                        case 1:
                            if ((_a.sent()) === true) {
                                changeFieldStatus(inputs[i], true);
                            } else {
                                changeFieldStatus(inputs[i], false);
                                comment = createParagraph("that login has already been taken", 'login-issue');
                                inputs[i].parentNode.insertBefore(comment, inputs[i].nextSibling);
                            }
                            _a.label = 2;
                        case 2:
                            return [2 /*return*/];
                    }
                });
            });
        };
    } else {
        inputs[i].oninput = function (event) {
            removeElementsByClassName(inputs[i].id + "-issue");
            createComments(inputs[i]);
        };
    }
};
for (var i = 0; i < inputs.length; i++) {
    _loop_1(i);
}

function validateForm() {
    for (var i = 0; i < inputs.length; i++) {
        removeElementsByClassName(inputs[i].id + "-issue");
        var issues_size = createComments(inputs[i]);
        if ((issues_size !== 0) || (inputs[i].value === ''))
            return false;
    }
    return true;
}