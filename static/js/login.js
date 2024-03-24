const showLabel = document.querySelector('#show-text'),
    showCheckbox = document.querySelector('#show-password'),
    passwordInput = document.querySelector('#password-input');

function showPassword() {
    if (showCheckbox.checked){
        showLabel.innerHTML = 'Hide';
        passwordInput.type = 'text';
    }
    else{
        showLabel.innerHTML = 'Show';
        passwordInput.type = 'password';
    }
}

function register() {

}

function login() {
    
}