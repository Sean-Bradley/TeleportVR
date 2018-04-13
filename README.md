# TeleportVR
Teleport module for WebVR, THREE.js and VRController.js projects

Requires latest Firefox, Oculus Rift CV1, 2 Touch Controllers and Rift Core 2.0 Beta disabled in Oculus settings.

## Video Tutorial of using StatsVR
[![TeleportVR Tutorial for WebVR and ThreeJS projects](https://img.youtube.com/vi/-qHfxqhlk_0/0.jpg)](https://www.youtube.com/watch?v=-qHfxqhlk_0)


## GitHub page
https://github.com/Sean-Bradley/TeleportVR


## How to Use
The TeleportVR module depends on the three.js and VRController.js libraries, and is useful in VR scenarios where you have an Oculus Rift and Touch Controllers, or Vive and it's controllers. I have not tested yet with vive controllers, but please leave a comment if they work or not and i will try to debug. The best example code to start with is in ![Demo 1](https://sean-bradley.github.io/TeleportVR/img/demo1.gif)



### Include TeleportVR script
Download teleportvr.min.js, save it, and include reference to script in your html head after three.js and VRController.js inclusion. eg

``<script type="text/javascript" src="js/teleportvr.js"></script>``

### Create global variables
```
var camera, scene, renderer;  // these are commonly used THREE.js variables and may already exist in your project
var teleportVR; // create your global teleportVR variable. I named mine teleportVR

function init(){
	// existing THREE.js and webvr setup goes here
	// then after you've instantiated the THREE.js renderer, scene and camera objects,
	teleportVR = new TeleportVR(scene, camera);  // instance your teleportVR variable and pass your scene and camera objects to the TeleportVR constructor
}
init();
```

### Modify and add some VRController.js event listeners
Common VRController.js demos contain a 'vr controller connected' event listener in the code example.
Modify this section to add the new found controller to your teleportVR object.
```
window.addEventListener('vr controller connected', function (event) {
    var controller = event.detail  //existing code
    //scene.add(controller); // remove this line
    teleportVR.add(controller)   // replace with this line. 

    // existing VRController.js setup goes here, such as standingmatrix setup and controller mesh creation

    // add teleportVR function calls to these 3 specific VRController.js thumbstick events below
    controller.addEventListener('thumbstick touch began', function (event) {
        teleportVR.show(controller); //show teleportVR graphics relative to this controller
    })
    controller.addEventListener('thumbstick axes changed', function (event) {
        //code below allows you to visualise the angle the teleporter will face after teleport 
        if (Math.abs(event.axes[0]) > 0.01 && Math.abs(event.axes[1]) > 0.01) {
            var angleDeg = Math.atan2(-event.axes[0], -event.axes[1]);
            teleportVR.target.rotation.y = angleDeg;
        }
    })
    controller.addEventListener('thumbstick touch ended', function (event) {
        teleportVR.teleport(); //do the actual teleport which updates your controller positions in the world 3d space
    })

})
```

### Call the TeleportVR update function in your existing animation/render loop
function render() {
	
	// your existing animation magic

    THREE.VRController.update(); //your exisiting VRController update call
    
    teleportVR.update(); //your teleportVR update call is required here
	
	renderer.render(scene, camera); //your exisiting threejs scene render call    
	
}
renderer.animate(render);
```

### Optional - Change TeleportVR max distance

``teleportVR.setMaxDistance(50);``

### Change TeleportVR mesh and material,
For example see ![Demo 3](https://sean-bradley.github.io/TeleportVR/img/demo3.gif)


## All TeleportVR demos 
https://sean-bradley.github.io/TeleportVR/ 


## Demo1 - Basic TeleportVR usage
![Demo 1](https://sean-bradley.github.io/TeleportVR/img/demo1.gif)

https://sean-bradley.github.io/TeleportVR/demo1.html 


## Demo2 - Extra functions such as laser guns, explosions and haptic feedback
![Demo 2](https://sean-bradley.github.io/TeleportVR/img/demo2.gif)

https://sean-bradley.github.io/TeleportVR/demo2.html 


## Demo3 - Customising the mesh and materials of the TeleportVR target and curve
![Demo 3](https://sean-bradley.github.io/TeleportVR/img/demo3.gif)

https://sean-bradley.github.io/TeleportVR/demo3.html 


## Demo4 - Teleporting on top of objects
![Demo 4](https://sean-bradley.github.io/TeleportVR/img/demo4.gif)

https://sean-bradley.github.io/TeleportVR/demo4.html 