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

  const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader().load("./uranus-surface.jpeg"),
    })
  );

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.49, 1.5, 128),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
  );
  ring.rotation.x = 1.5;
  ring.rotation.y = 1;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 3, 5);

  scene.add(uranus);
  scene.add(ring);
  scene.add(ambientLight);
  scene.add(pointLight);

  camera.position.set(0, 0, 2);

  function animate() {
    window.requestAnimationFrame(animate);
    uranus.rotation.y -= 0.0015;
    ring.rotation.z += 0.001;
    renderer.render(scene, camera);
  }
  animate();
} else {
  window.alert("WebGL is not available.");
}
