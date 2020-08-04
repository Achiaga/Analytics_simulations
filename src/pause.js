import './style.css';

export function initButton(modifyPause) {
	let button = document.createElement('button');
	button.innerHTML = 'Pause';

	var body = document.getElementsByTagName('body')[0];
	body.appendChild(button);

	button.addEventListener('click', function (e) {
		const isPlaying = e.target.innerHTML === 'Restart';
		if (!isPlaying) e.target.innerHTML = 'Restart';
		if (isPlaying) e.target.innerHTML = 'Pause';
		modifyPause(isPlaying);
		return;
	});
	return;
}
