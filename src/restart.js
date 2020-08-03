// Handle Restart
export const handleRestart = () => {
	let numBlablasReproduce = 0;
	Object.keys(blablapArmy).forEach((blaWarrior, index) => {
		if (blablapArmy[blaWarrior].userData.feed) {
			// blablapArmy[blaWarrior].userData.reproduce = true;
			numBlablasReproduce += 2;
		}
	});
	for (var i = scene.children.length - 1; i >= 4; i--) {
		scene.remove(scene.children[i]);
	}
	if (numBlablasReproduce === 0) console.log('All DEAD');
	else console.log(numBlablasReproduce, 'did reproduce');
	blablapArmy = {};
	numBlablaps = numBlablasReproduce;
	handleInitBlabla();
	foodCollection = {};
	foodObjectsCollision = [];
	handleInitFood();
	return;
};
