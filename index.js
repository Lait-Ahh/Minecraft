import * as THREE from './src/three.module.js';
//import WebGPU from './three.js-master/three.js-master/examples/jsm/capabilities/WebGPU.js';
//import WebGPURenderer from './three.js-master/three.js-master/examples/jsm/renderers/webgpu/WebGPURenderer.js';

import loadTextures from './src/functions/loadTextures.js';
import FlatGenerator from './src/generators/flat.js';
import World from './src/world/world.js'

import textures from './json/textures.json' assert { type: 'json' }

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-10, 10, -10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: 4
});//(WebGPU.isAvailable() ? WebGPURenderer : THREE.WebGLRenderer)();
const resize = window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
resize();
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

const textures = loadTextures(texturesToLoad);

const world = new World(FlatGenerator);

world.generateChunk(mesh => scene.add(mesh));

console.log(scene, world);