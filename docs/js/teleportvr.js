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

        var _target = new THREE.Object3D();
        _group.add(_target);

        var _curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(2, 0, -2)
        );

        var maxDistance = 20;

        return {
            add: function (o) {
                _group.add(o);
            },
            target: _target,
            curve: _curve,
            teleport: function (o) {
                _target.getWorldPosition(_group.position);
                _target.getWorldQuaternion(_group.quaternion);
            },
            update: function (o) {
                var v = new THREE.Vector3(0, 0, -1);
                v.applyQuaternion(o.quaternion);
                _target.position.set(v.x * maxDistance, 0, v.z * maxDistance);
                _curve.v0.copy(_target.position);
                _curve.v2.copy(o.position);
                _curve.v2.add(new THREE.Vector3().setFromMatrixPosition(o.standingMatrix));
                var midPoint = new THREE.Object3D();
                midPoint.position.copy(_curve.v2);
                midPoint.quaternion.copy(o.quaternion);
                midPoint.translateZ(-3);
                _curve.v1.copy(midPoint.position);
            }
        }
    })

    return TeleportVR;
})));