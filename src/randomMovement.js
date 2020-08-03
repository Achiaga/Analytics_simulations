import { detectBlablapCollision } from './collision';
import { getNextPos } from './utils';

let eaterArrivedDest = (eater) => {
	return (
		Math.abs(eater.position.x.toFixed(1) - eater.userData.outDestX.toFixed(1)) < 1 &&
		Math.abs(eater.position.z.toFixed(1) - eater.userData.outDestZ.toFixed(1)) < 1
	);
};

let finishCont = 0;

export function randomMovement(eater, vel, foodObjectsCollision, foodCollection, numBlablaps, scene) {
	if (!eater || !eater.position || eater.userData.hasFinsihed) return;

	const { x: posX, z: posZ } = eater.position;
	const { actualDestX, actualDestZ } = eater.userData;

	// Check collision or arrived to half destination
	if (
		(Math.abs(posX - actualDestX) < 0.5 && Math.abs(posZ - actualDestZ) < 0.5) ||
		(detectBlablapCollision(eater, foodObjectsCollision, foodCollection, scene) && !eater.userData.feed)
	) {
		if (eater.userData.eatenFood > 0) eater.userData.feed = true;
		eater.userData.hasMoved = true;
		eater.userData.actualDestX = eater.userData.outDestX;
		eater.userData.actualDestZ = eater.userData.outDestZ;
		// setTimeout(() => {}, 1000);
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

		if (finishCont === numBlablaps) {
			finishCont = 0;
			setTimeout(() => {
				// handleRestart();
			}, 1000);
		}
	}
	return;
}
