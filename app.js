import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
   TEMPLE DES GARDIENS
   Fragment de la Curiosité
   Moteur 3D / 2,5D
   ========================================================= */

const container = document.getElementById("scene");
const loading = document.getElementById("loading");

/* ---------------------------------------------------------
   SCÈNE
--------------------------------------------------------- */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x090705);

/* ---------------------------------------------------------
   CAMÉRA
--------------------------------------------------------- */

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 5);

/* ---------------------------------------------------------
   RENDERER
--------------------------------------------------------- */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

/* ---------------------------------------------------------
   LUMIÈRES
--------------------------------------------------------- */

const ambientLight = new THREE.AmbientLight(
  0xffd28a,
  1.4
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
  0xffb347,
  2.2
);

mainLight.position.set(2, 3, 5);

scene.add(mainLight);

/* ---------------------------------------------------------
   GROUPE PRINCIPAL
--------------------------------------------------------- */

const fragmentGroup = new THREE.Group();

scene.add(fragmentGroup);

/* ---------------------------------------------------------
   IMAGE DU FRAGMENT
--------------------------------------------------------- */

const imagePaths = [
  "fragment-curiosite/assets/fragment-curiosite.png",
  "assets/fragment-curiosite.png"
];

const textureLoader = new THREE.TextureLoader();

let fragmentTexture = null;

function loadTexture(index = 0) {

  return new Promise((resolve, reject) => {

    if (index >= imagePaths.length) {
      reject(new Error("Image du fragment introuvable."));
      return;
    }

    textureLoader.load(
      imagePaths[index],

      texture => {

        texture.colorSpace = THREE.SRGBColorSpace;

        resolve(texture);
      },

      undefined,

      () => {

        loadTexture(index + 1)
          .then(resolve)
          .catch(reject);

      }
    );

  });

}

/* ---------------------------------------------------------
   CRÉATION DU FRAGMENT
--------------------------------------------------------- */

async function createFragment() {

  try {

    fragmentTexture = await loadTexture();

    const image = fragmentTexture.image;

    const imageRatio =
      image.width / image.height;

    const height = 4.7;

    const width = height * imageRatio;

    /* ---------------------------------------------
       PLAQUE PRINCIPALE
    --------------------------------------------- */

    const geometry =
      new THREE.PlaneGeometry(
        width,
        height,
        40,
        40
      );

    const material =
      new THREE.MeshStandardMaterial({
        map: fragmentTexture,
        roughness: 0.72,
        metalness: 0.08
      });

    const fragment =
      new THREE.Mesh(
        geometry,
        material
      );

    fragmentGroup.add(fragment);

    /* ---------------------------------------------
       ÉPAISSEUR DU PAPIER
    --------------------------------------------- */

    const backGeometry =
      new THREE.PlaneGeometry(
        width * 0.985,
        height * 0.985
      );

    const backMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x4b2c12,
        roughness: 1
      });

    const back =
      new THREE.Mesh(
        backGeometry,
        backMaterial
      );

    back.position.z = -0.045;

    fragmentGroup.add(back);

    /* ---------------------------------------------
       LUMIÈRE DU FRAGMENT
    --------------------------------------------- */

    const glowGeometry =
      new THREE.CircleGeometry(
        1.8,
        64
      );

    const glowMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xff9d27,
        transparent: true,
        opacity: 0.045,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

    const glow =
      new THREE.Mesh(
        glowGeometry,
        glowMaterial
      );

    glow.position.z = 0.04;

    fragmentGroup.add(glow);

    /* ---------------------------------------------
       OEIL 3D
       Petit élément animé placé au centre
    --------------------------------------------- */

    createEye();

    /* ---------------------------------------------
       POSITION INITIALE
    --------------------------------------------- */

    fragmentGroup.rotation.x = 0;
    fragmentGroup.rotation.y = 0;

    fitFragment();

    /* ---------------------------------------------
       FIN DU CHARGEMENT
    --------------------------------------------- */

    setTimeout(() => {

      loading.classList.add("hidden");

    }, 700);

  }

  catch (error) {

    console.error(error);

    loading.innerHTML = `
      <div class="loading-symbol">⚠</div>
      <p>FRAGMENT INTROUVABLE</p>
    `;

  }

}

