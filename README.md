# TeleportVR

Teleport module for WebVR and THREE.js projects.

You can download the project and view the examples.

```bash
git clone https://github.com/Sean-Bradley/TeleportVR.git
cd TeleportVR
npm install
npm run dev
```

Visit http://127.0.0.1:3000/

## How to import TeleportVR

You can copy the generated `./dist/client/teleportvr.js` directly into your own project folder and import as a module.

```html
<script type="module" src="./teleportvr.js"></script>
```

or as relative ES6 import

```javascript
import TeleportVR from './teleportvr.js'
```

or if using a bundler such as webpack or rollup

```javascript
import TeleportVR from 'teleportvr'
```

> Note
If using a bundler, you will need to update the **import** reference in your copy of `buttonvr.js`. By default it is set to ```import * as THREE from '/build/three.module.js'```. Try setting it to ```import * as THREE from 'three'```

## How to Instantiate And Use

After creating your `THREE.Scene` and `THREE.Camera`, create a new **TeleportVR** object.

```javascript
const teleportVR = new TeleportVR(scene, camera);
```

Create geometries for the hands and add controller grips, see example code for more info.

Update **TeleportVR** in your render loop

```javascript
teleportVR.update();
renderer.render(scene, camera)
```


## Example 1

Basic TeleportVR setup for WebVR and Threejs projects.

[![TeleportVR Example 1](./dist/client/img/teleportvr-1.gif)](https://sbcode.net/threejs/teleportvr-1/)

## Example 2

Shoot at objects in the scene.

[![TeleportVR Example 2](./dist/client/img/teleportvr-2.gif)](https://sbcode.net/threejs/teleportvr-2/)

## Example 3

Teleport on top of objects in the scene.

[![TeleportVR Example 3](./dist/client/img/teleportvr-3.gif)](https://sbcode.net/threejs/teleportvr-3/)

## Example 4

Customising the TeleportVR default meshes.

[![TeleportVR Example 4](./dist/client/img/teleportvr-4.gif)](https://sbcode.net/threejs/teleportvr-4/)


## TeleportVR Source Project

This is a typescript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in `./src/client/` or `./src/server/`

The projects will auto recompile if you started it by using *npm run dev*
