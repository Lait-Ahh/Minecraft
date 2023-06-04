import * as THREE from '../three.module.js';
import blocks from '../../json/blocks.json' assert { type: 'json' }

function createFace(facing, x, y, z, id) {
    
    blocks[id]

    

    const geometrry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color : 0xFFFFFF, wireframe: true });
    const face = new THREE.Mesh(geometrry, material);
    face.position.set(x, y, z);
    switch(facing) {
        case 'top':
            face.rotation.x = Math.PI/2;
        break;
        case 'bottom':
            face.rotation.x = -Math.PI/2
            face.position.y -= 1;
        break;
        case 'north':
            face.position.y -= 0.5;
            face.position.z += 0.5;
        break;
        case 'south':
            face.position.y -= 0.5;
            face.position.z -= 0.5;
        break;
        case 'east':
            face.rotation.y = Math.PI/2;
            face.position.y -= 0.5;
            face.position.x -= 0.5;
        break;
        case 'west':
            face.rotation.y = -Math.PI/2;
            face.position.y -= 0.5;
            face.position.x += 0.5;
        break;
    }
    return face;
}

export default createFace;