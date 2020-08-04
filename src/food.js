import * as THREE from 'three';
import { setRandomCoords } from './utils';

const foodSkeleton = {
	radius: 0.25,
	widthSgementes: 20,
	heightSegmets: 20,
};

let quantityFood;
let FoodCollection = {};
var foodObjectsCollision = [];

const loopCreateObjects = (num, name, obj, fillObj, scene) => {
	for (var i = 0; i < num - 1; i++) {
		obj[`${name}${i}`] = fillObj(i, scene);
	}
};

const createFoodCollection = (scene) => {
	let foodName = 'food';
	loopCreateObjects(quantityFood, foodName, FoodCollection, createSkeletonFood, scene);
};

const createSkeletonFood = (index, scene) => {
	const [randX, randZ] = setRandomCoords(6);
	var geometry = new THREE.SphereBufferGeometry(
		foodSkeleton.radius,
		foodSkeleton.widthSgementes,
		foodSkeleton.heightSegmets
	);
	var material = new THREE.MeshBasicMaterial({ color: 0xff00f7 });
	var foodBody = new THREE.Mesh(geometry, material);
	scene.add(foodBody);
	foodBody.position.x = randX;
	foodBody.position.z = randZ;
	foodBody.position.y = 1.6;
	foodBody.name = 'food' + index;
	foodObjectsCollision.push(foodBody);
	return foodBody;
};

export const initFood = (scene, numFood, getFoodRandom) => {
	FoodCollection = {};
	foodObjectsCollision = [];
	quantityFood = numFood;
	createFoodCollection(scene);
	return [FoodCollection, foodObjectsCollision, quantityFood];
};
