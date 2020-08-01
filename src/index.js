import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { random } from 'lodash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { functions } from 'lodash';

// Camera Variables
let camera, scene, renderer, light;
const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.25;
const far = 100;
const sceneBgColor = 0xfffffff;
const cameraPosX = -12;
const cameraPosY = 18;
const cameraPosZ = 33;
const cameraLookAtX = 0;
const cameraLookAtY = 2;
const cameraLookAtZ = 0;

// Ground Variables
const groundRadius = 16;
const groundHeight = 0.6;
const groundSegments = 200;
const groundColor = 0x00000;
const developmentMode = false;
const groundEdgesColor = 0xfffffff;

// Grid Variables
const gridDimensions = 1000;
const gridDivisons = 30;
const gridColor1 = 0x000000;
const gridColor2 = 0x000000;
const gridOpacity = 0.2;

// Objects Variables
let loader = new GLTFLoader();
let blablapArmy = {};
let FoodCollection = {};
const blablapSkeleton = {
	x: 1.5,
	y: 1,
	z: 1.5,
};
const foodSkeleton = {
	radius: 0.5,
	widthSgementes: 20,
	heightSegmets: 20,
};
let numBlablaps = 5;
const numFood = 3;
const vel = 0.1;
let getFoodRandom = true;

// Collision
var BlablapCollisionDist = 3; // How many units away a dino can get to a wall
var collidableObjects = [];
var foodObjectsCollision = [];

// Restart --> Reproduce
let restart = false;

//CAMERA & SCENE
const initScene = () => {
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(cameraPosX, cameraPosY, cameraPosZ);
	camera.lookAt(new THREE.Vector3(cameraLookAtX, cameraLookAtY, cameraLookAtZ));

	scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneBgColor);
	scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});

	var controls = new OrbitControls(camera, renderer.domElement);

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', function () {
		var width = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	//LIGHT
	light = new THREE.HemisphereLight(0xffffff, 0x444444);
	light.position.set(0, 20, 0);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 20, 10);
	scene.add(light);
};

// Ground / Floor

const createGroundBody = () => {
	// ground - plataform
	var geometry = new THREE.CylinderGeometry(
		groundRadius,
		groundRadius,
		groundHeight,
		groundSegments
	);
	var material = new THREE.MeshBasicMaterial({
		color: groundColor,
		wireframe: developmentMode,
	});
	var circle = new THREE.Mesh(geometry, material);
	scene.add(circle);

	circle.rotation.x = 0;
	circle.position.y = 0.5;
	circle.rotation.z = 0;

	// Ground edges
	var geo = new THREE.EdgesGeometry(circle.geometry);
	var mat = new THREE.LineBasicMaterial({
		color: groundEdgesColor,
		linewidth: 4,
	});
	var wireframe = new THREE.LineSegments(geo, mat);
	wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
	circle.add(wireframe);

	// Grid
	var grid = new THREE.GridHelper(
		gridDimensions,
		gridDivisons,
		gridColor1,
		gridColor2
	);
	grid.material.opacity = gridOpacity;
	grid.material.transparent = true;
	scene.add(grid);
};

// OBJECTS

// BlablapArmy

