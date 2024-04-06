const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    emailInput = document.getElementById('email-input'),
    passwordInput = document.getElementById('password-input');

const errorBox = document.getElementById('error-box'),
    successBox = document.getElementById('success-box');

function logError(value) {
    successBox.innerHTML = '';
    errorBox.innerHTML = value;
    setTimeout(() => errorBox.innerHTML = '', '30000');
}

function logSuccess(value) {
    errorBox.innerHTML = '';
    successBox.innerHTML = value;
    setTimeout(() => successBox.innerHTML = '', '30000');
}


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

function login(event) {
    event.preventDefault();

    $.ajax({
        url: '/user-login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value,
                               'password' : passwordInput.value }),
        success: function(response) {
            if (response.result == 'invalid credentials')
                logError('Invalid email or password.');
            else if (response.result == 'user does not exist')
                logError('Account does not exist.');
            else {
                logSuccess('Successfully logged in.');
                setTimeout(() => window.location.href = `${url}/forum`, '500');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}