export function getFoodMovement(eater, food, vel) {
	if (!eater || !eater.position) return;
	if (!food || !food.position) return;
	const { x: posX, z: posZ } = eater.position;
	const { x: originX, z: oroginZ } = eater.position;
	let { x: destX, z: destZ } = food.position;
	posX > destX && (vel *= -1);
	if (Math.abs(posX - destX) < 0.5 && Math.abs(posZ - destZ) < 0.5) {
		setTimeout(() => {
			destX = originX;
			destZ = oroginZ;
		}, 1000);
		return;
	}
	const [new_x_pos, new_z_pos] = getNextPos(posX, posZ, destX, destZ);
	eater.lookAt(new_x_pos, 1.8, new_z_pos);
	eater.position.x = new_x_pos;
	eater.position.z = new_z_pos;
	return;
}
