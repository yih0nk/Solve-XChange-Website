const carouselWrapper = document.getElementById('carousel-wrapper');

let currentDistance = 0,
    dragging = false,
    distance = 0,
    oldDistance = 0;
    startX = 0;

carouselWrapper.onmousedown = (e) => {
    startX = e.x;
    dragging = true;
}

window.onmousemove = (e) => {
    if (dragging) {
        distance = Math.min(Math.max(0, oldDistance + (startX - e.x) / window.innerWidth), 1);
    }
}

window.onmouseup = (e) => {
    oldDistance = distance;
    dragging = false;
}