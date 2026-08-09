/*
=========================================================
 TEMPLE DES GARDIENS
 FRAGMENT DE LA CURIOSITÉ
 VERSION SIMPLE ET ROBUSTE
=========================================================
*/

(function () {

    "use strict";

    console.log("APP.JS : démarrage");

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("scene");

    const errorMessage =
        document.getElementById("error-message");


    /* =================================================
       VÉRIFICATIONS
    ================================================= */

    if (!container) {
        console.error("ERREUR : #scene introuvable");
        return;
    }

    if (typeof THREE === "undefined") {

        console.error(
            "ERREUR : Three.js n'est pas chargé"
        );

        showError(
            "Impossible de charger le moteur 3D."
        );

        return;
    }


    console.log("Three.js chargé");


    /* =================================================
       SCÈNE
    ================================================= */

    const scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x080604);


    /* =================================================
       CAMÉRA
    ================================================= */

    const camera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );

    camera.position.z = 5;


    /* =================================================
       RENDERER
    ================================================= */

    let renderer;

    try {

        renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: false
            });

    } catch (error) {

        console.error(
            "WebGL indisponible",
            error
        );

        showError(
            "WebGL n'est pas disponible sur cet appareil."
        );

        return;
    }


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );


    /* =================================================
       LUMIÈRE
    ================================================= */

    const light =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );

    scene.add(light);


    /* =================================================
       GROUPE
    ================================================= */

    const group =
        new THREE.Group();

    scene.add(group);


    /* =================================================
       CHARGEMENT DE L'IMAGE
    ================================================= */

    const loader =
        new THREE.TextureLoader();

    console.log(
        "Chargement de l'image..."
    );


    loader.load(

        "assets/fragment-curiosite.png",

        function (texture) {

            console.log(
                "IMAGE CHARGÉE !"
            );

            texture.colorSpace =
                THREE.SRGBColorSpace;


            /* =========================================
               IMAGE
            ========================================= */

            const geometry =
                new THREE.PlaneGeometry(
                    4.2,
                    4.2
                );


            const material =
                new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true
                });


            const image =
                new THREE.Mesh(
                    geometry,
                    material
                );


            group.add(image);


            /* =========================================
               CADRE
            ========================================= */

            const frameGeometry =
                new THREE.RingGeometry(
                    2.12,
                    2.20,
                    96
                );


            const frameMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0xb8893b,
                    transparent: true,
                    opacity: 0.9,
                    side: THREE.DoubleSide
                });


            const frame =
                new THREE.Mesh(
                    frameGeometry,
                    frameMaterial
                );


            frame.position.z = 0.02;

            group.add(frame);


            /* =========================================
               CERCLE INTÉRIEUR
            ========================================= */

            const innerGeometry =
                new THREE.RingGeometry(
                    1.98,
                    2.01,
                    96
                );


            const innerMaterial =
                new THREE.MeshBasicMaterial({
                    color: 0xd8ae63,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide
                });


            const inner =
                new THREE.Mesh(
                    innerGeometry,
                    innerMaterial
                );


            inner.position.z = 0.03;

            group.add(inner);


            /* =========================================
               FIN DU CHARGEMENT
            ========================================= */

            setTimeout(
                hideLoading,
                400
            );

        },

        undefined,

        function (error) {

            console.error(
                "ERREUR IMAGE :",
                error
            );

            showError(
                "Impossible de charger le fragment."
            );

        }
    );


    /* =================================================
       INTERACTION
    ================================================= */

    let dragging = false;

    let lastX = 0;
    let lastY = 0;

    let rotationX = 0;
    let rotationY = 0;


    renderer.domElement.addEventListener(
        "pointerdown",
        function (event) {

            dragging = true;

            lastX = event.clientX;
            lastY = event.clientY;

        }
    );


    renderer.domElement.addEventListener(
        "pointermove",
        function (event) {

            if (!dragging) return;

            const dx =
                event.clientX - lastX;

            const dy =
                event.clientY - lastY;

            rotationY += dx * 0.004;

            rotationX += dy * 0.004;

            rotationX =
                Math.max(
                    -0.5,
                    Math.min(
                        0.5,
                        rotationX
                    )
                );

            lastX = event.clientX;
            lastY = event.clientY;

        }
    );


    renderer.domElement.addEventListener(
        "pointerup",
        function () {

            dragging = false;

        }
    );


    renderer.domElement.addEventListener(
        "pointercancel",
        function () {

            dragging = false;

        }
    );


    /* =================================================
       REDIMENSIONNEMENT
    ================================================= */

    window.addEventListener(
        "resize",
        function () {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        }
    );


    /* =================================================
       ANIMATION
    ================================================= */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const time =
            clock.getElapsedTime();


        if (!dragging) {

            rotationY =
                Math.sin(
                    time * 0.25
                ) * 0.08;

            rotationX =
                Math.cos(
                    time * 0.2
                ) * 0.025;

        }


        group.rotation.y +=
            (
                rotationY -
                group.rotation.y
            ) * 0.06;


        group.rotation.x +=
            (
                rotationX -
                group.rotation.x
            ) * 0.06;


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    /* =================================================
       FONCTIONS
    ================================================= */

    function hideLoading() {

        if (!loading) return;

        loading.classList.add(
            "loading-hidden"
        );

        setTimeout(
            function () {

                loading.style.display =
                    "none";

            },
            800
        );

    }


    function showError(message) {

        console.error(message);

        if (loading) {

            loading.style.display =
                "none";

        }

        if (errorMessage) {

            errorMessage.textContent =
                message;

            errorMessage.style.display =
                "block";

        }

    }


    /* =================================================
       TEST AUTOMATIQUE
    ================================================= */

    setTimeout(
        function () {

            if (
                loading &&
                loading.style.display !== "none"
            ) {

                console.warn(
                    "Le chargement prend trop de temps."
                );

                /*
                  On ne laisse plus jamais
                  l'utilisateur bloqué
                  indéfiniment.
                */

                hideLoading();

            }

        },
        10000
    );


})();
