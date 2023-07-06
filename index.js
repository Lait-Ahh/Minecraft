import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonUtils from './modules/cannon-utils.js';
import CannonDebugRenderer from './modules/cannon-renderer.js';
import Controls from './modules/controls.js';
import config from './config.json' assert { type: 'json' }

const clock = new THREE.Clock();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(config.fov, window.innerWidth / window.innerHeight, 0.1, config.renderDistance * 16);

const renderer = new THREE.WebGLRenderer({ antialias: config.antialias });
document.body.appendChild(renderer.domElement);

const controls = new Controls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update(clock.getDelta(), new THREE.Vector3(0, 0, 0));
}

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.onresize();
animate();

window.onclick = () => controls.lock();