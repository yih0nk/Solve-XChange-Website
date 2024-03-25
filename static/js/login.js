const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    passwordInput = document.getElementById('password-input');

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

function login() {
    
}