import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let camera, scene, light, directionalLight, renderer;

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.25;
const far = 1000;
const sceneBgColor = 0xfffffff;
const cameraPosX = -12;
const cameraPosY = 18;
const cameraPosZ = 33;
const cameraLookAtX = 0;
const cameraLookAtY = 2;
const cameraLookAtZ = 0;

const initCamera = () => {
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(cameraPosX, cameraPosY, cameraPosZ);
	camera.lookAt(new THREE.Vector3(cameraLookAtX, cameraLookAtY, cameraLookAtZ));
	return camera;
};

const createScene = () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneBgColor);
	return scene;
};

const initLight = () => {
	light = new THREE.HemisphereLight(0xffffff, 0x444444);
	light.position.set(0, 20, 0);

	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, 20, 10);

	return [light, directionalLight];
};

export const initScene = () => {
	camera = initCamera();
	scene = createScene();

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});

	new OrbitControls(camera, renderer.domElement);

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', function () {
		var width = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	//LIGHT
	const [light, directionalLight] = initLight();
	scene.add(light);
	scene.add(directionalLight);

	return [scene, camera, renderer];
};
