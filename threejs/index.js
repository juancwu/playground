import * as THREE from "https://cdn.skypack.dev/three@0.131.3";
import { WEBGL } from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/WebGL.js";

if (WEBGL.isWebGLAvailable()) {
  // Create basic components
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  // Set renderer size and pixel ratio
  /**
   * Setting the pixel ratio helps rendering smoother lines.
   */
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Append renderer to body
  document.body.appendChild(renderer.domElement);

  // Create geomatry and material
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  // Create Mesh
  const mesh = new THREE.Mesh(geometry, material);

  // Add to Scene
  scene.add(mesh);

  // Position camera
  /**
   * By default, the camera is in the center as all other objects
   * so without adjusting the camera position, objects will not be visible.
   */
  camera.position.z = 5;

  // Add lighting to scene
  // White directional light at half intensity shining from the top.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);

  function animate() {
    /**
     * For more information visit
     * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    window.requestAnimationFrame(animate);

    // Render model
    renderer.render(scene, camera);

    /**
     * As the animation plays, we change the mesh's properties
     * to actually see a change.
     */
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }

  animate();
} else {
  alert("unsupported");
}
