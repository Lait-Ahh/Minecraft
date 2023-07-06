import * as THREE from 'three';

function limit(value, min, max) {
    if(value > max) value = max;
    if(value < min) value = min;
    return value;
}

export default class {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        window.addEventListener('keydown', (e) => this.keyPress(e));
        window.addEventListener('keyup', (e) => this.keyPress(e));
        window.addEventListener('mousemove', (e) => this.mouseMove(e));
        domElement.ownerDocument.addEventListener('pointerlockchange', () => this.onPointerLockChange());

        this.locked = false;

        this.pov = 'first';
        this.thirdCameraDistance = 2.5;

        this.moveFoward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveSneak = false;
        this.moveSprint = false;
        this.moveJump = false;

        this.horizontalMoveSpeedMultiplier = 1;
        this.verticalMoveSpeedMultiplier = 1;

        this.horizontalAngle = 0;
        this.vertialAngle = 0;

        this.horizontalAngleSpeedMultiplier = 1;
        this.verticalAngleSpeedMultiplier = 1;

        this.mouseMovementX = 0;
        this.mouseMovementY = 0

        this.mouseSensivity = 1;

    }
    lock() {
        this.domElement.requestPointerLock();
    }
    unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    }
    onPointerLockChange() {
        this.locked = this.domElement.ownerDocument.pointerLockElement === this.domElement;
    }
    mouseMove(e) {
        if(!this.locked) return;
        this.mouseMovementX = e.movementX;
        this.mouseMovementY = e.movementY;
        if(this.pov === 'first') {
            const euler = new THREE.Euler(0, 0, 0, 'YXZ');
            euler.setFromQuaternion(this.camera.quaternion);
            euler.y -= this.mouseMovementX * 0.002 * this.horizontalAngleSpeedMultiplier;
            euler.x -= this.mouseMovementY * 0.002 * this.verticalAngleSpeedMultiplier;
            euler.x = Math.max(Math.PI / 2 - Math.PI, Math.min(Math.PI / 2, euler.x));
            this.camera.quaternion.setFromEuler(euler);
        }
    }
    keyPress(e) {
        e.preventDefault();
        if(!this.locked) return;
        switch(e.code) {
            case 'KeyW':
                this.moveFoward = e.type === 'keyup' ? false : true;
            break;
            case 'KeyS':
                this.moveBackward = e.type === 'keyup' ? false : true;
            break;
            case 'KeyA':
                this.moveLeft = e.type === 'keyup' ? false : true;
            break;
            case 'KeyD':
                this.moveRight = e.type === 'keyup' ? false : true;
            break;
            case 'ShiftLeft':
                this.moveSneak = e.type === 'keyup' ? false : true;
            break;
            case 'ControlLeft':
                this.moveSprint = e.type === 'keyup' ? false : true;
            break;
            case 'Space':
                this.moveJump = e.type === 'keyup' ? false : true;
            break;
            case 'F5':
                switch(this.pov) {
                    case 'first':
                        this.pov = 'third';
                    break;
                    case 'third':
                        this.pov = 'third-inverted';
                    break;
                    case 'third-inverted':
                        this.pov = 'first';
                    break;
                }
            break;
        }
    }
    move(distance, direction) {
        if(!this.locked) return;
        const vector = new THREE.Vector3();
        vector.setFromMatrixColumn(this.camera.matrix, 0);
        if(['foward', 'backward'].includes(direction)) vector.crossVectors(this.camera.up, vector);
        this.camera.position.addScaledVector(vector, distance);
    }
    update(dt, bodyPosition) {
        if(this.moveFoward) this.move(0.01 * this.horizontalMoveSpeedMultiplier * dt * 100, 'foward')
        if(this.moveBackward) this.move(-0.01 * this.horizontalMoveSpeedMultiplier * dt * 100, 'backward');
        if(this.moveLeft) this.move(-0.01 * this.horizontalMoveSpeedMultiplier * dt * 100);
        if(this.moveRight) this.move(0.01 * this.horizontalMoveSpeedMultiplier * dt * 100);
        switch(this.pov) {
            case 'third':
                this.horizontalAngle -= this.mouseMovementX / 2 * Math.PI / 180;
                this.vertialAngle -= this.mouseMovementY / 2 * Math.PI / 180;
                this.vertialAngle = limit(this.vertialAngle, -90, 90);
                const x = (this.thirdCameraDistance * Math.sin(Math.PI * 2 * this.horizontalAngle / 360) * 100) / 100;
                const z = (this.thirdCameraDistance * Math.cos(Math.PI * 2 * this.horizontalAngle / 360) * 100) / 100;
                const y = (this.thirdCameraDistance * Math.tan(Math.PI * 2 * this.vertialAngle / 360) * 100) / 100;
                this.camera.position.set(bodyPosition.x + x, bodyPosition.y + y, playerBody.z + z);
                this.camera.lookAt(bodyPosition);
            break;
            case 'third-inverted':
                this.horizontalAngle -= (this.mouseMovementX / 2 * Math.PI / 180) + Math.PI;
                this.vertialAngle -= this.mouseMovementY / 2 * Math.PI / 180;
                this.vertialAngle = limit(this.vertialAngle, -90, 90);
                const TIx = (this.thirdCameraDistance * Math.sin(Math.PI * 2 * this.horizontalAngle / 360) * 100) / 100;
                const TIz = (this.thirdCameraDistance * Math.cos(Math.PI * 2 * this.horizontalAngle / 360) * 100) / 100;
                const TIy = (this.thirdCameraDistance * Math.tan(Math.PI * 2 * this.vertialAngle / 360) * 100) / 100;
                this.camera.position.set(bodyPosition.x + TIx, bodyPosition.y + TIy, playerBody.z + TIz);
                this.camera.lookAt(bodyPosition);
            break;
        }
    }
}