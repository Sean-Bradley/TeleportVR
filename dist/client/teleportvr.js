/**
 * @license
 * TeleportVR library and demos
 * Copyright 2018-2021 Sean Bradley https://sbcode.net
 * https://github.com/Sean-Bradley/TeleportVR/blob/master/LICENSE
 */
import * as THREE from 'three';
export default class TeleportVR {
    constructor(scene, camera) {
        this._group = new THREE.Group();
        this._target = new THREE.Group();
        this._curve = new THREE.Mesh();
        this._maxDistance = 10;
        this._visible = false;
        this._activeController = new THREE.Object3D();
        this._activeControllerKey = '';
        this._controllers = {};
        this._enabled = {};
        this._gamePads = {};
        this._raycaster = new THREE.Raycaster();
        this._group.add(camera);
        scene.add(this._group);
        this._group.add(this._target);
        this._vectorArray = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 3, -1), new THREE.Vector3(2, 0, -2));
        const _mesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.01, 8), new THREE.MeshBasicMaterial({
            color: 0x0044ff,
            wireframe: true,
        }));
        _mesh.name = 'helperTarget';
        this._target.add(_mesh);
        const _mesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 2), new THREE.MeshBasicMaterial({
            color: 0x0044ff,
            wireframe: true,
        }));
        _mesh2.translateZ(-1);
        _mesh2.name = 'helperDirection';
        this._target.add(_mesh2);
        this._target.visible = false;
        const _geometry = new THREE.TubeGeometry(this._vectorArray, 9, 0.1, 5, false);
        this._curve = new THREE.Mesh(_geometry, new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        }));
        this._curve.visible = false;
        this._group.add(this._curve);
        const direction = new THREE.Vector3(0, -1, 0);
        this._raycaster.ray.direction.copy(direction);
    }
    add(id, model, gamePad) {
        model.name = 'teleportVRController_' + id.toString();
        this._group.add(model);
        this._controllers[id] = model;
        this._gamePads[id] = gamePad;
        this._enabled[id] = true;
        //console.log("gamepads length = " + Object.keys(this._gamePads).length)
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
    }
    get gamePads() {
        return this._gamePads;
    }
    set gamePads(value) {
        this._gamePads = value;
    }
    get target() {
        return this._target;
    }
    set target(value) {
        this._target = value;
    }
    get curve() {
        return this._curve;
    }
    set curve(value) {
        this._curve = value;
    }
    useDefaultTargetHelper(use) {
        ;
        this._target.getObjectByName('helperTarget').visible = use;
    }
    useDefaultDirectionHelper(use) {
        ;
        this._target.getObjectByName('helperDirection').visible = use;
    }
    setMaxDistance(val) {
        this._maxDistance = val;
    }
    teleport() {
        this._visible = false;
        this._target.visible = false;
        this._curve.visible = false;
        this._target.getWorldPosition(this._group.position);
        this._target.getWorldQuaternion(this._group.quaternion);
    }
    update(elevationsMeshList) {
        if (Object.keys(this._gamePads).length > 0) {
            for (let key in Object.keys(this._gamePads)) {
                if (this._enabled[key]) {
                    const gp = this._gamePads[key];
                    if (gp.buttons[3].touched) {
                        //console.log("hapticActuators = " + gp.hapticActuators)
                        //console.log(gp.axes[0] + " " + gp.axes[1] + " " + gp.axes[2] + " " + gp.axes[3])
                        this._activeController = this._controllers[key];
                        this._activeControllerKey = key;
                        this._visible = true;
                        if (Math.abs(gp.axes[2]) + Math.abs(gp.axes[3]) > 0.25) {
                            this._target.rotation.y = Math.atan2(-gp.axes[2], -gp.axes[3]); //angle degrees
                        }
                        this._target.visible = true;
                        this._curve.visible = true;
                        break;
                    }
                    else {
                        if (this._activeControllerKey === key) {
                            this._activeControllerKey = '';
                            this.teleport();
                            this._target.rotation.y = 0;
                        }
                    }
                }
            }
        }
        if (this._visible) {
            const v = new THREE.Vector3(0, -1, 0);
            v.applyQuaternion(this._activeController.quaternion);
            this._target.position.set(v.x * this._maxDistance, 0, v.z * this._maxDistance);
            if (elevationsMeshList) {
                this._target.getWorldPosition(this._raycaster.ray.origin);
                this._raycaster.ray.origin.y += 10;
                var intersects = this._raycaster.intersectObjects(elevationsMeshList);
                if (intersects.length > 0) {
                    this._target.position.y = intersects[0].point.y - this._group.position.y;
                }
            }
            this._vectorArray.v0.copy(this._target.position);
            this._vectorArray.v2.copy(this._activeController.position);
            var midPoint = new THREE.Object3D();
            midPoint.position.copy(this._vectorArray.v2);
            midPoint.quaternion.copy(this._activeController.quaternion);
            midPoint.translateY(-3);
            this._vectorArray.v1.copy(midPoint.position);
            const t = new THREE.TubeGeometry(this._vectorArray, 9, 0.1, 5, false);
            this._curve.geometry.copy(t);
        }
    }
}
