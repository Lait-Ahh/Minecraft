class World {
    constructor(generator) {
        this.generator = generator;
        this.chunks = [];
    }
    generateChunk(cb) {
        const chunk = this.generator(cb, 0, 0);
        chunk.parent = this;
        chunk.draw();
        this.chunks.push(chunk);
    }
    getChunkByCoords(x, z) {
        const cpos = {
            x: Math.floor(x / 16),
            z: Math.floor(z / 16)
        }
        return this.chunks.find(chunk => chunk.pos === cpos);
    }
}

export default World;