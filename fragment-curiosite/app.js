 import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/*
=========================================================
 TEMPLE DES GARDIENS
 Fragment de la Curiosité
 Version mobile robuste
=========================================================
*/

const loading = document.getElementById("loading");
const container = document.getElementById("scene");

if (!container) {
    throw new Error("L'élément #scene est introuvable.");
}

/* =====================================================
   SCÈNE
===================================================== */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080604);

/* =====================================================
   CAMÉRA
===================================================== */

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 5);

/* =====================================================
   RENDERER
===================================================== */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

container.innerHTML = "";
container.appendChild(renderer.domElement);

/* =====================================================
   LUMIÈRES
===================================================== */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

/* =====================================================
   GROUPE PRINCIPAL
===================================================== */

const group = new THREE.Group();
scene.add(group);

/* =====================================================
   IMAGE DU FRAGMENT
===================================================== */

const textureLoader = new THREE.TextureLoader();

const imageTexture = textureLoader.load(
    "assets/fragment-curiosite.png",

    () => {
        console.log("Image du fragment chargée.");

        // L'image est chargée :
        // on peut maintenant retirer l'écran de chargement.
        hideLoading();
    },

    undefined,

    (error) => {
        console.error(
            "Impossible de charger fragment-curiosite.png",
            error
        );

        hideLoading();

        showMessage(
            "Le fragment n'a pas pu être chargé."
        );
    }
);

imageTexture.colorSpace = THREE.SRGBColorSpace;

/* =====================================================
   PLAN IMAGE
===================================================== */

const geometry = new THREE.PlaneGeometry(
    4.2,
    4.2
);

const material = new THREE.MeshBasicMaterial({
    map: imageTexture,
    transparent: true
});

const fragment = new THREE.Mesh(
    geometry,
    material
);

group.add(fragment);

/* =====================================================
   CADRE DORÉ
===================================================== */

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

/* =====================================================
   DEUXIÈME CERCLE
===================================================== */

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
        opacity: 0.45,
        side: THREE.DoubleSide
    });

const innerFrame =
    new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

innerFrame.position.z = 0.03;

group.add(innerFrame);

/* =====================================================
   ÉTOILE CENTRALE
===================================================== */

const starShape = new THREE.Shape();

const points = 8;
const outerRadius = 0.14;
const innerRadius = 0.055;

for (let i = 0; i < points * 2; i++) {

    const radius =
        i % 2 === 0
            ? outerRadius
            : innerRadius;

    const angle =
        (i / (points * 2)) *
        Math.PI * 2;

    const x =
        Math.cos(angle) * radius;

    const y =
        Math.sin(angle) * radius;

    if (i === 0) {
        starShape.moveTo(x, y);
    } else {
        starShape.lineTo(x, y);
    }
}

starShape.closePath();

const starGeometry =
    new THREE.ShapeGeometry(starShape);

const starMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xe1bb70,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

const star =
    new THREE.Mesh(
        starGeometry,
        starMaterial
    );

star.position.set(
    0,
    1.82,
    0.05
);

group.add(star);

/* =====================================================
   INTERACTION TACTILE
===================================================== */

let targetRotationX = 0;
let targetRotationY = 0;

let startX = 0;
let startY = 0;
let dragging = false;

renderer.domElement.addEventListener(
    "pointerdown",
    (event) => {

        dragging = true;

        startX = event.clientX;
        startY = event.clientY;

        renderer.domElement.setPointerCapture(
            event.pointerId
        );
    }
);

renderer.domElement.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) return;

        const dx =
            event.clientX - startX;

        const dy =
            event.clientY - startY;

        targetRotationY += dx * 0.003;
        targetRotationX += dy * 0.003;

        targetRotationX =
            Math.max(
                -0.5,
                Math.min(
                    0.5,
                    targetRotationX
                )
            );

        startX = event.clientX;
        startY = event.clientY;
    }
);

renderer.domElement.addEventListener(
    "pointerup",
    () => {
        dragging = false;
    }
);

renderer.domElement.addEventListener(
    "pointercancel",
    () => {
        dragging = false;
    }
);

/* =====================================================
   REDIMENSIONNEMENT
===================================================== */

window.addEventListener(
    "resize",
    resize
);

function resize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}

/* =====================================================
   ÉCRAN DE CHARGEMENT
===================================================== */

function hideLoading() {

    if (!loading) return;

    loading.style.opacity = "0";

    setTimeout(() => {

        loading.style.display = "none";

    }, 700);
}

/* =====================================================
   MESSAGE D'ERREUR
===================================================== */

function showMessage(message) {

    const box =
        document.createElement("div");

    box.textContent = message;

    box.style.position = "fixed";
    box.style.left = "50%";
    box.style.top = "50%";
    box.style.transform =
        "translate(-50%, -50%)";

    box.style.zIndex = "9999";

    box.style.padding = "20px";

    box.style.background =
        "rgba(20,10,5,0.95)";

    box.style.color = "#e8c98a";

    box.style.fontFamily =
        "Georgia, serif";

    box.style.textAlign = "center";

    box.style.border =
        "1px solid #8b6837";

    box.style.borderRadius =
        "10px";

    document.body.appendChild(box);
}

/* =====================================================
   ANIMATION
===================================================== */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsed =
        clock.getElapsedTime();

    /*
      Mouvement très léger lorsqu'on
      ne touche pas l'écran.
    */

    if (!dragging) {

        targetRotationY =
            Math.sin(elapsed * 0.25) *
            0.08;

        targetRotationX =
            Math.cos(elapsed * 0.2) *
            0.025;
    }

    group.rotation.y +=
        (targetRotationY -
            group.rotation.y) *
        0.06;

    group.rotation.x +=
        (targetRotationX -
            group.rotation.x) *
        0.06;

    star.rotation.z =
        elapsed * 0.15;

    renderer.render(
        scene,
        camera
    );
}

animate();

/* =====================================================
   FIN D'INITIALISATION
===================================================== */

console.log(
    "Temple des Gardiens : moteur chargé."
);
