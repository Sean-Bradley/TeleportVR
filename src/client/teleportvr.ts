/**
 * @license
 * TeleportVR library and demos
 * Copyright 2018-2021 Sean Bradley https://sbcode.net
 * https://github.com/Sean-Bradley/TeleportVR/blob/master/LICENSE
 */

import * as THREE from 'three'

export default class TeleportVR {
    private _group = new THREE.Group()
    private _target = new THREE.Group()
    private _curve = new THREE.Mesh()
    private _maxDistance = 10
    private _visible = false
    private _activeController = new THREE.Object3D()
    private _activeControllerKey = ''
    private _controllers: { [id: number]: THREE.Object3D } = {}
    private _enabled: { [id: number]: boolean } = {}
    private _gamePads: { [id: number]: Gamepad } = {}
    private _raycaster = new THREE.Raycaster()
    private _vectorArray: THREE.QuadraticBezierCurve3

    constructor(scene: THREE.Scene, camera: THREE.Camera) {
        this._group.add(camera)
        scene.add(this._group)

        this._group.add(this._target)

        this._vectorArray = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(2, 0, -2)
        )

        const _mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 0.01, 8),
            new THREE.MeshBasicMaterial({
                color: 0x0044ff,
                wireframe: true,
            })
        )
        _mesh.name = 'helperTarget'
        this._target.add(_mesh)

        const _mesh2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 2),
            new THREE.MeshBasicMaterial({
                color: 0x0044ff,
                wireframe: true,
            })
        )
        _mesh2.translateZ(-1)
        _mesh2.name = 'helperDirection'
        this._target.add(_mesh2)
        this._target.visible = false

        const _geometry = new THREE.TubeGeometry(this._vectorArray, 9, 0.1, 5, false)
        this._curve = new THREE.Mesh(
            _geometry,
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true,
            })
        )
        this._curve.visible = false
        this._group.add(this._curve)

        const direction = new THREE.Vector3(0, -1, 0)
        this._raycaster.ray.direction.copy(direction)
    }

    public add(id: number, model: THREE.Object3D, gamePad: Gamepad) {
        model.name = 'teleportVRController_' + id.toString()
        this._group.add(model)
        this._controllers[id] = model
        this._gamePads[id] = gamePad
        this._enabled[id] = true
        //console.log("gamepads length = " + Object.keys(this._gamePads).length)
    }

    public get enabled(): { [id: number]: boolean } {
        return this._enabled
    }
    public set enabled(value: { [id: number]: boolean }) {
        this._enabled = value
    }

    public get gamePads(): { [id: number]: Gamepad } {
        return this._gamePads
    }
    public set gamePads(value: { [id: number]: Gamepad }) {
        this._gamePads = value
    }

    public get target() {
        return this._target
    }
    public set target(value) {
        this._target = value
    }

    public get curve() {
        return this._curve
    }
    public set curve(value) {
        this._curve = value
    }

    public useDefaultTargetHelper(use: boolean) {
        ;(this._target.getObjectByName('helperTarget') as THREE.Mesh).visible = use
    }
    public useDefaultDirectionHelper(use: boolean) {
        ;(this._target.getObjectByName('helperDirection') as THREE.Mesh).visible = use
    }

    public setMaxDistance(val: number) {
        this._maxDistance = val
    }

    public teleport() {
        this._visible = false
        this._target.visible = false
        this._curve.visible = false
        this._target.getWorldPosition(this._group.position)
        this._target.getWorldQuaternion(this._group.quaternion)
    }

    public update(elevationsMeshList?: THREE.Mesh[]) {
        if (Object.keys(this._gamePads).length > 0) {
            for (let key in Object.keys(this._gamePads)) {
                if (this._enabled[key]) {
                    const gp = this._gamePads[key]
                    if (gp.buttons[3].touched) {
                        //console.log("hapticActuators = " + gp.hapticActuators)
                        //console.log(gp.axes[0] + " " + gp.axes[1] + " " + gp.axes[2] + " " + gp.axes[3])
                        this._activeController = this._controllers[key]
                        this._activeControllerKey = key
                        this._visible = true
                        if (Math.abs(gp.axes[2]) + Math.abs(gp.axes[3]) > 0.25) {
                            this._target.rotation.y = Math.atan2(-gp.axes[2], -gp.axes[3]) //angle degrees
                        }
                        this._target.visible = true
                        this._curve.visible = true
                        break
                    } else {
                        if (this._activeControllerKey === key) {
                            this._activeControllerKey = ''
                            this.teleport()
                            this._target.rotation.y = 0
                        }
                    }
                }
            }
        }

        if (this._visible) {
            const v = new THREE.Vector3(0, -1, 0)
            v.applyQuaternion(this._activeController.quaternion)
            this._target.position.set(v.x * this._maxDistance, 0, v.z * this._maxDistance)

            if (elevationsMeshList) {
                this._target.getWorldPosition(this._raycaster.ray.origin)
                this._raycaster.ray.origin.y += 10
                var intersects = this._raycaster.intersectObjects(elevationsMeshList)
                if (intersects.length > 0) {
                    this._target.position.y = intersects[0].point.y - this._group.position.y
                }
            }

            this._vectorArray.v0.copy(this._target.position)
            this._vectorArray.v2.copy(this._activeController.position)
            var midPoint = new THREE.Object3D()
            midPoint.position.copy(this._vectorArray.v2)
            midPoint.quaternion.copy(this._activeController.quaternion)
            midPoint.translateY(-3)
            this._vectorArray.v1.copy(midPoint.position)

            const t = new THREE.TubeGeometry(
                this._vectorArray,
                9,
                0.1,
                5,
                false
            ) as THREE.BufferGeometry
            ;(this._curve.geometry as THREE.BufferGeometry).copy(t)
        }
    }
}
