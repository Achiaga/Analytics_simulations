import * as THREE from 'three';

// Ground Variables
const groundRadius = 16;
const groundHeight = 0.6;
const groundSegments = 200;
const groundColor = 0x00000;
const developmentMode = false;
const groundEdgesColor = 0xfffffff;

export const initGround = (scene) => {
	// ground - plataform
	var geometry = new THREE.CylinderGeometry(
		groundRadius,
		groundRadius,
		groundHeight,
		groundSegments
	);
	var material = new THREE.MeshBasicMaterial({
		color: groundColor,
		wireframe: developmentMode,
	});
	var circle = new THREE.Mesh(geometry, material);
	scene.add(circle);

	circle.rotation.x = 0;
	circle.position.y = 1;
	circle.rotation.z = 0;

	// Ground edges
	var geo = new THREE.EdgesGeometry(circle.geometry);
	var mat = new THREE.LineBasicMaterial({
		color: groundEdgesColor,
		linewidth: 4,
	});
	var wireframe = new THREE.LineSegments(geo, mat);
	wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
	circle.add(wireframe);
};
