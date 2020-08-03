import * as THREE from 'three';
import { getRandomPositiveOrNegative } from './utils';

const foodSkeleton = {
	radius: 0.25,
	widthSgementes: 20,
	heightSegmets: 20,
};
let numberFood;
let FoodCollection = {};
var foodObjectsCollision = [];

const setRandomPositionFood = () => {
	let randX = getRandomPositiveOrNegative(Math.random() * 6);
	let randY = getRandomPositiveOrNegative(Math.random() * 6);
	return [randX, randY];
};

const createFoodCollection = (scene) => {
	let foodName = 'food';
	for (var i = 0; i < numberFood; i++) {
		let foodItem = foodName + i;
		FoodCollection = {
			...FoodCollection,
			[foodItem]: createSkeletonFood(i, scene),
		};
	}
};

const createSkeletonFood = (index, scene) => {
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
	foodBody.position.y = 1.6;
	foodBody.name = 'food' + index;
	foodObjectsCollision.push(foodBody);
	return foodBody;
};

export const initFood = (scene, numFood) => {
	numberFood = numFood;
	createFoodCollection(scene);
	return [FoodCollection, foodObjectsCollision];
};
