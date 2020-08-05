import * as THREE from 'three';
import { setRandomCoords, setUniformDistribution } from './utils';

const foodSkeleton = {
	radius: 0.25,
	widthSgementes: 20,
	heightSegmets: 20,
};

let quantityFood, random, distributionFood;
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
	let [posX, posZ] = setRandomCoords(6);
	if (!distributionFood) [posX, posZ] = setUniformDistribution(index, quantityFood);

	var geometry = new THREE.SphereBufferGeometry(
		foodSkeleton.radius,
		foodSkeleton.widthSgementes,
		foodSkeleton.heightSegmets
	);
	var material = new THREE.MeshBasicMaterial({ color: 0xff00f7 });
	var foodBody = new THREE.Mesh(geometry, material);
	scene.add(foodBody);
	foodBody.position.x = posX;
	foodBody.position.z = posZ;
	foodBody.position.y = 1.6;
	foodBody.name = 'food' + index;
	foodObjectsCollision.push(foodBody);
	if (!distributionFood) {
		var foodBodyb = new THREE.Mesh(geometry, material);
		foodBody.add(foodBodyb);
		foodBodyb.position.x += 0.4;
		foodBodyb.position.z += 0.4;
		foodBodyb.name = 'foodb' + index;
	}

	return foodBody;
};

export const initFood = (scene, numFood, getFoodRandom) => {
	FoodCollection = {};
	foodObjectsCollision = [];
	quantityFood = numFood;
	random = getFoodRandom;
	distributionFood = getFoodRandom;
	createFoodCollection(scene);
	return [FoodCollection, foodObjectsCollision, quantityFood];
};
