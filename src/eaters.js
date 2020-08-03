import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setRandomCoords, getRandomPositiveOrNegative } from './utils';

let loader = new GLTFLoader();

let blablapArmy = {};
let numEaters;

const blablapSkeleton = {
	x: 1,
	y: 0.3,
	z: 0.2,
};

const createBlablapBody = (callback, blaWarrior, index, scene) => {
	const [positionX, positionZ] = setOriginPostion(index);
	const [actualDestX, actualDestZ] = setRandomCoords(7);
	const [outDestX, outDestZ] = setRandomCoords(15.5, 'circle');
	let blablap;
	return loader.load(
		'blabla.gltf',
		function (gltf) {
			blablap = gltf.scene;
			scene.add(blablap);

			blablap.name = 'blablap' + index;

			blablap.position.x = positionX;
			blablap.position.z = positionZ;
			blablap.position.y = 1.8;

			blablap.userData = {
				...blablap.position,
				actualDestX: actualDestX,
				actualDestZ: actualDestZ,
				outDestX: outDestX,
				outDestZ: outDestZ,
				eatenFood: 0,
				feed: false,
				reproduce: false,
				hasFinsihed: false,
			};

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

const loopArmyObjects = (num, name, obj) => {
	for (var i = 0; i < num; i++) {
		blablapArmy[`name${i}`] = {};
	}
};

// const createBlablapArmy = () => {
// 	const BlablapName = 'bla';
// 	for (var i = 0; i < numEaters; i++) {
// 		let blablap = BlablapName + i;
// 		blablapArmy = {
// 			...blablapArmy,
// 			[blablap]: {},
// 		};
// 	}
// };

const createBlablapArmy = () => {
	const BlablapName = 'bla';
	loopArmyObjects(numEaters, BlablapName, blablapArmy);
};

const populateArmy = (scene) => {
	createBlablapArmy();
	Object.keys(blablapArmy).forEach((body, index) =>
		createBlablapBody(addPropsBlablapArmy, body, index, scene)
	);
};

const createSkeletonBlablap = (blablap, index) => {
	var geometry = new THREE.BoxGeometry(blablapSkeleton.x, blablapSkeleton.y, blablapSkeleton.z);
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var cube = new THREE.Mesh(geometry, material);
	blablap.add(cube);
	cube.name = 'cube' + index;
	cube.position.y = 0;
	cube.position.z = -0.5;
};

const addPropsBlablapArmy = (blablap, blaWarrior, index) => {
	blablapArmy[blaWarrior] = blablap;
	createSkeletonBlablap(blablap, index);
};

function setOriginPostion(blablaIndex) {
	const angleBlabap = getBlablaInitalPos(blablaIndex);
	let posX = Math.cos(angleBlabap) * 14;
	let posY = Math.sin(angleBlabap) * 14;
	return [posX, posY];
}

function convertDegreesToRads(degrees) {
	return (degrees * Math.PI) / 180;
}

function getBlablaInitalPos(blablaIndex) {
	const degreesPerBlaBla = 360 / numEaters;
	return convertDegreesToRads(degreesPerBlaBla) * blablaIndex;
}

export const initEaters = (scene, numBlablaps) => {
	numEaters = numBlablaps;
	populateArmy(scene);
	return blablapArmy;
};
