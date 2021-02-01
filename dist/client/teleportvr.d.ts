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
    private _enabled;
    private _gamePads;
    private _raycaster;
    private _vectorArray;
    constructor(scene: THREE.Scene, camera: THREE.Camera);
    add(id: number, model: THREE.Object3D, gamePad: Gamepad): void;
    get enabled(): {
        [id: number]: boolean;
    };
    set enabled(value: {
        [id: number]: boolean;
    });
    get gamePads(): {
        [id: number]: Gamepad;
    };
    set gamePads(value: {
        [id: number]: Gamepad;
    });
    get target(): THREE.Group;
    set target(value: THREE.Group);
    get curve(): THREE.Mesh;
    set curve(value: THREE.Mesh);
    useDefaultTargetHelper(use: boolean): void;
    useDefaultDirectionHelper(use: boolean): void;
    setMaxDistance(val: number): void;
    teleport(): void;
    update(elevationsMeshList?: THREE.Mesh[]): void;
}
