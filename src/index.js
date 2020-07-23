import _ from 'lodash';
import './style.css';
import Donut from './donut.png';
import printMe from './print.js';
import Data from './data.xml';

function component() {
	const element = document.createElement('div');

	// Lodash, currently included via a script, is required for this line to work
	// Lodash, now imported by this script
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');
	element.classList.add('hello');
	const btn = document.createElement('button');
	// Add the image to our existing div.
	btn.innerHTML = 'Click me and check the console!';
	btn.onclick = printMe;

	element.appendChild(btn);

	console.log(Data);

	return element;
}
let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
	module.hot.accept('./print.js', function () {
		console.log('Accepting the updated printMe module!');
		document.body.removeChild(element);
		element = component(); // Re-render the "component" to update the click handler
		document.body.appendChild(element);
	});
}
