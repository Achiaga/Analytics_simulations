import * as THREE from 'three';

var BlablapCollisionDist = 3;

export function detectBlablapCollision(eater, foodObjectsCollision, foodCollection, scene) {
	// Get the rotation matrix from dino
	var matrix = new THREE.Matrix4();
	matrix.extractRotation(eater.matrix);

	var directionFront = new THREE.Vector3(0, -0.2, 1);
	var directionFront1 = new THREE.Vector3(-0.3, -0.2, 1);
	var directionFront2 = new THREE.Vector3(0.3, -0.2, 1);

	directionFront.applyMatrix4(matrix);
	directionFront1.applyMatrix4(matrix);
	directionFront2.applyMatrix4(matrix);
	// paintRayCaster(eater.position, directionFront);

	var rayCasterF = new THREE.Raycaster(eater.position, directionFront);
	var rayCasterF1 = new THREE.Raycaster(eater.position, directionFront1);
	var rayCasterF2 = new THREE.Raycaster(eater.position, directionFront2);

	if (foodDetect(rayCasterF, BlablapCollisionDist, eater, foodObjectsCollision, foodCollection, scene))
		return true;
	if (foodDetect(rayCasterF1, BlablapCollisionDist, eater, foodObjectsCollision, foodCollection, scene))
		return true;
	if (foodDetect(rayCasterF2, BlablapCollisionDist, eater, foodObjectsCollision, foodCollection, scene))
		return true;
	return false;
}

function foodDetect(ray, distance, eater, foodObjectsCollision, foodCollection, scene) {
	var intersects = ray.intersectObjects(foodObjectsCollision);
	for (var i = 0; i < intersects.length; i++) {
		// Check if there's a collision
		if (intersects[i].distance < distance && !eater.userData.feed) {
			eater.userData.eatenFood = 1;

			//Remove Object From Scene
			var selectedObject = scene.getObjectByName(intersects[i].object.name);
			scene.remove(selectedObject);

			// Delete From Food Collection
			const nameColladiblaFood = intersects[i].object.name;
			delete foodCollection[nameColladiblaFood];

			// Remove Collidable Object
			let index = 1;
			if (nameColladiblaFood.length === 6) index = 2;
			var indexKey = nameColladiblaFood.substr(nameColladiblaFood.length - index);
			foodObjectsCollision.splice(indexKey, 1);

			return true;
		}
	}
	return false;
}
