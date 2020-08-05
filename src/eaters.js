import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setRandomCoords, setOriginPostion } from './utils';

let loader = new GLTFLoader();

let quantityEaters, quantityKrans, totalOrganism;
let eatersArmy = {};

const blablapSkeleton = {
	x: 1,
	y: 0.3,
	z: 0.2,
};

const createBlablapBody = (callback, blaWarrior, eaterIndex, foodSelected, scene) => {
	const [positionX, positionZ] = setOriginPostion(eaterIndex, totalOrganism, 15);
	const [actualDestX, actualDestZ] = setRandomCoords(7);
	const [outDestX, outDestZ] = [positionX, positionZ];
	const raceEater = eaterIndex < quantityEaters ? 'blabla.gltf' : 'redBlabla.gltf';
	const raceType = eaterIndex < quantityEaters ? 'blabla' : 'kran';

	return loader.load(
		raceEater,
		function (gltf) {
			let blablap = gltf.scene;
			scene.add(blablap);
			blablap.name = 'blablap' + eaterIndex;

			blablap.position.x = positionX;
			blablap.position.z = positionZ;
			blablap.position.y = 1.8;

			blablap.userData = {
				eatenFood: 0,
				feed: false,
				reproduce: false,
				hasFinsihed: false,
				race: raceType,
				...blablap.position,
				actualDestX: actualDestX,
				actualDestZ: actualDestZ,
				foodName: foodSelected.name,
				foodPosX: foodSelected.position.x,
				foodPosZ: foodSelected.position.z,
				outDestX: outDestX,
				outDestZ: outDestZ,
			};
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

const loopCreateEmptyObjects = (num, blablaname, kransname, obj) => {
	let name;
	for (var i = 0; i < num; i++) {
		name = i < quantityEaters ? blablaname : kransname;
		obj[`${name}_${i + 1}`] = {};
	}
};

const createeatersArmy = () => {
	const BlablaName = 'bla';
	const KransName = 'kran';
	loopCreateEmptyObjects(totalOrganism, BlablaName, KransName, eatersArmy);
};

const populateArmy = (foodCollection, scene) => {
	let foodSelectedArray = [];
	createeatersArmy();
	Object.keys(eatersArmy).forEach((body, eaterIndex) => {
		let randFood = Math.round(Math.random() * Object.keys(foodCollection).length - 1);
		let foodSelected = foodCollection[Object.keys(foodCollection)[randFood]];
		// foodSelectedArray.push(foodSelected.name);
		// console.log(foodSelectedArray);
		createBlablapBody(addPropseatersArmy, body, eaterIndex, foodSelected, scene);
	});
};

const createSkeletonBlablap = (blablap, eaterIndex) => {
	var geometry = new THREE.BoxGeometry(blablapSkeleton.x, blablapSkeleton.y, blablapSkeleton.z);
	var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	var cube = new THREE.Mesh(geometry, material);
	blablap.add(cube);
	cube.name = 'cube' + eaterIndex;
	cube.position.y = 0;
	cube.position.z = -0.5;
};

const addPropseatersArmy = (blablap, blaWarrior, eaterIndex) => {
	eatersArmy[blaWarrior] = blablap;
	createSkeletonBlablap(blablap, eaterIndex);
};

export const initEaters = (scene, numEaters, numKrans, foodCollection) => {
	eatersArmy = {};
	quantityEaters = numEaters;
	quantityKrans = numKrans;
	totalOrganism = quantityEaters + quantityKrans;
	console.log(foodCollection);
	populateArmy(foodCollection, scene);
	return eatersArmy;
};
