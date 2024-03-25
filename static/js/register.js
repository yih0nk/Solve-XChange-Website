const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    emailInput = document.getElementById('email-input'),
    passwordInput = document.getElementById('password-input'),
    confirmInput = document.getElementById('confirm-input'),
    tokenInput = document.getElementById('token-input');

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
                console.log('There was a database error.');
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}

function createAccount(event) {
    event.preventDefault();

    if (passwordInput.value != confirmInput)
        //Password must match confirm
        return

    $.ajax({
        url: '/create-account',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value,
                               'token' : tokenInput.value,
                               'password' : passwordInput.value }),
        success: function(response) {
            if (response.result == 'database error')                
                console.log('There was a database error.');
            //redirect if success
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}