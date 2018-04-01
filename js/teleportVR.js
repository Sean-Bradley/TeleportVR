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
            new THREE.Vector3(-1, 0, -2),
            new THREE.Vector3(0, 3, 0),
            new THREE.Vector3(1, 0, -2)
        );

        return {
            add: function (o) {
                _group.add(o);
            },
            //position: _group.position,
            //quaternion: _group.quaternion,
            target: _target,
            curve: _curve,
            teleport: function (o) {
                _target.getWorldPosition(_group.position);
                _target.getWorldQuaternion(_group.quaternion);
            },
            update: function (o, v) {
                _target.position.copy(v);
                _target.getWorldPosition(_curve.v0);//end point                
                o.getWorldPosition(_curve.v2);//startpoint                
                var midPoint = new THREE.Object3D();//midpoint
                o.getWorldPosition(midPoint.position);
                o.getWorldQuaternion(midPoint.quaternion);
                midPoint.translateY(3);
                _curve.v1 = midPoint.position;

                //_curve.v2.copy(_target.worldToLocal(o.getWorldPosition()));
            }
        }
    })

    return TeleportVR;
})));