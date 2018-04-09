#!/usr/bin/env node

/* 
 * Command that reads the package.json from the project this module is a dependency,
 * and writes it's content to a new file on a build folder
 */  

/* eslint-disable */

const { getDependencyGraph } =  require('../lib/index')
const { existsSync, mkdirSync, openSync, writeFileSync, closeSync } = require('fs')
const { getVulnerabilities } = require('../lib/utils/vulnerabilities')


getVulnerabilities()

/*
if(!existsSync('./build')) 
	mkdirSync('./build')

getDependencyGraph('--production', writeFile)

getDependencyGraph('--development', writeFile)


function writeFile(fileName, data){
	const fileDescriptor = openSync('build/'+fileName, 'w')
	writeFileSync(fileDescriptor, data, 'utf-8')
	closeSync(fileDescriptor)
}
*/