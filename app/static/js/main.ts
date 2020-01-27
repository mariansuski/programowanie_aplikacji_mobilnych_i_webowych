let PASSWORD_REQUIREMENTS_DICT: { [s: string]: RegExp } = {
    'eight letters': /.*[a-zA-Z]{8,}.*/,
}

let LOGIN_REQUIREMENTS_DICT: { [s: string]: RegExp } = {
    'three to twelve small letters': /^[a-z]{3,12}$/,
}

let NAME_REQUIREMENTS_DICT: { [s: string]: RegExp } = {
    'capital and small letters': /^[A-Z]{1}[a-z]+$/,
}

let PESEL_REQUIREMENTS_DICT: { [s: string]: RegExp } = {
    'eleven numbers': /^[0-9]{11}$/,
}

let REQUIREMENTS: { [s: string]: { [s: string]: RegExp } } = {
    'firstname': NAME_REQUIREMENTS_DICT,
    'lastname': NAME_REQUIREMENTS_DICT,
    'password': PASSWORD_REQUIREMENTS_DICT,
    'login': LOGIN_REQUIREMENTS_DICT,
    'pesel': PESEL_REQUIREMENTS_DICT,
}

function validateField(password: string, requirements: { [s: string]: RegExp }): string[] {
    let issues: string[] = []
    for (let name in requirements) {
        if (password.match(requirements[name]) == null) {
            issues.push(name)
        }
        else if (name == 'eleven numbers'){
            let weights: number[] = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7]
            let checksum: number = 0
            for(let i = 0; i < 10; i++){
                checksum += weights[i] * parseInt(password[i])
            }
            if(checksum % 10 != parseInt(password[10])){
                issues.push('numbers with correct checksum')
            }
        }
    }
    return issues
};

function createParagraph(text: string, className: string): HTMLParagraphElement {
    let paragraph: HTMLParagraphElement = document.createElement("p")
    let small: HTMLElement = document.createElement('small')
    small.innerText = text
    paragraph.appendChild(small)
    paragraph.className = className

    return paragraph
}

function removeElementsByClassName(className: string) {
    let comments = document.getElementsByClassName(className)
    while (comments[0]) {
        comments[0].parentNode.removeChild(comments[0])
    }
}

function createComments(element: HTMLInputElement): number {
    let name: string = element.id
    let issues: string[] = validateField(element.value, REQUIREMENTS[name])
    for (let issue = 0; issue < issues.length; issue++) {
        let comment: HTMLParagraphElement = createParagraph(`${name} must contain ${issues[issue]}`, `${name}-issue`)
        element.parentNode.insertBefore(comment, element.nextSibling)
    }

    if (issues.length > 0 || element.value == ''){
        changeFieldStatus(element, false)
    }
    else{
        changeFieldStatus(element, true)
    }

    return issues.length
}

function changeFieldStatus(element: HTMLInputElement, status: boolean){
    if (status){
        if (element.classList.contains('border-danger')){
            element.classList.replace('border-danger', 'border-success')
        }
        else {
            element.classList.add('border-success')
        }
    }
    else {
        if (element.classList.contains('border-success')){
            element.classList.replace('border-success', 'border-danger')
        }
        else {
            element.classList.add('border-danger')
        }
    }
}

async function checkLoginAvailability(login: string) {
    let availability: boolean = false
    const response = await fetch(
        `/user/${login}`,
        {
            method: 'GET',
            mode: 'cors'
        }
    ).then(response => {
        if (response.status == 200) {
            availability = false
        }
        else {
            availability = true
        }
    })
        .catch(error => {
            console.log(error)
            availability = false
        })

    return await availability
}

let form = <HTMLFormElement>document.getElementById('registrationForm')
let inputs = <HTMLCollectionOf<HTMLInputElement>> document.getElementsByClassName('form-control')
for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].id == 'login') {
        inputs[i].oninput = async event => {
            removeElementsByClassName(`${inputs[i].id}-issue`)
            let issues_size: number = createComments(inputs[i])

            if (issues_size == 0) {
                let classes: DOMTokenList = inputs[i].classList
                if (await checkLoginAvailability(inputs[i].value) == true){
                    changeFieldStatus(inputs[i], true)
                }
                else {
                    changeFieldStatus(inputs[i], false)
                    let comment: HTMLParagraphElement = createParagraph(`that login has already been taken`, 'login-issue')
                    inputs[i].parentNode.insertBefore(comment, inputs[i].nextSibling)
                }
            }
        }
    }
    else {
        inputs[i].oninput = event => {
            removeElementsByClassName(`${inputs[i].id}-issue`)
            createComments(inputs[i])
        }
    }
}

function validateForm(): boolean {
    for (let i = 0; i < inputs.length; i++) {
        removeElementsByClassName(`${inputs[i].id}-issue`)
        let issues_size: number = createComments(inputs[i])
        if ((issues_size != 0) || (inputs[i].value == ''))
            return false
    }
    return true
}