const initBlablap = () => {
	const createBlablapBody = (callback, blaWarrior, index) => {
		// const [positionX, positionZ] = setRandomPositionBlablap();
		const [positionX, positionZ] = setOriginPostion();
		const [destX, destZ] = setRandomDestination();
		const [destRandX, destRandZ] = setRandomPositionBlablap();
		let blablap;
		return loader.load(
			'cube.gltf',
			function (gltf) {
				blablap = gltf.scene;
				scene.add(blablap);
				blablap.position.x = positionX;
				blablap.position.z = positionZ;
				blablap.position.y = 1.8;
				blablap.userData.x = positionX;
				blablap.userData.z = positionZ;
				blablap.userData.destX = destX;
				blablap.userData.destZ = destZ;
				blablap.userData.destRandX = destRandX;
				blablap.userData.destRandZ = destRandZ;
				blablap.userData.eatenFood = 0;
				blablap.userData.feed = false;
				blablap.userData.reproduce = false;
				blablap.userData.hasFinsihed = false;
				blablap.name = 'blablap' + index;
				// blablap.userData.stopCollision = false;
				callback(blablap, blaWarrior);
			},
			function (xhr) {
				if (xhr.loaded === xhr.total) {
					// loadedObject += 1;
				}
			},
			function (error) {
				console.error(error);
			}
		);
	};

	let angleBlabap = ((360 / numBlablaps) * 2 * Math.PI) / 360;
	let originalAngle = angleBlabap;

	function setOriginPostion() {
		let posX = Math.cos(angleBlabap) * 14;
		let posY = Math.sin(angleBlabap) * 14;
		angleBlabap += originalAngle;
		return [posX, posY];
	}

	function setRandomDestination() {
		let randX = Math.random() * 6;
		randX *= PostiveNegativeRandRange(randX);
		let randY = Math.random() * 6;
		randY *= PostiveNegativeRandRange(randY);
		return [randX, randY];
	}

	function setRandomPositionBlablap() {
		let randX = Math.random() * 14;
		randX *= PostiveNegativeRandRange(randX);
		let randY = Math.sqrt(14 * 14 - randX * randX);
		randY *= PostiveNegativeRandRange(randY);
		return [randX, randY];
	}

	const createBlablapArmy = () => {
		const BlablapName = 'bla';
		for (var i = 0; i < numBlablaps; i++) {
			let blablap = BlablapName + i;
			blablapArmy = {
				...blablapArmy,
				[blablap]: {},
			};
		}
	};

	const fillBlablapArmy = () => {
		Object.keys(blablapArmy).forEach((body, index) =>
			createBlablapBody(addPropsBlablapArmy, body, index)
		);
	};

	const createSkeletonBlablap = (blablap, index) => {
		var geometry = new THREE.BoxGeometry(
			blablapSkeleton.x,
			blablapSkeleton.y,
			blablapSkeleton.z
		);
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		var cube = new THREE.Mesh(geometry, material);
		blablap.add(cube);
		cube.name = 'cube' + index;
		cube.position.y = -1;
		// collidableObjects.push(cube);
	};

	const addPropsBlablapArmy = (blablap, blaWarrior, index) => {
		blablapArmy[blaWarrior] = blablap;
		createSkeletonBlablap(blablap, index);
	};

	createBlablapArmy();
	fillBlablapArmy();
	setOriginPostion();
};

// Food

const initFood = () => {
	function setRandomPositionFood() {
		let randX = Math.random() * 6;
		randX *= PostiveNegativeRandRange(randX);
		let randY = Math.random() * 6;
		randY *= PostiveNegativeRandRange(randY);
		return [randX, randY];
	}

	const createFoodCollection = () => {
		let foodName = 'food';
		for (var i = 0; i < numFood; i++) {
			let foodItem = foodName + i;
			FoodCollection = {
				...FoodCollection,
				[foodItem]: createSkeletonFood(i),
			};
		}
	};

	const createSkeletonFood = (index) => {
		const [randX, randZ] = setRandomPositionFood();
		var geometry = new THREE.SphereBufferGeometry(
			foodSkeleton.radius,
			foodSkeleton.widthSgementes,
			foodSkeleton.heightSegmets
		);
		var material = new THREE.MeshBasicMaterial({ color: 0x1caf1e });
		var foodBody = new THREE.Mesh(geometry, material);
		scene.add(foodBody);
		foodBody.position.x = randX;
		foodBody.position.z = randZ;
		foodBody.position.y = 1.2;
		foodBody.name = 'food' + index;
		foodObjectsCollision.push(foodBody);
		return foodBody;
	};

	createFoodCollection();
};

const PostiveNegativeRandRange = (num) => {
	num = Math.floor(Math.random() * 2) == 1 ? 1 : -1;
	return num;
};

// Handle Collision

