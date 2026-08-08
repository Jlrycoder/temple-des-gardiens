import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

/* ============================================================
   TEMPLE DES GARDIENS
   Fragment de la Curiosité
   Moteur 3D / 2,5D
   ============================================================ */

const sceneContainer = document.getElementById("scene");
const loading = document.getElementById("loading");

if (!sceneContainer) {
  throw new Error("Élément #scene introuvable.");
}

/* ------------------------------------------------------------
   SCÈNE
   ------------------------------------------------------------ */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090604);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 7);

/* ------------------------------------------------------------
   RENDERER
   ------------------------------------------------------------ */

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

/* ------------------------------------------------------------
   LUMIÈRES
   ------------------------------------------------------------ */

const ambientLight = new THREE.AmbientLight(
  0xffd9a0,
  1.5
);

scene.add(ambientLight);

const keyLight = new THREE.PointLight(
  0xffa52c,
  3,
  20
);

keyLight.position.set(
  2,
  3,
  5
);

scene.add(keyLight);

const fillLight = new THREE.PointLight(
  0x6b421b,
  2,
  15
);

fillLight.position.set(
  -3,
  -2,
  3
);

scene.add(fillLight);

/* ------------------------------------------------------------
   GROUPE PRINCIPAL
   ------------------------------------------------------------ */

const fragment = new THREE.Group();

scene.add(fragment);

/* ------------------------------------------------------------
   FOND / PLAQUE
   ------------------------------------------------------------ */

const plaqueGeometry =
  new THREE.PlaneGeometry(6.5, 8);

const plaqueMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x8a5a2b,
    roughness: 0.85,
    metalness: 0.15
  });

const plaque =
  new THREE.Mesh(
    plaqueGeometry,
    plaqueMaterial
  );

plaque.position.z = -0.35;

fragment.add(plaque);

/* ------------------------------------------------------------
   CADRE
   ------------------------------------------------------------ */

function createRing(
  radius,
  tube,
  color,
  z
) {
  const geometry =
    new THREE.TorusGeometry(
      radius,
      tube,
      24,
      96
    );

  const material =
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.15
    });

  const ring =
    new THREE.Mesh(
      geometry,
      material
    );

  ring.position.z = z;

  fragment.add(ring);

  return ring;
}

const outerRing =
  createRing(
    2.65,
    0.075,
    0xb56a18,
    0.05
  );

const innerRing =
  createRing(
    2.05,
    0.055,
    0xc47a22,
    0.08
  );

/* ------------------------------------------------------------
   ŒIL
   ------------------------------------------------------------ */

const eyeGroup =
  new THREE.Group();

eyeGroup.position.set(
  0,
  0.25,
  0.35
);

fragment.add(eyeGroup);

/* Sclère */

const eyeGeometry =
  new THREE.SphereGeometry(
    1.15,
    48,
    32
  );

eyeGeometry.scale(
  1.45,
  0.62,
  0.35
);

const eyeMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xc28a38,
    roughness: 0.45,
    metalness: 0.1
  });

const eye =
  new THREE.Mesh(
    eyeGeometry,
    eyeMaterial
  );

eyeGroup.add(eye);

/* Iris */

const irisGeometry =
  new THREE.CircleGeometry(
    0.48,
    64
  );

const irisMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x6f461b,
    roughness: 0.3,
    metalness: 0.15
  });

const iris =
  new THREE.Mesh(
    irisGeometry,
    irisMaterial
  );

iris.position.z = 0.42;

eyeGroup.add(iris);

/* Pupille */

const pupilGeometry =
  new THREE.CircleGeometry(
    0.25,
    64
  );

const pupilMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x050302,
    roughness: 0.2,
    metalness: 0.3
  });

const pupil =
  new THREE.Mesh(
    pupilGeometry,
    pupilMaterial
  );

pupil.position.z = 0.44;

eyeGroup.add(pupil);

/* Reflet */

const reflectionGeometry =
  new THREE.CircleGeometry(
    0.06,
    32
  );

const reflectionMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffe6a3
  });

const reflection =
  new THREE.Mesh(
    reflectionGeometry,
    reflectionMaterial
  );

reflection.position.set(
  -0.12,
  0.13,
  0.47
);

