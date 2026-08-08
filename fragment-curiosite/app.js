     import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

/* =========================================================
   TEMPLE DES GARDIENS
   Fragment de la Curiosité
   Moteur 2,5D / 3D
   ========================================================= */

const container = document.getElementById("scene");

if (!container) {
  console.error("Erreur : élément #scene introuvable.");
  throw new Error("Element #scene introuvable");
}

/* ---------------------------------------------------------
   SCÈNE
--------------------------------------------------------- */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x080604);

/* ---------------------------------------------------------
   CAMÉRA
--------------------------------------------------------- */

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 7);

/* ---------------------------------------------------------
   RENDERER
--------------------------------------------------------- */

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

container.appendChild(renderer.domElement);

/* ---------------------------------------------------------
   CONTRÔLES TACTILES
--------------------------------------------------------- */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.enablePan = false;

controls.minDistance = 4.5;
controls.maxDistance = 9;

controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.75;

/* ---------------------------------------------------------
   LUMIÈRES
--------------------------------------------------------- */

const ambientLight = new THREE.AmbientLight(
  0xffd9a0,
  1.8
);

scene.add(ambientLight);

const mainLight = new THREE.PointLight(
  0xffa62b,
  3,
  15
);

mainLight.position.set(
  2,
  3,
  5
);

scene.add(mainLight);

const secondaryLight = new THREE.PointLight(
  0xff6b18,
  1.5,
  12
);

secondaryLight.position.set(
  -3,
  -2,
  3
);

scene.add(secondaryLight);

/* ---------------------------------------------------------
   GROUPE DU FRAGMENT
--------------------------------------------------------- */

const fragment = new THREE.Group();

scene.add(fragment);

/* ---------------------------------------------------------
   TEXTURE DU FRAGMENT
--------------------------------------------------------- */

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load(
  "assets/fragment-curiosite.png",
  () => {

    texture.colorSpace = THREE.SRGBColorSpace;

    console.log(
      "Fragment de la Curiosité chargé."
    );

    const loading = document.getElementById("loading");

    if (loading) {
      loading.classList.add("hidden");
    }
  },

  undefined,

  (error) => {

    console.error(
      "Impossible de charger fragment-curiosite.png",
      error
    );

    const loading = document.getElementById("loading");

    if (loading) {
      loading.textContent =
        "Impossible de charger le fragment.";
    }
  }
);

/* ---------------------------------------------------------
   PARCHEMIN 3D
--------------------------------------------------------- */

const parchmentGeometry =
  new THREE.BoxGeometry(
    5.8,
    7.2,
    0.16
  );

const parchmentMaterial =
  new THREE.MeshStandardMaterial({

    map: texture,

    roughness: 0.72,

    metalness: 0.08
  });

const parchment =
  new THREE.Mesh(
    parchmentGeometry,
    parchmentMaterial
  );

fragment.add(parchment);

/* ---------------------------------------------------------
   CADRE DORÉ
--------------------------------------------------------- */

const frameMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x9b5517,

    roughness: 0.35,

    metalness: 0.7
  });

const frameDepth = 0.22;

function createFrame(
  width,
  height,
  x,
  y
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      frameDepth
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      frameMaterial
    );

  mesh.position.set(
    x,
    y,
    0.12
  );

  fragment.add(mesh);

  return mesh;
}

/* cadre extérieur */

createFrame(
  6.0,
  0.14,
  0,
  3.53
);

createFrame(
  6.0,
  0.14,
  0,
  -3.53
);

createFrame(
  0.14,
  7.0,
  -2.93,
  0
);

createFrame(
  0.14,
  7.0,
  2.93,
  0
);

/* ---------------------------------------------------------
   HALO LUMINEUX
--------------------------------------------------------- */

const haloGeometry =
  new THREE.RingGeometry(
    2.0,
    2.08,
    96
  );

const haloMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xff9b25,

    transparent: true,

    opacity: 0.45,

    side: THREE.DoubleSide
  });

const halo =
  new THREE.Mesh(
    haloGeometry,
    haloMaterial
  );

halo.position.z = 0.25;

fragment.add(halo);

/* ---------------------------------------------------------
   LUMIÈRE DU FRAGMENT
--------------------------------------------------------- */

const fragmentLight =
  new THREE.PointLight(
    0xffa12a,
    1.8,
    5
  );

fragmentLight.position.set(
  0,
  0,
  1
);

fragment.add(fragmentLight);

/* ---------------------------------------------------------
   ANIMATION
--------------------------------------------------------- */

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const elapsed =
    clock.getElapsedTime();

  /*
   * Très légère respiration du fragment.
   */

  fragment.rotation.y =
    Math.sin(elapsed * 0.35) * 0.035;

  fragment.rotation.x =
    Math.sin(elapsed * 0.25) * 0.018;

  /*
   * Le halo respire doucement.
   */

  const haloScale =
    1 +
    Math.sin(elapsed * 1.4) * 0.025;

  halo.scale.set(
    haloScale,
    haloScale,
    haloScale
  );

  /*
   * Intensité lumineuse légèrement variable.
   */

  fragmentLight.intensity =
    1.6 +
    Math.sin(elapsed * 1.8) * 0.25;

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

/* ---------------------------------------------------------
   ADAPTATION À L'ÉCRAN
--------------------------------------------------------- */

function resize() {

  const width =
    window.innerWidth;

  const height =
    window.innerHeight;

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height
  );
}

window.addEventListener(
  "resize",
  resize
);

/* ---------------------------------------------------------
   DÉMARRAGE
--------------------------------------------------------- */

resize();

animate();
