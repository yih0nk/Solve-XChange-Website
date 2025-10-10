const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    emailInput = document.getElementById('email-input'),
    passwordInput = document.getElementById('password-input'),
    confirmInput = document.getElementById('confirm-input'),
    tokenInput = document.getElementById('token-input'),
    firstnameInput = document.getElementById('firstname-input'),
    lastnameInput = document.getElementById('lastname-input');

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
        confirmInput.type = 'text';
    }
    else{
        showLabel.innerHTML = 'Show';
        passwordInput.type = 'password';
        confirmInput.type = 'password';
    }
}

function verify(event) {
    event.preventDefault();

    $.ajax({
        url: '/send-verify-email',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value }),
        success: function(response) {
            if (response.result == 'database error')
                logError('There was an error with the database, please try again later.');
            else if (response.result == 'user already exists')
                logError('Email already used.');
            else
                logSuccess(`Verification email sent to ${emailInput.value}.`);
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}

function createAccount(event) {
    event.preventDefault();

    if (!firstnameInput.value || !lastnameInput.value || !passwordInput.value) {
        logError('Please fill in all the fields.');
        return;
    }

    if ((!/^[a-zA-Z\s]+$/.test(firstnameInput.value)) || (!/^[a-zA-Z\s]+$/.test(lastnameInput.value))){
        logError('Your name can only contain letters.');
        return;
    }

    $.ajax({
        url: '/create-account',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value,
                               'firstname' : firstnameInput.value,
                               'lastname' : lastnameInput.value,
                               'token' : tokenInput.value,
                               'password' : passwordInput.value }),
        success: function(response) {
            if (response.result == 'database error')
                logError('There was an error with the database, please try again later.');
            else if (response.result == 'token mismatch')
                logError('The token does not match the token given.');
            else
                window.location.href = '/login'
                // logSuccess('Account successfully created');
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}

function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}