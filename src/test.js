var UNITWIDTH = 90; // Width of a cubes in the maze
var UNITHEIGHT = 45; // Height of the cubes in the maze
var PLAYERSPEED = 600.0; // How fast the player moves
var DINOSPEED = 400.0; // How fast the dino is moving
var PLAYERCOLLISIONDISTANCE = 20; // How far away the player can get from collidabel objects
var DINOSCALE = 20; // How big our dino is scaled to
var BlablapCollisionDist = 55; // How many units away a dino can get to a wall

var clock;
var dino;
var loader = new THREE.JSONLoader();
var camera, controls, scene, renderer;
var mapSize;

var totalCubesWide;
var collidableObjects = [];

// Flag to determine if the player can move and look around
var controlsEnabled = false;

// Flags to determine which direction the player is moving
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

// Velocity vectors for the player and dino
var playerVelocity = new THREE.Vector3();
var dinoVelocity = new THREE.Vector3();

// HTML elements to be changed
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// Take control of the mouse for controls
getPointerLock();
// Set up the game
init();

function getPointerLock() {
	document.onclick = function () {
		container.requestPointerLock();
	};

	document.addEventListener('pointerlockchange', lockChange, false);
}

function lockChange() {
	if (document.pointerLockElement === container) {
		blocker.style.display = 'none';
		controls.enabled = true;
	} else {
		blocker.style.display = '';
		controls.enabled = false;
	}
}

// Set up the game
function init() {
	// Set clock to keep track of frames
	clock = new THREE.Clock();
	// Create the scene where everything will go
	scene = new THREE.Scene();

	// Add some fog for effects
	scene.fog = new THREE.FogExp2(0xcccccc, 0.0015);

	// Set render settings
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Render to the container
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	// Set camera position and view details
	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		2000
	);
	camera.position.y = 20; // Height the camera will be looking from
	camera.position.x = 0;
	camera.position.z = 0;

	// Add the camera to the controller, then add to the scene
	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	// Check to see if keys are being pressed to move the player
	listenForPlayerMovement();

	// Add the walls(cubes) of the maze
	createMazeCubes();
	// Add ground plane
	createGround();
	// Add boundry walls that surround the maze
	createPerimWalls();

	// load the dino JSON model and start animating once complete
	loader.load(
		'https://s3-us-west-2.amazonaws.com/s.cdpn.io/515428/dino.json',
		function (geometry, materials) {
			// Get the geometry and materials from the JSON
			var dinoObject = new THREE.Mesh(
				geometry,
				new THREE.MultiMaterial(materials)
			);

			// Scale the size of the dino
			dinoObject.scale.set(DINOSCALE, DINOSCALE, DINOSCALE);
			dinoObject.rotation.y = degreesToRadians(90);
			dinoObject.position.set(30, 0, -400);
			dinoObject.name = 'dino';
			scene.add(dinoObject);

			//position.setFromMatrixPosition(dino.matrixWorld);
			dino = scene.getObjectByName('dino');

			// Model is loaded, switch from "Loading..." to instruction text
			instructions.innerHTML =
				'<strong>Click to Play!</strong> </br></br> W,A,S,D or arrow keys = move </br>Mouse = look around';

			// Call the animate function so that animation begins after the model is loaded
			animate();
		}
	);

	// Add lights to the scene
	addLights();

	// Listen for if the window changes sizes
	window.addEventListener('resize', onWindowResize, false);
}

// Add event listeners for player movement key presses
function listenForPlayerMovement() {
	// Listen for when a key is pressed
	// If it's a specified key, mark the direction as true since moving
	var onKeyDown = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
		}
	};

	// Listen for when a key is released
	// If it's a specified key, mark the direction as false since no longer moving
	var onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	// Add event listeners for when movement keys are pressed and released
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
}

// Add lights to the scene
function addLights() {
	var lightOne = new THREE.DirectionalLight(0xffffff);
	lightOne.position.set(1, 1, 1);
	scene.add(lightOne);

	var lightTwo = new THREE.DirectionalLight(0xffffff, 0.4);
	lightTwo.position.set(1, -1, -1);
	scene.add(lightTwo);

	var lightThree = new THREE.AmbientLight(0x222222);
	lightThree.position.set(1, 0, 0);
	scene.add(lightThree);
}