/* ---------------------------------------------------------
   ŒIL
--------------------------------------------------------- */

let eyeGroup;
let pupil;
let iris;

function createEye() {

  eyeGroup = new THREE.Group();

  /*
     Position approximative de l'œil sur
     l'illustration du fragment.
  */

  eyeGroup.position.set(
    0,
    0.62,
    0.075
  );

  fragmentGroup.add(eyeGroup);

  /* ---------------------------------------------
     IRIS
  --------------------------------------------- */

  const irisGeometry =
    new THREE.CircleGeometry(
      0.19,
      48
    );

  const irisMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x9a5b20,
      roughness: 0.35,
      metalness: 0.15
    });

  iris =
    new THREE.Mesh(
      irisGeometry,
      irisMaterial
    );

  iris.position.z = 0.02;

  eyeGroup.add(iris);

  /* ---------------------------------------------
     PUPILLE
  --------------------------------------------- */

  const pupilGeometry =
    new THREE.CircleGeometry(
      0.075,
      32
    );

  const pupilMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x050302
    });

  pupil =
    new THREE.Mesh(
      pupilGeometry,
      pupilMaterial
    );

  pupil.position.z = 0.035;

  eyeGroup.add(pupil);

  /* ---------------------------------------------
     REFLET
  --------------------------------------------- */

  const reflectionGeometry =
    new THREE.CircleGeometry(
      0.025,
      24
    );

  const reflectionMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffe6a0
    });

  const reflection =
    new THREE.Mesh(
      reflectionGeometry,
      reflectionMaterial
    );

  reflection.position.set(
    -0.035,
    0.045,
    0.05
  );

  eyeGroup.add(reflection);

}

/* ---------------------------------------------------------
   MOUVEMENT DE L'ŒIL
--------------------------------------------------------- */

let targetEyeX = 0;
let targetEyeY = 0;

function animateEye(time) {

  if (!pupil || !iris) return;

  const slowX =
    Math.sin(time * 0.0007) * 0.035;

  const slowY =
    Math.sin(time * 0.0009) * 0.018;

  pupil.position.x +=
    ((targetEyeX + slowX) - pupil.position.x) * 0.04;

  pupil.position.y +=
    ((targetEyeY + slowY) - pupil.position.y) * 0.04;

  iris.position.x +=
    ((targetEyeX * 0.35) - iris.position.x) * 0.035;

  iris.position.y +=
    ((targetEyeY * 0.35) - iris.position.y) * 0.035;

}

/* ---------------------------------------------------------
   INTERACTION SOURIS / DOIGT
--------------------------------------------------------- */

let pointerX = 0;
let pointerY = 0;

let targetRotationX = 0;
let targetRotationY = 0;

let currentRotationX = 0;
let currentRotationY = 0;

let zoom = 1;
let targetZoom = 1;

let dragging = false;

let lastX = 0;
let lastY = 0;

let pinchDistance = null;

/* ---------------------------------------------------------
   SOURIS
--------------------------------------------------------- */

renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    dragging = true;

    lastX = event.clientX;
    lastY = event.clientY;

  }
);

