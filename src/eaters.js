import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setRandomCoords, getRandomPositiveOrNegative } from './utils';

let loader = new GLTFLoader();

let eatersArmy = {};
let quantityEaters;

const blablapSkeleton = {
	x: 1,
	y: 0.3,
	z: 0.2,
};

const createBlablapBody = (callback, blaWarrior, eaterIndex, scene) => {
	const [positionX, positionZ] = setOriginPostion(eaterIndex);
	const [actualDestX, actualDestZ] = setRandomCoords(7);
	const [outDestX, outDestZ] = setRandomCoords(15.5, 'circle');
	let blablap;
	return loader.load(
		'blabla.gltf',
		function (gltf) {
			blablap = gltf.scene;
			scene.add(blablap);

			blablap.name = 'blablap' + eaterIndex;

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

const loopCreateEmptyObjects = (num, name, obj) => {
	for (var i = 0; i < num; i++) {
		obj[`${name}${i}`] = {};
	}
};

const createeatersArmy = () => {
	const BlablapName = 'bla';
	loopCreateEmptyObjects(quantityEaters, BlablapName, eatersArmy);
};

const populateArmy = (scene) => {
	createeatersArmy();
	Object.keys(eatersArmy).forEach((body, eaterIndex) =>
		createBlablapBody(addPropseatersArmy, body, eaterIndex, scene)
	);
};

const createSkeletonBlablap = (blablap, eaterIndex) => {
	var geometry = new THREE.BoxGeometry(blablapSkeleton.x, blablapSkeleton.y, blablapSkeleton.z);
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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

function setOriginPostion(eaterIndex) {
	const angleEater = getBlablaInitalPos(eaterIndex);
	let posX = Math.cos(angleEater) * 14;
	let posY = Math.sin(angleEater) * 14;
	return [posX, posY];
}

function convertDegreesToRads(degrees) {
	return (degrees * Math.PI) / 180;
}

function getBlablaInitalPos(eaterIndex) {
	const degreesPerBlaBla = 360 / quantityEaters;
	return convertDegreesToRads(degreesPerBlaBla) * eaterIndex;
}

export const initEaters = (scene, numEaters) => {
	eatersArmy = {};
	quantityEaters = numEaters;
	populateArmy(scene);
	return eatersArmy;
};