// Create the maze walls using cubes that are mapped with a 2D array
function createMazeCubes() {
	// Maze wall mapping, assuming matrix
	// 1's are cubes, 0's are empty space
	var map = [
		[0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0],
		[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
	];

	// wall details
	var cubeGeo = new THREE.BoxGeometry(UNITWIDTH, UNITHEIGHT, UNITWIDTH);
	var cubeMat = new THREE.MeshPhongMaterial({
		color: 0x81cfe0,
	});

	// Keep cubes within boundry walls
	var widthOffset = UNITWIDTH / 2;
	// Put the bottom of the cube at y = 0
	var heightOffset = UNITHEIGHT / 2;

	// See how wide the map is by seeing how long the first array is
	totalCubesWide = map[0].length;

	// Place walls where 1`s are
	for (var i = 0; i < totalCubesWide; i++) {
		for (var j = 0; j < map[i].length; j++) {
			// If a 1 is found, add a cube at the corresponding position
			if (map[i][j]) {
				// Make the cube
				var cube = new THREE.Mesh(cubeGeo, cubeMat);
				// Set the cube position
				cube.position.z = (i - totalCubesWide / 2) * UNITWIDTH + widthOffset;
				cube.position.y = heightOffset;
				cube.position.x = (j - totalCubesWide / 2) * UNITWIDTH + widthOffset;
				// Add the cube
				scene.add(cube);
				// Used later for collision detection
				collidableObjects.push(cube);
			}
		}
	}
	// Create the ground based on the map size the matrix/cube size produced
	mapSize = totalCubesWide * UNITWIDTH;
}

// Create the ground plane that the maze sits on top of
function createGround() {
	// Create the ground based on the map size the matrix/cube size produced
	mapSize = totalCubesWide * UNITWIDTH;
	// ground
	var groundGeo = new THREE.PlaneGeometry(mapSize, mapSize);
	var groundMat = new THREE.MeshPhongMaterial({
		color: 0xa0522d,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
	});

	var ground = new THREE.Mesh(groundGeo, groundMat);
	ground.position.set(0, 1, 0);
	ground.rotation.x = degreesToRadians(90);
	scene.add(ground);
}

// Make the four perimeter walls for the maze
function createPerimWalls() {
	var halfMap = mapSize / 2; // Half the size of the map
	var sign = 1; // Used to make an amount positive or negative

	// Loop through twice, making two perimeter walls at a time
	for (var i = 0; i < 2; i++) {
		var perimGeo = new THREE.PlaneGeometry(mapSize, UNITHEIGHT);
		// Make the material double sided
		var perimMat = new THREE.MeshPhongMaterial({
			color: 0x464646,
			side: THREE.DoubleSide,
		});
		// Make two walls
		var perimWallLR = new THREE.Mesh(perimGeo, perimMat);
		var perimWallFB = new THREE.Mesh(perimGeo, perimMat);

		// Create left/right walls
		perimWallLR.position.set(halfMap * sign, UNITHEIGHT / 2, 0);
		perimWallLR.rotation.y = degreesToRadians(90);
		scene.add(perimWallLR);
		collidableObjects.push(perimWallLR);
		// Create front/back walls
		perimWallFB.position.set(0, UNITHEIGHT / 2, halfMap * sign);
		scene.add(perimWallFB);
		collidableObjects.push(perimWallFB);

		sign = -1; // Swap to negative value
	}
}

// Update the camera and renderer when the window changes size
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	render();
	requestAnimationFrame(animate);
	// Get the change in time between frames
	var delta = clock.getDelta();

	animatePlayer(delta);
	animateDino(delta);
}

// Render the scene
function render() {
	renderer.render(scene, camera);
}