renderer.domElement.addEventListener(
  "pointermove",
  event => {

    pointerX =
      (event.clientX / window.innerWidth - 0.5) * 2;

    pointerY =
      (event.clientY / window.innerHeight - 0.5) * 2;

    targetEyeX =
      pointerX * 0.11;

    targetEyeY =
      -pointerY * 0.07;

    if (!dragging) return;

    const dx =
      event.clientX - lastX;

    const dy =
      event.clientY - lastY;

    targetRotationY += dx * 0.004;
    targetRotationX += dy * 0.004;

    targetRotationX =
      THREE.MathUtils.clamp(
        targetRotationX,
        -0.35,
        0.35
      );

    targetRotationY =
      THREE.MathUtils.clamp(
        targetRotationY,
        -0.45,
        0.45
      );

    lastX = event.clientX;
    lastY = event.clientY;

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

/* ---------------------------------------------------------
   TACTILE
--------------------------------------------------------- */

renderer.domElement.addEventListener(
  "touchstart",
  event => {

    if (event.touches.length === 2) {

      pinchDistance =
        getTouchDistance(event.touches);

    }

  },
  { passive: true }
);

renderer.domElement.addEventListener(
  "touchmove",
  event => {

    if (event.touches.length !== 2) return;

    const distance =
      getTouchDistance(event.touches);

    if (pinchDistance !== null) {

      const difference =
        distance - pinchDistance;

      targetZoom += difference * 0.003;

      targetZoom =
        THREE.MathUtils.clamp(
          targetZoom,
          0.75,
          1.45
        );

    }

    pinchDistance = distance;

  },
  { passive: true }
);

renderer.domElement.addEventListener(
  "touchend",
  () => {

    pinchDistance = null;

  },
  { passive: true }
);

/* ---------------------------------------------------------
   DISTANCE ENTRE DEUX DOIGTS
--------------------------------------------------------- */

function getTouchDistance(touches) {

  const dx =
    touches[0].clientX -
    touches[1].clientX;

  const dy =
    touches[0].clientY -
    touches[1].clientY;

  return Math.sqrt(
    dx * dx + dy * dy
  );

}

/* ---------------------------------------------------------
   ADAPTATION DE L'ÉCRAN
--------------------------------------------------------- */

function fitFragment() {

  if (!fragmentTexture) return;

  const image =
    fragmentTexture.image;

  const imageRatio =
    image.width / image.height;

  const screenRatio =
    window.innerWidth /
    window.innerHeight;

  if (screenRatio < imageRatio) {

    camera.position.z = 5.4;

  } else {

    camera.position.z = 4.7;

  }

}

/* ---------------------------------------------------------
   RESIZE
--------------------------------------------------------- */

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

    fitFragment();

  }
);

/* ---------------------------------------------------------
   ANIMATION
--------------------------------------------------------- */

const clock =
  new THREE.Clock();

function animate(time) {

  requestAnimationFrame(animate);

  const elapsed =
    clock.getElapsedTime();

  /* ---------------------------------------------
     Mouvements doux automatiques
  --------------------------------------------- */

  if (!dragging) {

    targetRotationY =
      Math.sin(elapsed * 0.35) * 0.045;

    targetRotationX =
      Math.sin(elapsed * 0.27) * 0.025;

  }

  /* ---------------------------------------------
     Lissage de la rotation
  --------------------------------------------- */

  currentRotationX +=
    (targetRotationX - currentRotationX) * 0.035;

  currentRotationY +=
    (targetRotationY - currentRotationY) * 0.035;

  fragmentGroup.rotation.x =
    currentRotationX;

  fragmentGroup.rotation.y =
    currentRotationY;

  /* ---------------------------------------------
     Zoom
  --------------------------------------------- */

  zoom +=
    (targetZoom - zoom) * 0.08;

  fragmentGroup.scale.set(
    zoom,
    zoom,
    zoom
  );

  /* ---------------------------------------------
     Petit flottement 3D
  --------------------------------------------- */

  fragmentGroup.position.y =
    Math.sin(elapsed * 0.65) * 0.025;

  /* ---------------------------------------------
     Animation de l'œil
  --------------------------------------------- */

  animateEye(time);

  renderer.render(
    scene,
    camera
  );

}

/* ---------------------------------------------------------
   DÉMARRAGE
--------------------------------------------------------- */

createFragment()
  .then(() => {

    animate();

  });
