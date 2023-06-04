import * as THREE from '../three.module.js';

const loader = new THREE.TextureLoader();

function loadTextures(array) {
    const textures = {}
    array.forEach(texture => {
        textures[texture.name] = loader.load(texture.url);
    });
    return textures;
}

export default loadTextures;