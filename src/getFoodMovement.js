import { getNextPos } from './utils';

let eaterArrivedDest = (eater) => {
	return (
		Math.abs(eater.position.x.toFixed(1) - eater.userData.outDestX.toFixed(1)) < 1 &&
		Math.abs(eater.position.z.toFixed(1) - eater.userData.outDestZ.toFixed(1)) < 1
	);
};

let finishCont = 0;

export function getFoodMovement(eater, food, numEaters, vel) {
	if (!eater || !eater.position || eater.userData.hasFinsihed) return;
	// if (!food || !food.position) return;
	if (!eater.userData.feed) {
		eater.userData.actualDestX = food.position.x;
		eater.userData.actualDestZ = food.position.z;
	}
	const { x: posX, z: posZ } = eater.position;
	const { actualDestX, actualDestZ } = eater.userData;

	if (Math.abs(posX - actualDestX) < 0.05 && Math.abs(posZ - actualDestZ) < 0.05 && !eater.userData.feed) {
		setInterval(() => {
			eater.userData.feed = true;
			eater.userData.hasMoved = true;
			eater.userData.actualDestX = eater.userData.outDestX;
			eater.userData.actualDestZ = eater.userData.outDestZ;
			console.log('enter');
		}, 1000);
		return;
	}
	const [new_x_pos, new_z_pos] = getNextPos(posX, posZ, actualDestX, actualDestZ, vel);
	eater.lookAt(new_x_pos, 1.8, new_z_pos);
	eater.position.x = new_x_pos;
	eater.position.z = new_z_pos;
	// Check arrived to destination
	if (eaterArrivedDest(eater) && eater.userData.hasMoved) {
		eater.userData.hasFinsihed = true;
		finishCont += 1;

		if (finishCont === numEaters) {
			console.log('enter');
			finishCont = 0;
			modifyReproduce(true);
			return;
		}
	}
	return;
}