function paintRayCaster(pointA, direction) {
	// Draw a line from pointA in the given direction at distance 100
	direction.normalize();

	var distance = 5; // at what distance to determine pointB

	var pointB = new THREE.Vector3();
	pointB.addVectors(pointA, direction.multiplyScalar(distance));

	var geometry = new THREE.Geometry();
	geometry.vertices.push(pointA);
	geometry.vertices.push(pointB);
	var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
	var line = new THREE.Line(geometry, material);
	scene.add(line);
}

function detectBlablapCollision(eater) {
	// Get the rotation matrix from dino
	var matrix = new THREE.Matrix4();
	matrix.extractRotation(eater.matrix);

	// Create direction vector
	var directionFront = new THREE.Vector3(0, -0.2, 1);
	var directionFront1 = new THREE.Vector3(-0.3, -0.2, 1);
	var directionFront2 = new THREE.Vector3(0.3, -0.2, 1);

	// // Get the vectors coming from the front of the dino
	directionFront.applyMatrix4(matrix);
	directionFront1.applyMatrix4(matrix);
	directionFront2.applyMatrix4(matrix);
	// paintRayCaster(eater.position, directionFront);
	// paintRayCaster(eater.position, directionFront1);
	// paintRayCaster(eater.position, directionFront2);

	// // Create raycaster
	var rayCasterF = new THREE.Raycaster(eater.position, directionFront);
	var rayCasterF1 = new THREE.Raycaster(eater.position, directionFront1);
	var rayCasterF2 = new THREE.Raycaster(eater.position, directionFront2);
	// paintCollisionedObject(rayCasterF);

	// // If we have a front collision, we have to adjust our direction so return true
	// if (rayIntersect(rayCasterF, BlablapCollisionDist)) return true;
	// if (rayIntersect(rayCasterF1, BlablapCollisionDist)) return true;
	// if (rayIntersect(rayCasterF2, BlablapCollisionDist)) return true;
	if (foodDetect(rayCasterF, BlablapCollisionDist, eater)) return true;
	if (foodDetect(rayCasterF1, BlablapCollisionDist, eater)) return true;
	if (foodDetect(rayCasterF2, BlablapCollisionDist, eater)) return true;
	return false;
}

function foodDetect(ray, distance, eater) {
	var intersects = ray.intersectObjects(foodObjectsCollision);
	for (var i = 0; i < intersects.length; i++) {
		// Check if there's a collision
		if (intersects[i].distance < distance && !eater.userData.feed) {
			eater.userData.eatenFood = 1;
			//Remove Object From Scene
			var selectedObject = scene.getObjectByName(intersects[i].object.name);
			scene.remove(selectedObject);

			// Delete From Food Collection
			const nameColladiblaFood = intersects[i].object.name;
			delete FoodCollection[nameColladiblaFood];

			// Remove Collidable Object
			let index = 1;
			if (nameColladiblaFood.length === 6) index = 2;
			var indexKey = nameColladiblaFood.substr(
				nameColladiblaFood.length - index
			);
			foodObjectsCollision.splice(indexKey, 1);

			return true;
		}
	}
	return false;
}

// Handle Movement
const boundariesCheck = (numX, numZ) => {
	numX = Math.abs(numX);
	numZ = Math.abs(numZ);
	if (numZ >= Math.sqrt(15.5 * 15.5 - numX * numX)) {
		console.log('Out of borders');
	} else if (numX >= Math.sqrt(15.5 * 15.5 - numZ * numZ)) {
		console.log('Out of boundaries');
	}
};

function getNextPos(x1, z1, x2, z2) {
	const speed_per_tick = 0.1;
	const distX = x2 - x1;
	const distZ = z2 - z1;
	const dist = Math.sqrt(distX * distX + distZ * distZ);
	const ratio = speed_per_tick / dist;
	const x_move = ratio * distX;
	const y_move = ratio * distZ;
	const new_x_pos = x_move + x1;
	const new_y_pos = y_move + z1;
	return [new_x_pos, new_y_pos];
}

