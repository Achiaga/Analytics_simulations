// Handle Restart
let generation = 0;

export const reproduce = (
	eaterArmy,
	foodCollection,
	eatersFoodMatch,
	foodObjectsCollision,
	getFoodRandom,
	scene
) => {
	let eatersReproduce = 0;
	let quantityEaters = 0;
	let quantityKrans = 0;
	Object.keys(eaterArmy).forEach((blaWarrior, index) => {
		if (!getFoodRandom) {
			let raceType = eaterArmy[blaWarrior].userData.race;
			if (typeof eatersFoodMatch[blaWarrior] === 'undefined') {
				raceType === 'blabla' ? (quantityEaters += 2) : (quantityKrans += 2);
			}
			if (eatersFoodMatch[blaWarrior] === 'shared') {
				quantityEaters += 1;
			}
			if (eatersFoodMatch[blaWarrior] === 'take') {
				let halfProbSurvive = Math.round(Math.random()) === 1 ? 1 : 0;
				let halfProbreprod = Math.round(Math.random()) === 1 ? 2 : 1;
				console.log(halfProbSurvive);
				console.log(halfProbreprod);
				raceType === 'blabla' ? (quantityEaters += halfProbSurvive) : (quantityKrans += halfProbreprod);
			}
			if (eatersFoodMatch[blaWarrior] === 'fight') {
				quantityKrans += 0;
			}
		}

		if (getFoodRandom && eaterArmy[blaWarrior].userData.feed) {
			let raceType = eaterArmy[blaWarrior].userData.race;
			raceType === 'blabla' ? (quantityEaters += 2) : (quantityKrans += 2);
		}
	});
	// Quantity Reproduce of each race
	eatersReproduce = quantityEaters + quantityKrans;
	if (eatersReproduce === 0) console.log('All DEAD');
	else {
		generation += 1;
		console.log(eatersReproduce, 'did reproduce');
		console.log(generation, 'generation');
	}

	resetGlobalValues(eaterArmy, foodCollection, foodObjectsCollision, eatersFoodMatch, scene);

	return [quantityEaters, quantityKrans];
};

const resetGlobalValues = (eaterArmy, foodCollection, foodObjectsCollision, eatersFoodMatch, scene) => {
	eaterArmy = {};
	foodCollection = {};
	foodObjectsCollision = [];
	eatersFoodMatch = {};
	for (var i = scene.children.length - 1; i >= 4; i--) {
		scene.remove(scene.children[i]);
	}
};
