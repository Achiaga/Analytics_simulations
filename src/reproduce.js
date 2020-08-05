// Handle Restart
let generation = 0;

export const reproduce = (eaterArmy, foodCollection, foodObjectsCollision, numEaters, numKrans, scene) => {
	let eatersReproduce = 0;
	let quantityEaters = 0;
	let quantityKrans = 0;
	Object.keys(eaterArmy).forEach((blaWarrior, index) => {
		if (eaterArmy[blaWarrior].userData.feed) {
			// eaterArmy[blaWarrior].userData.reproduce = true;
			let raceType = eaterArmy[blaWarrior].userData.race;
			raceType === 'blabla' ? (quantityEaters += 2) : (quantityKrans += 2);
		}
	});
	for (var i = scene.children.length - 1; i >= 4; i--) {
		scene.remove(scene.children[i]);
	}
	eatersReproduce = quantityEaters + quantityKrans;
	if (eatersReproduce === 0) console.log('All DEAD');
	else {
		generation += 1;
		console.log(eatersReproduce, 'did reproduce');
		console.log(generation, 'generation');
	}
	console.log(scene);
	resetGlobalValues(eaterArmy, foodCollection, foodObjectsCollision);
	return [quantityEaters, quantityKrans];
};

const resetGlobalValues = (eaterArmy, foodCollection, foodObjectsCollision) => {
	eaterArmy = {};
	foodCollection = {};
	foodObjectsCollision = [];
};
