import * as THREE from 'three'
import StatsVR from 'statsvr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import TeleportVR from './teleportvr'
import Explosion from './explosion'

const bullets: THREE.Mesh[] = []
let bulletCounter = 0
const maxBullets = 10
const collidableMeshList: THREE.Mesh[] = []
const elevationsMeshList: THREE.Mesh[] = []

const scene: THREE.Scene = new THREE.Scene()

const explosions = [
    new Explosion(new THREE.Color(0xff0000), scene),
    new Explosion(new THREE.Color(0x00ff00), scene),
    new Explosion(new THREE.Color(0x0000ff), scene),
]
let explosionCounter = 0

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
collidableMeshList.push(floor)
elevationsMeshList.push(floor)

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
collidableMeshList.push(cube1)
elevationsMeshList.push(cube1)

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
collidableMeshList.push(cube2)
elevationsMeshList.push(cube2)

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
collidableMeshList.push(cube3)
elevationsMeshList.push(cube3)

for (let i = 0; i < maxBullets; i++) {
    const b = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1, 5),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        })
    )
    b.rotation.z = Math.PI / -2
    b.userData.lifeTime = 0
    bullets.push(b)
    collidableMeshList.push(b)
    b.visible = false
    scene.add(b)
}

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

controllerGrip0.addEventListener('selectstart', () => {
    if (
        (teleportVR.gamePads[0] as any).hapticActuators &&
        (teleportVR.gamePads[0] as any).hapticActuators.length > 0
    ) {
        ;(teleportVR.gamePads[0] as any).hapticActuators[0].pulse(1.0, 5)
    }
    bullets[bulletCounter].visible = false
    controllerGrip0.getWorldPosition(bullets[bulletCounter].position)
    controllerGrip0.getWorldQuaternion(bullets[bulletCounter].quaternion)
    bullets[bulletCounter].userData.lifeTime = 0
    bullets[bulletCounter].visible = true
    bulletCounter += 1
    if (bulletCounter >= maxBullets) {
        bulletCounter = 0
    }

    controllerGrip0.children[0].translateY(0.15)
    setTimeout(() => {
        controllerGrip0.children[0].translateY(-0.15)
    }, 100)
})

controllerGrip1.addEventListener('selectstart', () => {
    if (
        (teleportVR.gamePads[1] as any).hapticActuators &&
        (teleportVR.gamePads[1] as any).hapticActuators.length > 0
    ) {
        ;(teleportVR.gamePads[1] as any).hapticActuators[0].pulse(1.0, 5)
    }
    bullets[bulletCounter].visible = false
    controllerGrip1.getWorldPosition(bullets[bulletCounter].position)
    controllerGrip1.getWorldQuaternion(bullets[bulletCounter].quaternion)
    bullets[bulletCounter].userData.lifeTime = 0
    bullets[bulletCounter].visible = true
    bulletCounter += 1
    if (bulletCounter >= maxBullets) {
        bulletCounter = 0
    }

    controllerGrip1.children[0].translateY(0.15)
    setTimeout(() => {
        controllerGrip1.children[0].translateY(-0.15)
    }, 100)
})

const statsVR = new StatsVR(scene, camera)
statsVR.setX(0)
statsVR.setY(0)
statsVR.setZ(-2)

const clock: THREE.Clock = new THREE.Clock()

function render() {
    statsVR.update()

    teleportVR.update(elevationsMeshList)

    const delta = clock.getDelta()

    bullets.forEach((b) => {
        if (b.visible) {
            b.userData.lifeTime += delta
            if (b.userData.lifeTime < 5) {
                b.translateY(-delta * 50)
                if (b.userData.lifeTime > 0.025) {
                    let collisionDetected = false
                    let collisionPoint = new THREE.Vector3()
                    const positions = b.geometry.attributes.position.array
                    for (let i = 0; i < positions.length; i += 3) {
                        const localVertex = new THREE.Vector3(
                            positions[i],
                            positions[i + 1],
                            positions[i + 2]
                        )
                        const globalVertex = localVertex.applyMatrix4(b.matrixWorld)
                        const bulletPosition = new THREE.Vector3()
                        b.getWorldPosition(bulletPosition)
                        const directionVector = globalVertex.sub(bulletPosition)

                        const ray = new THREE.Raycaster(
                            bulletPosition,
                            directionVector.clone().normalize()
                        )
                        const collisionResults = ray.intersectObjects(collidableMeshList)

                        if (
                            collisionResults.length > 0 &&
                            collisionResults[0].distance < directionVector.length()
                        ) {
                            collisionDetected = true
                            b.visible = false
                            collisionPoint = collisionResults[0].point
                            break
                        }
                    }
                    if (collisionDetected) {
                        explosions[explosionCounter].explode(collisionPoint)
                        explosionCounter++
                        if (explosionCounter >= explosions.length) {
                            explosionCounter = 0
                        }
                    }
                }
            } else {
                b.visible = false
            }
        }
    })
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update()
    }

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(render)
