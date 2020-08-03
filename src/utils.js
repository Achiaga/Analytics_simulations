//GAME MATHS
function getYPositionOnCircle(radius, randX) {
	return Math.sqrt(radius * radius - randX * randX);
}

function getRadomPositionToRaidus(radius) {
	return Math.random() * radius;
}

export function getRandomPositiveOrNegative(value) {
	const getPositiveOrNegative = Math.round(Math.random()) === 1 ? 1 : -1;
	return value * getPositiveOrNegative;
}

export function setRandomCoords(radius, circle) {
	const randX = getRandomPositiveOrNegative(getRadomPositionToRaidus(radius));
	if (circle) {
		const randZ = getRandomPositiveOrNegative(getYPositionOnCircle(radius, randX));
		return [randX, randZ];
	}
	const randZ = getRandomPositiveOrNegative(getRadomPositionToRaidus(radius));
	return [randX, randZ];
}

//MOVEMENT MATHS
export function getNextPos(x1, z1, x2, z2, vel) {
	const distX = x2 - x1;
	const distZ = z2 - z1;
	const dist = Math.sqrt(distX * distX + distZ * distZ);
	const ratio = vel / dist;
	const x_move = ratio * distX;
	const y_move = ratio * distZ;
	const new_x_pos = x_move + x1;
	const new_y_pos = y_move + z1;
	return [new_x_pos, new_y_pos];
}

// Collision Graphic Helper
function paintRayCaster(pointA, direction, scene) {
	// Draw a line from pointA in the given direction at distance 100
	direction.normalize();

	var distance = 5; // at what distance to determine pointB

	var pointB = new THREE.Vector3();
	pointB.addVectors(pointA, direction.multiplyScalar(distance));

	var geometry = new THREE.Geometry();
	geometry.vertices.push(pointA);
	geometry.vertices.push(pointB);
	var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
	var line = new THREE.Line(geometry, material);
	scene.add(line);
}

// Check if out of Boundaries
const boundariesCheck = (numX, numZ) => {
	numX = Math.abs(numX);
	numZ = Math.abs(numZ);
	if (numZ >= Math.sqrt(15.5 * 15.5 - numX * numX)) {
		console.log('Out of borders');
	} else if (numX >= Math.sqrt(15.5 * 15.5 - numZ * numZ)) {
		console.log('Out of boundaries');
	}
};
