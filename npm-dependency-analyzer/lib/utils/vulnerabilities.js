'use strict';

module.exports = { getVulnerabilities };

const exec = require('executive');

function getVulnerabilities() {

	exec('nsp check --reporter json', (error, stdout, stderr) => {
		if (error) {
			console.log('Error: ' + error);
			console.log('Standard Error: ' + stderr);
		}
		console.log('Vulnerabilities: \n' + stdout);
	});
}