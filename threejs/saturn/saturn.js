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

  const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader().load("./saturn-surface.jpeg"),
    })
  );

  const ringGeometry = new THREE.RingGeometry(1, 1.5, 64);
  const pos = ringGeometry.attributes.position;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    ringGeometry.attributes.uv.setXY(i, v3.length() < 1.35 ? 0 : 1, 1);
  }
  const ring = new THREE.Mesh(
    ringGeometry,
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./saturn-ring.png"),
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = 1.5;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 3, 5);

  scene.add(saturn);
  scene.add(ring);
  scene.add(ambientLight);
  scene.add(pointLight);

  camera.position.set(0, 0, 2);

  function animate() {
    window.requestAnimationFrame(animate);
    saturn.rotation.y -= 0.0015;
    ring.rotation.z += 0.001;
    renderer.render(scene, camera);
  }
  animate();
} else {
  window.alert("WebGL is not available.");
}
