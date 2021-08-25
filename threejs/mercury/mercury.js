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

  const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("./mercury-surface.jpg"),
      bumpMap: new THREE.TextureLoader().load("./mercury-bump-map.jpg"),
      bumpScale: 0.05,
    })
  );

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 3, 5);

  scene.add(mercury);
  scene.add(ambientLight);
  scene.add(pointLight);

  camera.position.z = 2;

  function animate() {
    window.requestAnimationFrame(animate);
    mercury.rotation.y -= 0.0015;
    renderer.render(scene, camera);
  }
  animate();
} else {
  window.alert("WebGL is not available.");
}
