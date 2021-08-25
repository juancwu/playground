import * as THREE from "https://cdn.skypack.dev/three@0.131.3";
import { WEBGL } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/WebGL.js";

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("./sun-surface.jpeg"),
    })
  );

  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(0, 0, 5);

  scene.add(sun);
  // scene.add(ambientLight);
  scene.add(pointLight);

  camera.position.z = 2;

  function animate() {
    window.requestAnimationFrame(animate);
    sun.rotation.y -= 0.0015;
    renderer.render(scene, camera);
  }
  animate();
} else {
  window.alert("WebGL is not available.");
}
