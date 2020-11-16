import * as THREE from '/build/three.module.js';
export default class TeleportVR {
    private _group;
    private _target;
    private _curve;
    private _maxDistance;
    private _visible;
    private _activeController;
    private _activeControllerKey;
    private _controllers;
    private _gamePads;
    private _raycaster;
    private _vectorArray;
    constructor(scene: THREE.Scene, camera: THREE.Camera);
    add(id: number, model: THREE.Object3D, gamePad: Gamepad): void;
    gamePads(id: number): Gamepad;
    target(): THREE.Group;
    curve(): THREE.Mesh<THREE.Geometry | THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
    useDefaultTargetHelper(use: boolean): void;
    useDefaultDirectionHelper(use: boolean): void;
    setMaxDistance(val: number): void;
    teleport(): void;
    update(elevationsMeshList?: THREE.Mesh[]): void;
}
