import * as THREE from 'three'
import StatsVR from 'statsvr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import TeleportVR from './teleportvr'

const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 1.6, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true

document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0x008800,
        wireframe: true,
    })
)
floor.rotation.x = Math.PI / -2
floor.position.y = -0.001
scene.add(floor)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff8800,
        wireframe: true,
    })
)
cube1.position.x = -10
cube1.position.y = 1
cube1.position.z = -10
scene.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 2, 4, 8),
    new THREE.MeshBasicMaterial({
        color: 0x88ff00,
        wireframe: true,
    })
)
cube2.position.x = 10
cube2.position.y = 2
cube2.position.z = -10
scene.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 4, 1),
    new THREE.MeshBasicMaterial({
        color: 0x88ff00,
        wireframe: true,
    })
)
cube3.position.x = -10
cube3.position.y = 2
cube3.position.z = 10
scene.add(cube3)

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const teleportVR = new TeleportVR(scene, camera)

const lefthand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16, 1, true),
    new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true,
    })
)

const controllerGrip0 = renderer.xr.getControllerGrip(0)
controllerGrip0.addEventListener('connected', (e: any) => {
    controllerGrip0.add(lefthand)
    teleportVR.add(0, controllerGrip0, e.data.gamepad)
})

const righthand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16, 1, true),
    new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true,
    })
)
const controllerGrip1 = renderer.xr.getControllerGrip(1)
controllerGrip1.addEventListener('connected', (e: any) => {
    controllerGrip1.add(righthand)
    teleportVR.add(1, controllerGrip1, e.data.gamepad)
})

const statsVR = new StatsVR(scene, camera)
statsVR.setX(0)
statsVR.setY(0)
statsVR.setZ(-2)

function render() {
    statsVR.update()

    teleportVR.update()

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(render)
