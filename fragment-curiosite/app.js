import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/*
==================================================
FRAGMENT DE LA CURIOSITÉ
Version simple et robuste
==================================================
*/

const sceneContainer = document.getElementById("scene");
const loading = document.getElementById("loading");
const app = document.getElementById("app");
const startButton = document.getElementById("startButton");

/*
==================================================
SCÈNE THREE.JS
==================================================
*/

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x080604);

/*
==================================================
CAMÉRA
==================================================
*/

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 7);

/*
==================================================
RENDU
==================================================
*/

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

sceneContainer.appendChild(renderer.domElement);

/*
==================================================
LUMIÈRES
==================================================
*/

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  1.8
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
  0xffd98a,
  3
);

mainLight.position.set(3, 4, 6);

scene.add(mainLight);

const backLight = new THREE.PointLight(
  0xc88b32,
  5,
  20
);

backLight.position.set(-3, 1, 4);

scene.add(backLight);

/*
==================================================
GROUPE DU FRAGMENT
==================================================
*/

const fragment = new THREE.Group();

scene.add(fragment);

/*
==================================================
IMAGE DU FRAGMENT
==================================================
*/

const textureLoader = new THREE.TextureLoader();

const imageTexture = textureLoader.load(
  "assets/fragment-curiosite.png",
  () => {

    console.log(
      "Fragment chargé correctement."
    );

  },
  undefined,
  (error) => {

    console.error(
      "Impossible de charger l'image :",
      error
    );

  }
);

imageTexture.colorSpace = THREE.SRGBColorSpace;

/*
==================================================
PLAQUE DORÉE
==================================================
*/

const plaqueGeometry =
  new THREE.BoxGeometry(
    4.8,
    3.2,
    0.18
  );

const plaqueMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x9b6d2f,
    metalness: 0.75,
    roughness: 0.35
  });

const plaque =
  new THREE.Mesh(
    plaqueGeometry,
    plaqueMaterial
  );

fragment.add(plaque);

/*
==================================================
IMAGE AU-DESSUS DE LA PLAQUE
==================================================
*/

const imageGeometry =
  new THREE.PlaneGeometry(
    4.55,
    2.95
  );

const imageMaterial =
  new THREE.MeshBasicMaterial({
    map: imageTexture,
    transparent: false
  });

const imagePlane =
  new THREE.Mesh(
    imageGeometry,
    imageMaterial
  );

imagePlane.position.z = 0.11;

fragment.add(imagePlane);

/*
==================================================
CADRE
==================================================
*/

const frameGeometry =
  new THREE.BoxGeometry(
    5.05,
    3.45,
    0.12
  );

const frameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xd8b56a,
    metalness: 0.9,
    roughness: 0.25
  });

const frame =
  new THREE.Mesh(
    frameGeometry,
    frameMaterial
  );

frame.position.z = 0.05;

fragment.add(frame);

/*
==================================================
PETITE GEMME CENTRALE
==================================================
*/

const gemGeometry =
  new THREE.OctahedronGeometry(
    0.22,
    0
  );

const gemMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xe5c878,
    emissive: 0x5a3a08,
    metalness: 0.8,
    roughness: 0.2
  });

const gem =
  new THREE.Mesh(
    gemGeometry,
    gemMaterial
  );

gem.position.set(
  0,
  1.75,
  0.25
);

fragment.add(gem);

/*
==================================================
POSITION INITIALE
==================================================
*/

fragment.position.set(
  0,
  0.4,
  0
);

fragment.rotation.x = -0.08;

/*
==================================================
ANIMATION
==================================================
*/

let time = 0;

function animate() {

  requestAnimationFrame(animate);

  time += 0.01;

  /*
  Rotation lente du fragment
  */
  fragment.rotation.y =
    Math.sin(time * 0.7) * 0.18;

  /*
  Mouvement flottant
  */
  fragment.position.y =
    0.4 + Math.sin(time) * 0.12;

  /*
  Rotation de la gemme
  */
  gem.rotation.x += 0.01;
  gem.rotation.y += 0.015;

  renderer.render(
    scene,
    camera
  );
}

animate();

/*
==================================================
BOUTON
==================================================
*/

startButton.addEventListener(
  "click",
  () => {

    startButton.textContent =
      "LE FRAGMENT EST OUVERT";

    startButton.style.opacity = "0.6";

    /*
    Petit rapprochement de la caméra
    */
    const startZ = camera.position.z;

    const targetZ = 5.2;

    let progress = 0;

    function moveCamera() {

      progress += 0.025;

      if (progress > 1) {
        progress = 1;
      }

      camera.position.z =
        startZ +
        (targetZ - startZ) *
        progress;

      if (progress < 1) {
        requestAnimationFrame(
          moveCamera
        );
      }

    }

    moveCamera();

  }
);

/*
==================================================
REDIMENSIONNEMENT
==================================================
*/

window.addEventListener(
  "resize",
  () => {

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

/*
==================================================
FIN DU CHARGEMENT
==================================================

On ne laisse surtout PAS la page
bloquée sur "OUVERTURE DES ARCHIVES".
==================================================
*/

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      loading.classList.add(
        "hidden"
      );

      app.classList.add(
        "visible"
      );

    }, 1200);

  }
);