let finishCont = 0;

function randomMovement(eater, vel) {
	if (!eater || !eater.position || eater.userData.hasFinsihed) return;

	const { x: posX, z: posZ } = eater.position;
	const { destX, destZ } = eater.userData;
	posX > destX && (vel *= -1);
	if (
		(Math.abs(posX - destX) < 0.5 && Math.abs(posZ - destZ) < 0.5) ||
		(detectBlablapCollision(eater) && !eater.userData.feed)
	) {
		if (eater.userData.eatenFood > 0) eater.userData.feed = true;
		eater.userData.hasMoved = true;
		eater.userData.destX = eater.userData.destRandX;
		eater.userData.destZ = eater.userData.destRandZ;
		// setTimeout(() => {}, 1000);
		return;
	}
	const [new_x_pos, new_z_pos] = getNextPos(posX, posZ, destX, destZ);
	eater.lookAt(new_x_pos, 1.8, new_z_pos);
	eater.position.x = new_x_pos;
	eater.position.z = new_z_pos;
	// boundariesCheck(new_x_pos, new_z_pos);

	if (
		Math.abs(
			eater.position.x.toFixed(1) - eater.userData.destRandX.toFixed(1)
		) < 1 &&
		Math.abs(
			eater.position.z.toFixed(1) - eater.userData.destRandZ.toFixed(1)
		) < 1 &&
		eater.userData.hasMoved
	) {
		eater.userData.hasFinsihed = true;
		finishCont += 1;
		if (finishCont === numBlablaps) {
			finishCont = 0;
			setTimeout(() => {
				handleRestart();
			}, 1000);
		}
	}
	return;
}

function alwaysGetFoodMovement(eater, food, vel) {
	if (!eater || !eater.position) return;
	if (!food || !food.position) return;
	const { x: posX, z: posZ } = eater.position;
	const { x: originX, z: oroginZ } = eater.position;
	let { x: destX, z: destZ } = food.position;
	posX > destX && (vel *= -1);
	if (Math.abs(posX - destX) < 0.5 && Math.abs(posZ - destZ) < 0.5) {
		setTimeout(() => {
			destX = originX;
			destZ = oroginZ;
		}, 1000);
		return;
	}
	const [new_x_pos, new_z_pos] = getNextPos(posX, posZ, destX, destZ);
	eater.lookAt(new_x_pos, 1.8, new_z_pos);
	eater.position.x = new_x_pos;
	eater.position.z = new_z_pos;
	return;
}

// Handle Restart
const handleRestart = () => {
	let numBlablasReproduce = 0;
	Object.keys(blablapArmy).forEach((blaWarrior, index) => {
		if (blablapArmy[blaWarrior].userData.feed) {
			// blablapArmy[blaWarrior].userData.reproduce = true;
			numBlablasReproduce += 2;
		}
	});
	for (var i = scene.children.length - 1; i >= 4; i--) {
		scene.remove(scene.children[i]);
	}
	if (numBlablasReproduce === 0) console.log('All DEAD');
	else console.log(numBlablasReproduce, 'did reproduce');
	blablapArmy = {};
	numBlablaps = numBlablasReproduce;
	initBlablap();
	FoodCollection = {};
	foodObjectsCollision = [];
	initFood();
	return;
};

// Update the scene
const update = () => {
	Object.keys(blablapArmy).forEach((blaWarrior, index) => {
		const food = FoodCollection[Object.keys(FoodCollection)[index]];
		if (getFoodRandom) {
			randomMovement(blablapArmy[blaWarrior], vel);
		} else {
			alwaysGetFoodMovement(blablapArmy[blaWarrior], food, vel);
		}
	});
};

//draw scene
var render = function () {
	renderer.render(scene, camera);
};

//run game loop(update, render, repeat)
var GameLoop = function () {
	requestAnimationFrame(GameLoop);
	update();
	render();
};

initScene();
createGroundBody();
initBlablap();
initFood();
GameLoop();