function animatePlayer(delta) {
	// Gradual slowdown
	playerVelocity.x -= playerVelocity.x * 10.0 * delta;
	playerVelocity.z -= playerVelocity.z * 10.0 * delta;

	// If no collision and a movement key is being pressed, apply movement velocity
	if (detectPlayerCollision() == false) {
		if (moveForward) {
			playerVelocity.z -= PLAYERSPEED * delta;
		}
		if (moveBackward) {
			playerVelocity.z += PLAYERSPEED * delta;
		}
		if (moveLeft) {
			playerVelocity.x -= PLAYERSPEED * delta;
		}
		if (moveRight) {
			playerVelocity.x += PLAYERSPEED * delta;
		}

		controls.getObject().translateX(playerVelocity.x * delta);
		controls.getObject().translateZ(playerVelocity.z * delta);
	} else {
		// Collision or no movement key being pressed. Stop movememnt
		playerVelocity.x = 0;
		playerVelocity.z = 0;
	}
}

//  Determine if the player is colliding with a collidable object
function detectPlayerCollision() {
	// The rotation matrix to apply to our direction vector
	// Undefined by default to indicate ray should coming from front
	var rotationMatrix;
	// Get direction of camera
	var cameraDirection = controls
		.getDirection(new THREE.Vector3(0, 0, 0))
		.clone();

	// Check which direction we're moving (not looking)
	// Flip matrix to that direction so that we can reposition the ray
	if (moveBackward) {
		rotationMatrix = new THREE.Matrix4();
		rotationMatrix.makeRotationY(degreesToRadians(180));
	} else if (moveLeft) {
		rotationMatrix = new THREE.Matrix4();
		rotationMatrix.makeRotationY(degreesToRadians(90));
	} else if (moveRight) {
		rotationMatrix = new THREE.Matrix4();
		rotationMatrix.makeRotationY(degreesToRadians(270));
	}

	// Player is moving forward, no rotation matrix needed
	if (rotationMatrix !== undefined) {
		cameraDirection.applyMatrix4(rotationMatrix);
	}

	// Apply ray to player camera
	var rayCaster = new THREE.Raycaster(
		controls.getObject().position,
		cameraDirection
	);

	// If our ray hit a collidable object, return true
	if (rayIntersect(rayCaster, PLAYERCOLLISIONDISTANCE)) {
		return true;
	} else {
		return false;
	}
}

function rayIntersect(ray, distance) {
	var intersects = ray.intersectObjects(collidableObjects);
	for (var i = 0; i < intersects.length; i++) {
		if (intersects[i].distance < distance) {
			return true;
		}
	}
	return false;
}

// Apply movement to the dino, turning when collisions are made
function animateDino(delta) {
	// Gradual slowdown
	dinoVelocity.x -= dinoVelocity.x * 10.0 * delta;
	dinoVelocity.z -= dinoVelocity.z * 10.0 * delta;

	// If no collision, apply movement velocity
	if (detectDinoCollision() == false) {
		dinoVelocity.z += DINOSPEED * delta;
		// Move the dino
		dino.translateZ(dinoVelocity.z * delta);
	} else {
		// Collision. Adjust direction
		var directionMultiples = [-1, 1, 2];
		var randomIndex = getRandomInt(0, 2);
		var randomDirection = degreesToRadians(
			90 * directionMultiples[randomIndex]
		);

		dinoVelocity.z += DINOSPEED * delta;
		dino.rotation.y += randomDirection;
	}
}

function detectDinoCollision() {
	// Get the rotation matrix from dino
	var matrix = new THREE.Matrix4();
	matrix.extractRotation(dino.matrix);
	// Create direction vector
	var directionFront = new THREE.Vector3(0, 0, 1);

	// Get the vectors coming from the front of the dino
	directionFront.applyMatrix4(matrix);

	// Create raycaster
	var rayCasterF = new THREE.Raycaster(dino.position, directionFront);
	// If we have a front collision, we have to adjust our direction so return true
	if (rayIntersect(rayCasterF, BlablapCollisionDist)) return true;
	else return false;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// Converts degrees to radians
function degreesToRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

// Converts radians to degrees
function radiansToDegrees(radians) {
	return (radians * 180) / Math.PI;
}
