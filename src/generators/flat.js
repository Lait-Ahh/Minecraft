import { Chunk } from '../world/chunk.js';

function createChunk(scene, x, y) {
    const chunk = new Chunk(scene, x, y);
    for(let i = 0; i < 256; i++) {
        chunk.raw += '0;';
    }
    for(let i = 0; i < 768; i++) {
        chunk.raw += '2;';
    }
    for(let i = 0; i < 256; i++) {
        chunk.raw += '3;';
    }
    return chunk;
}

export default createChunk;