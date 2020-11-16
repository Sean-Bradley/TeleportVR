import * as THREE from '/build/three.module.js';
export default class Explosion {
    private particleCount;
    private particles;
    constructor(color: THREE.Color, scene: THREE.Scene);
    explode(position: THREE.Vector3): void;
    update(): void;
}