eyeGroup.add(reflection);

/* ------------------------------------------------------------
   RAYONS DE LA CURIOSITÉ
   ------------------------------------------------------------ */

const rays =
  new THREE.Group();

rays.position.z = 0.02;

fragment.add(rays);

const rayMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xa97532,
    transparent: true,
    opacity: 0.65
  });

for (
  let i = 0;
  i < 32;
  i++
) {

  const angle =
    (i / 32) *
    Math.PI *
    2;

  const geometry =
    new THREE.BoxGeometry(
      0.035,
      0.75,
      0.02
    );

  const ray =
    new THREE.Mesh(
      geometry,
      rayMaterial
    );

  const radius = 1.65;

  ray.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    0
  );

  ray.rotation.z =
    angle - Math.PI / 2;

  rays.add(ray);
}

/* ------------------------------------------------------------
   PARALLAXE
   ------------------------------------------------------------ */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

function updatePointer(
  x,
  y
) {

  targetX =
    (x / window.innerWidth - 0.5)
    * 0.35;

  targetY =
    (y / window.innerHeight - 0.5)
    * 0.25;
}

window.addEventListener(
  "pointermove",
  (event) => {

    updatePointer(
      event.clientX,
      event.clientY
    );

  },
  { passive: true }
);

/* ------------------------------------------------------------
   TOUCH MOBILE
   ------------------------------------------------------------ */

window.addEventListener(
  "touchmove",
  (event) => {

    if (
      !event.touches ||
      !event.touches[0]
    ) return;

    updatePointer(
      event.touches[0].clientX,
      event.touches[0].clientY
    );

  },
  { passive: true }
);

/* ------------------------------------------------------------
   MOUVEMENT AUTOMATIQUE DE L'ŒIL
   ------------------------------------------------------------ */

let eyeTargetX = 0;
let eyeTargetY = 0;

let eyeCurrentX = 0;
let eyeCurrentY = 0;

function moveEyeRandomly() {

  eyeTargetX =
    (Math.random() - 0.5)
    * 0.55;

  eyeTargetY =
    (Math.random() - 0.5)
    * 0.25;

  const delay =
    1200 +
    Math.random() * 1800;

  setTimeout(
    moveEyeRandomly,
    delay
  );
}

moveEyeRandomly();

/* ------------------------------------------------------------
   ANIMATION
   ------------------------------------------------------------ */

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

  const time =
    clock.getElapsedTime();

  /* Parallaxe générale */

  currentX +=
    (targetX - currentX)
    * 0.035;

  currentY +=
    (targetY - currentY)
    * 0.035;

  fragment.rotation.y =
    currentX;

  fragment.rotation.x =
    -currentY;

  /* Respiration */

  const breathing =
    Math.sin(time * 0.8)
    * 0.015;

  eyeGroup.scale.x =
    1 + breathing;

  eyeGroup.scale.y =
    1 - breathing;

  /* Mouvement de l'œil */

  eyeCurrentX +=
    (eyeTargetX - eyeCurrentX)
    * 0.025;

  eyeCurrentY +=
    (eyeTargetY - eyeCurrentY)
    * 0.025;

  iris.position.x =
    eyeCurrentX;

  iris.position.y =
    eyeCurrentY;

  pupil.position.x =
    eyeCurrentX;

  pupil.position.y =
    eyeCurrentY;

  reflection.position.x =
    eyeCurrentX - 0.12;

  reflection.position.y =
    eyeCurrentY + 0.13;

  /* Rotation très légère du cadre */

  outerRing.rotation.z =
    time * 0.015;

  innerRing.rotation.z =
    -time * 0.01;

  /* Lumière vivante */

  keyLight.intensity =
    2.6 +
    Math.sin(time * 1.5)
    * 0.4;

  renderer.render(
    scene,
    camera
  );
}

/* ------------------------------------------------------------
   RESPONSIVE
   ------------------------------------------------------------ */

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

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);

/* ------------------------------------------------------------
   FIN DU CHARGEMENT
   ------------------------------------------------------------ */

setTimeout(
  () => {

    if (loading) {
      loading.classList.add(
        "hidden"
      );
    }

  },
  1200
);

animate();
