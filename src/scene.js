import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

let camera, scene, light, directionalLight, renderer, sky, sun;

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.25;
const far = 1000;
const sceneBgColor = 0xfffffff;
const cameraPosX = 18;
const cameraPosY = 15;
const cameraPosZ = -35;
const cameraLookAtX = 0;
const cameraLookAtY = 1;
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

	let pointlLight = new THREE.PointLight(0xffffff, 200, 200);
	pointlLight.position.set(0, 80, 0);

	directionalLight = new THREE.DirectionalLight(0xffffff, 4);
	directionalLight.position.set(100, 100, 100);

	let directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
	directionalLight2.position.set(0, -4, 0);

	return [light, pointlLight, directionalLight, directionalLight2];
};

export const initScene = () => {
	camera = initCamera();
	scene = createScene();

	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true,
	});

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.gammaOutput = true;
	renderer.gammaFactor = 2.2;

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 20;
	controls.maxDistance = 400;

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	sky = new Sky();
	sky.scale.setScalar(450000);
	scene.add(sky);
	sky.name = 'skybox';

	sun = new THREE.Vector3();

	var effectController = {
		turbidity: 1.2,
		rayleigh: 3.113,
		mieCoefficient: 0,
		mieDirectionalG: 0.096,
		inclination: 0.9, // elevation / inclination
		azimuth: 0, // Facing front,
		exposure: 0.35,
	};

	var uniforms = sky.material.uniforms;
	uniforms['turbidity'].value = effectController.turbidity;
	uniforms['rayleigh'].value = effectController.rayleigh;
	uniforms['mieCoefficient'].value = effectController.mieCoefficient;
	uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

	console.log(uniforms);

	var theta = Math.PI * (effectController.inclination - 0.5);
	var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

	console.log(theta, phi);

	sun.x = -0.2;
	sun.y = 0.05;
	sun.z = 0.2;

	uniforms['sunPosition'].value.copy(sun);

	renderer.toneMappingExposure = effectController.exposure;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.5;
	renderer.render(scene, camera);

	window.addEventListener('resize', function () {
		var width = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	//LIGHT
	const [light, pointlLight, directionalLight, directionalLight2] = initLight();
	scene.add(light);
	scene.add(pointlLight);
	scene.add(directionalLight);
	scene.add(directionalLight2);

	return [scene, camera, renderer];
};
