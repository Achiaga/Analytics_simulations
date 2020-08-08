import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export const initGround = (scene) => {
	loader.load(
		'landBlabla.gltf',
		function (gltf) {
			let land = gltf.scene;
			scene.add(land);
			land.name = 'land';

			land.position.x = 0;
			land.position.z = 0;
			land.position.y = -1;
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
