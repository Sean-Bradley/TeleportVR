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

This is a typescript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in `./src/client/` or `./src/server/`

The projects will auto recompile if you started it by using *npm run dev*

or

You can simply just import the generated `./dist/client/teleportvr.js` directly into your own project as a module.

```javascript
<script type="module" src="./teleportvr.js"></script>
```

or as ES6 import

```javascript
import TeleportVR from './teleportvr.js'
```
