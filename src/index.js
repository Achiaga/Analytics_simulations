import { initScene } from './scene';
import { initButton } from './pause';
import { initGround } from './ground';
import { initEaters } from './eaters';
import { initFood } from './food';
import { randomMovement } from './randomMovement';
import { getFoodMovement } from './getFoodMovement';
import { reproduce } from './reproduce';

//CAMERA & SCENE
let scene, camera, renderer;
let isRunning = true;

//OBJECTS
let eaterArmy, foodCollection, foodObjectsCollision, eatersFoodMatch;

let numEaters = 10;
let numKrans = 2;
let numFood = 20;

//MOVEMENT
const vel = 0.4;
let getFoodRandom = false;

//REPRODUCE
let shouldReproduce = false;

// Start Scene
const handleInitScene = () => {
	[scene, camera, renderer] = initScene(scene);
};

// Create Pause Button
const handlePause = () => {
	initButton(modifyPause);
};

// Create Ground
const handleGround = () => {
	initGround(scene);
};

// Create Eaters
const handleInitEater = () => {
	[eaterArmy, eatersFoodMatch] = initEaters(scene, numEaters, numKrans, foodCollection);
};

// Create Food
const handleInitFood = () => {
	[foodCollection, foodObjectsCollision, numFood] = initFood(scene, numFood, getFoodRandom);
};

// Handle State
const modifyPause = (state) => {
	isRunning = state;
};

const modifyReproduce = (state) => {
	shouldReproduce = state;
};

// Handle Movement
const handleMovement = (eater, index) => {
	if (getFoodRandom) {
		return hanldeRandomMovement(eaterArmy[eater]);
	}
	return hanldeGetFoodMovement(eaterArmy[eater], index);
};

const hanldeRandomMovement = (eater) => {
	randomMovement(
		eater,
		vel,
		foodObjectsCollision,
		foodCollection,
		numEaters,
		numKrans,
		modifyReproduce,
		scene
	);
};

const hanldeGetFoodMovement = (eater, index) => {
	getFoodMovement(eater, numEaters, numKrans, vel, modifyReproduce, scene);
};

// Handle Reproduce
const handleReproduce = () => {
	[numEaters, numKrans] = reproduce(
		eaterArmy,
		foodCollection,
		eatersFoodMatch,
		foodObjectsCollision,
		getFoodRandom,
		scene
	);
	handleInitFood();
	handleInitEater();
	shouldReproduce = false;
};

// Update the scene
const update = () => {
	if (!isRunning) return;
	if (shouldReproduce) return handleReproduce();
	Object.keys(eaterArmy).forEach((eater, index) => {
		handleMovement(eater, index);
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

handleInitScene();
handlePause();
handleGround();
handleInitFood();
handleInitEater();
GameLoop();
