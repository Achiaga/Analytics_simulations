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
let eaterArmy, foodCollection, foodObjectsCollision;

let numEaters = 4;
let numFood = 5;

//MOVEMENT
const vel = 0.1;
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
	eaterArmy = initEaters(scene, numEaters);
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
		return hanldeRandomMovement(eaterArmy[eater], vel);
	}
	let food = foodCollection[Object.keys(foodCollection)[index]];
	return hanldeGetFoodMovement(eaterArmy[eater], food, vel);
};

const hanldeRandomMovement = (eater) => {
	randomMovement(eater, vel, foodObjectsCollision, foodCollection, numEaters, modifyReproduce, scene);
};

const hanldeGetFoodMovement = (eater, food) => {
	getFoodMovement(eater, food, numEaters, vel);
};

// Handle Reproduce
const handleReproduce = () => {
	numEaters = reproduce(eaterArmy, foodCollection, foodObjectsCollision, numEaters, scene);
	handleInitEater();
	handleInitFood();
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
handleInitEater();
handleInitFood();
GameLoop();
