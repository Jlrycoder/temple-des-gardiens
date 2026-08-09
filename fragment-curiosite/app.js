const fragment = document.querySelector(".fragment");

if (fragment) {
    window.addEventListener("deviceorientation", function (event) {

        const beta = event.beta || 0;
        const gamma = event.gamma || 0;

        const rotationX = Math.max(-10, Math.min(10, beta / 6));
        const rotationY = Math.max(-10, Math.min(10, gamma / 3));

        fragment.style.transform =
            `perspective(1000px)
             rotateX(${rotationX}deg)
             rotateY(${rotationY}deg)`;
    });
}
