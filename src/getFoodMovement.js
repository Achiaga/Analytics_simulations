import { getNextPos, deleteElScene } from './utils';

let eaterArrivedDest = (eater) => {
	return (
		Math.abs(eater.position.x.toFixed(1) - eater.userData.outDestX.toFixed(1)) < 2 &&
		Math.abs(eater.position.z.toFixed(1) - eater.userData.outDestZ.toFixed(1)) < 2
	);
};

let finishCont = 0;
let arrivedFoodCont = 0;

export function getFoodMovement(eater, numEaters, numKrans, vel, modifyReproduce, scene) {
	if (!eater || !eater.position || eater.userData.hasFinsihed) return;

	if (!eater.userData.feed) {
		eater.userData.actualDestX = eater.userData.foodPosX;
		eater.userData.actualDestZ = eater.userData.foodPosZ;
	}

	const { x: posX, z: posZ } = eater.position;
	const { actualDestX, actualDestZ } = eater.userData;

	if (Math.abs(posX - actualDestX) < 1 && Math.abs(posZ - actualDestZ) < 1) {
		if (!eater.userData.feed) arrivedFoodCont += 1;
		eater.userData.feed = true;
		if (arrivedFoodCont === numEaters + numKrans && !eater.userData.hasMoved) {
			setInterval(() => {
				let foodName = eater.userData.foodName;
				deleteElScene(foodName, scene);
				eater.userData.actualDestX = eater.userData.outDestX;
				eater.userData.actualDestZ = eater.userData.outDestZ;
			}, 1000);
			eater.userData.hasMoved = true;
		}
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

		if (finishCont === numEaters + numKrans) {
			finishCont = 0;
			// modifyReproduce(true);
			return;
		}
	}
	return;
}
