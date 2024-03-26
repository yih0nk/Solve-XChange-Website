const url = 'http://127.0.0.1:5000';

function getCookie(name) {
    const cookieString = document.cookie,
          cookies = cookieString.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    
    return null;
}