import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const container=document.querySelector("#scene");
const loading=document.querySelector("#loading");
const main=document.querySelector("#main");
const bar=document.querySelector("#loaderBar");
const text=document.querySelector("#loadingText");
const button=document.querySelector("#enterButton");
let scene,camera,renderer,controls,clock,dust;

start();

async function start(){
 await loadingSequence();
 loading.remove(); main.classList.remove("hidden");
 createScene(); animate();
 button.onclick=()=>{button.textContent="Archives ouvertes";button.disabled=true};
}

function loadingSequence(){
 return new Promise(resolve=>{
  let p=0;
  const t=setInterval(()=>{
   p=Math.min(100,p+Math.random()*10+5); bar.style.width=p+"%";
   text.textContent=p<35?"Réveil des archives…":p<70?"Allumage du sanctuaire…":"Préparation du premier fragment…";
   if(p>=100){clearInterval(t);text.textContent="Les archives sont prêtes.";setTimeout(resolve,400)}
  },90);
 });
}

function createScene(){
 scene=new THREE.Scene();
 scene.background=new THREE.Color(0x120d08);
 scene.fog=new THREE.FogExp2(0x120d08,.055);
 camera=new THREE.PerspectiveCamera(45,container.clientWidth/container.clientHeight,.1,100);
 camera.position.set(0,1.8,7.5);
 renderer=new THREE.WebGLRenderer({antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 renderer.setSize(container.clientWidth,container.clientHeight);
 renderer.shadowMap.enabled=true;
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 container.appendChild(renderer.domElement);
 controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true; controls.enablePan=false;
 controls.minDistance=4.8;controls.maxDistance=10;
 controls.minPolarAngle=Math.PI*.34;controls.maxPolarAngle=Math.PI*.64;
 controls.target.set(0,1.35,0);
 clock=new THREE.Clock();
 scene.add(new THREE.HemisphereLight(0x6d7b92,0x1a0d06,1.5));
 const light=new THREE.PointLight(0xe4b96c,30,14,2);light.position.set(0,3.2,1.4);light.castShadow=true;scene.add(light);
 const side=new THREE.PointLight(0x7d91a8,12,12,2);side.position.set(-4,2,1);scene.add(side);
 buildTemple();
 buildDust();
 new ResizeObserver(resize).observe(container);
}

function buildTemple(){
 const mat=new THREE.MeshStandardMaterial({color:0x8c6b48,roughness:.78});
 const floor=new THREE.Mesh(new THREE.CylinderGeometry(4.8,5.2,.35,64),new THREE.MeshStandardMaterial({color:0x3a2617,roughness:.92}));
 floor.position.y=-1.15;floor.receiveShadow=true;scene.add(floor);
 const back=new THREE.Mesh(new THREE.BoxGeometry(5.8,4.8,.45),mat);back.position.set(0,1.2,-1.7);scene.add(back);
 const ped=new THREE.Mesh(new THREE.ConeGeometry(3.45,1.6,3),mat);ped.rotation.y=Math.PI/2;ped.position.set(0,4.15,-1.7);ped.scale.z=.65;scene.add(ped);
 [-2.2,-1.1,0,1.1,2.2].forEach(x=>{
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.31,3.5,20),mat);c.position.set(x,.65,-.85);c.castShadow=true;scene.add(c);
 });
 const altar=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.4,.75,32),new THREE.MeshStandardMaterial({color:0x5b3b22,roughness:.55,metalness:.18,emissive:0x4b2608,emissiveIntensity:.25}));
 altar.position.y=-.25;scene.add(altar);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.15,.035,12,64),new THREE.MeshBasicMaterial({color:0xd6b36a}));
 ring.position.y=.15;ring.rotation.x=Math.PI/2;scene.add(ring);
}

function buildDust(){
 const n=450,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3);
 for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*9;pos[i*3+1]=Math.random()*6-1;pos[i*3+2]=(Math.random()-.5)*7}
 geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
 dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0xd6b36a,size:.025,transparent:true,opacity:.55,depthWrite:false}));
 scene.add(dust);
}

function animate(){
 requestAnimationFrame(animate);const t=clock.getElapsedTime();
 controls.update();dust.rotation.y=t*.02;dust.position.y=Math.sin(t*.15)*.05;
 renderer.render(scene,camera);
}
function resize(){
 const w=container.clientWidth,h=container.clientHeight;
 camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);
}
