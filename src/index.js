import { initScene } from './scene';
import { initGround } from './ground';
import { initEaters } from './eaters';
import { initFood } from './food';
import { randomMovement } from './randomMovement';

//CAMERA & SCENE
let scene, camera, renderer;

//OBJECTS
let blablapArmy, foodCollection, foodObjectsCollision;

let numBlablaps = 5;
let numFood = 2;

//MOVEMENT
const vel = 0.1;
let getFoodRandom = true;

// Start Scene
const handleInitScene = () => {
	[scene, camera, renderer] = initScene(scene);
};

// Create Ground
const handleGround = () => {
	initGround(scene);
};

// Create Eaters
const handleInitBlabla = () => {
	blablapArmy = initEaters(scene, numBlablaps);
};

// Create Food
const handleInitFood = () => {
	[foodCollection, foodObjectsCollision] = initFood(scene, numFood);
};

// Handle Movement

const hanldeRandomMovement = (eater) => {
	randomMovement(eater, vel, foodObjectsCollision, foodCollection, numBlablaps, scene);
};

const hanldeGetFoodMovement = (eater) => {
	getFoodMovement(eater, vel, foodObjectsCollision, foodCollection, numBlablaps, scene);
};

const handleMovement = (blaWarrior, index) => {
	if (getFoodRandom) {
		hanldeRandomMovement(blablapArmy[blaWarrior], vel);
	} else if (!getFoodRandom) {
		hanldeGetFoodMovement(blablapArmy[blaWarrior], food, vel);
	}
};

// Update the scene
const update = () => {
	Object.keys(blablapArmy).forEach((blaWarrior, index) => {
		handleMovement(blaWarrior, index);
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
handleGround();
handleInitBlabla();
handleInitFood();
GameLoop();
