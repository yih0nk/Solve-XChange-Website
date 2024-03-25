const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    confirmInput = document.getElementById('confirm-input'),
    passwordInput = document.getElementById('password-input'),
    emailInput = document.getElementById('email-input');

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

    if (confirmInput.value != passwordInput.value)
        return;

    $.ajax({
        url: '/send-verify-email',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value,
                               'password' : passwordInput.value }),
        success: function(response) {
            if (response.result == 'database error')                
                console.log('There was a database error.');
            else {

            }
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}