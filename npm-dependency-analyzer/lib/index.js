'use strict';

module.exports = getDependencyGraph;

const { exec } = require('executive');

const commands = {
	'--production': 'npm ls --json --prod', //Display only the dependency tree for packages in dependencies.
	'--development': 'npm ls --json --dev' //Display only the dependency tree for packages in devDependencies.
};

function getDependencyGraph(command, cb) {
	const commandString = commands[command];
	console.log(`Executing command: ${command}`);
	if (command) {
		exec(commandString, (error, stdout, stderr) => {
			if (error) {
				console.log('Error: ' + error);
				console.log('Standard Error: ' + stderr);
			}
			cb(command + '.txt', stdout);
		});
	} else {
		console.log(`Invalid command received: ${command}. \n Commands available: \n\t--production \n\t--development`);
		throw new Error('Invalid arguments');
	}
}