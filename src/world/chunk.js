import createFace from '../functions/createFace.js';
import transparentBlocks from '../../json/transparents_blocks.json' assert { type: 'json' }

class Chunk {
    constructor(scene, x, z) {
        this.pos = {
            x: x,
            z: z
        }
        this.raw = '';
        this.sceneAdd = scene;
        this.parent;
    }
    draw() {
        const blocks = this.readChunk();
        for(let i = blocks.length - 1; i !== -1; i--) {
            const { x, y, z } = this.getBlockCoordsByPos(i);
            this.drawMesh(x, y, z);
        }
    }
    getAdjacentBlockByPos(pos, facing) {
        let { x, y, z } = this.getBlockCoordsByPos(pos);
        switch(facing) {
            case 'top':
                y += 1;
            break;
            case 'bottom':
                y -= 1;
            break;
            case 'north':
                z += 1;
            break;
            case 'south':
                z -= 1;
            break;
            case 'east':
                x -= 1;
            break;
            case 'west':
                x += 1;
            break;
        }
        if((x || y || z) < 0 || (x || y || z) > 15) {
            const chunk = this.parent.getChunkByCoords(x, z);
            if(chunk) {
                return chunk.getBlockCoordsByPos(x, y, z);
            } else {
                return '-1';
            }
        } else {
            return this.getBlocksPosByCoords(x, y, z);
        }
    }
    getBlocksPosByCoords(x, y, z) {
        var pos = 0;
        pos += y * 256;
        pos += x * 16;
        pos += z;
        return pos;
    }
    getBlockCoordsByPos(pos) {
        const layer = pos % 256;
        const coords = {
            x: Math.floor(layer / 16),
            y: Math.floor(pos / 256),
            z: layer % 16
        }
        return coords;
    }
    drawMesh(x, y, z) {
        ['top', 'bottom', 'north', 'south', 'east', 'west'].forEach(facing => {
            const bpos = this.getBlocksPosByCoords(x, y, z);
            const block = this.getAdjacentBlockByPos(bpos, facing);
            if(!transparentBlocks.includes(block)) {
                const blockId = this.readChunkBlock(bpos);
                const face = createFace('top', this.pos.x * 16 + x, y, this.pos.z * 16 + z, blockId);
                face.userData = {
                    chunk: this.pos
                }
                this.sceneAdd(face);
            }
        });
    }
    readChunkBlock(i) {
        const blocks = this.raw.split(';').filter(block => !(typeof block === 'undefined'));
        return blocks[i];
    }
    readChunk() {
        const blocks = this.raw.split(';').filter(block => !(typeof block === 'undefined'));
        return blocks;
    }
}

export { Chunk }