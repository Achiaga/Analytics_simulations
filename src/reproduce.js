// Handle Restart
export const reproduce = (eaterArmy, foodCollection, foodObjectsCollision, numEaters, scene) => {
	let eatersReproduce = 0;
	Object.keys(eaterArmy).forEach((blaWarrior, index) => {
		if (eaterArmy[blaWarrior].userData.feed) {
			// eaterArmy[blaWarrior].userData.reproduce = true;
			eatersReproduce += 2;
		}
	});
	for (var i = scene.children.length - 1; i >= 4; i--) {
		scene.remove(scene.children[i]);
	}
	if (eatersReproduce === 0) console.log('All DEAD');
	else console.log(eatersReproduce, 'did reproduce');

	resetGlobalValues(eaterArmy, foodCollection, foodObjectsCollision);
	return eatersReproduce;
};

const resetGlobalValues = (eaterArmy, foodCollection, foodObjectsCollision) => {
	eaterArmy = {};
	foodCollection = {};
	foodObjectsCollision = [];
};
