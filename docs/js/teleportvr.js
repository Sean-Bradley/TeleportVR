(function (global, factory) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.TeleportVR = factory());

}(this, (function () {
    'use strict';

    /**
     * @author Sean Bradley /
     * https://www.youtube.com/user/seanwasere
     * https://github.com/Sean-Bradley
     * https://seanwasere.com/
     */

    var TeleportVR = (function (scene, camera) {
        var _group = new THREE.Group();
        _group.add(camera);
        scene.add(_group);

        var _target = new THREE.Group();
        _group.add(_target);

        var _vectorArray = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(2, 0, -2)
        );

        var _maxDistance = 10;

        var _mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, .01, 8),
            new THREE.MeshBasicMaterial({
                color: 0x0044ff,
                wireframe: true
            })
        );
        _mesh.name = "helper";
        _target.add(_mesh);

        _mesh = new THREE.Mesh(
            new THREE.CubeGeometry(.1, .1, 2),
            new THREE.MeshBasicMaterial({
                color: 0x0044ff,
                wireframe: true
            })
        );
        _mesh.translateZ(-1);
        _mesh.name = "helperDirection";
        _target.add(_mesh);
        _target.visible = false;

        var _geometry = new THREE.TubeBufferGeometry(_vectorArray, 9, .1, 3, false);
        var _curve = new THREE.Mesh(_geometry, new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        }));
        _curve.visible = false;
        _group.add(_curve);

        var raycaster = new THREE.Raycaster();
        var direction = new THREE.Vector3(0, -1, 0);
        raycaster.ray.direction.copy(direction);//.applyEuler( rotation );
        //var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        var _active = false;
        var _activeController = {};

        return {
            add: function (o) {
                _group.add(o);
            },
            target: _target,
            curve: _curve,
            removeTargetHelpers: function (o) {
                _target.remove(scene.getObjectByName("helper"));
                _target.remove(scene.getObjectByName("helperDirection"));
            },
            setMaxDistance: function (val) {
                _maxDistance = val
            },
            teleport: function (o) {
                _active = false;
                _target.visible = false;
                _curve.visible = false;
                _target.getWorldPosition(_group.position);
                _target.getWorldQuaternion(_group.quaternion);
            },
            update: function (collidableMeshList) {
                if (_active) {
                    var v = new THREE.Vector3(0, 0, -1);
                    v.applyQuaternion(_activeController.quaternion);

                    _target.position.set(v.x * _maxDistance, 0, v.z * _maxDistance);

                    //if using raycaster then adjust height of target
                    if (collidableMeshList) {
                        _target.getWorldPosition(raycaster.ray.origin);
                        raycaster.ray.origin.y += 10;
                        var intersects = raycaster.intersectObjects(collidableMeshList);
                        if (intersects.length > 0) {
                            _target.position.y = intersects[0].point.y - _group.position.y;
                            //console.dir(intersects[0].face.normal);
                        }
                    }

                    _vectorArray.v0.copy(_target.position);
                    _vectorArray.v2.copy(_activeController.position);
                    _vectorArray.v2.add(new THREE.Vector3().setFromMatrixPosition(_activeController.standingMatrix));
                    var midPoint = new THREE.Object3D();
                    midPoint.position.copy(_vectorArray.v2);
                    midPoint.quaternion.copy(_activeController.quaternion);
                    midPoint.translateZ(-3);
                    _vectorArray.v1.copy(midPoint.position);

                    _curve.geometry.copy(new THREE.TubeBufferGeometry(_vectorArray, 9, .05, 3, false));
                    _curve.geometry.needsUpdate = true;
                }
            },
            show: function (o) {
                _activeController = o;
                _active = true;
                _target.rotation.y = 0;
                _target.visible = true;
                _curve.visible = true;
            },
            hide: function () {
                _active = false;
                _target.visible = false;
                _curve.visible = false;
            }
        }
    })

    return TeleportVR;
})));