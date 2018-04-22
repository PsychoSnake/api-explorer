'use strict'

module.exports = getVulnerabilities

const fetch = require('isomorphic-fetch')
const fileManager = require('./file-manager')
const semver = require('semver')

const debug = require('debug')('Vulnerabilities')
const {Vulnerability} = require('../report_model')
const RequestBody = require('../oss-fetch-body')

const getRequest = body => {
  return new Request('https://ossindex.net/v2.0/package', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
}

/**
 * Gets all vulnerabilities on the current project
 * Need to do POST and send all packages because sending a request for each dependency breaks the server for a bit
 */
async function getVulnerabilities (dependencies, cb) {
  debug('Checking Vulnerabilities')

  const requestBody = []

  for (let prop in dependencies) {
    const dependency = dependencies[prop]
    const versions = [dependency.main_version, ...dependency.private_versions]
    const minVersion = versions.sort(semver.compare)[0]

    requestBody.push(new RequestBody('npm', dependency.title, minVersion))
  }

  const response = await fetch(getRequest(requestBody))
  const body = await response.json()

  for (let prop in body) {
    const vulnerability = body[prop]
    if (!vulnerability.vulnerabilities) { continue }

    const vulnerabilities = vulnerability.vulnerabilities.map(elem => {
      return new Vulnerability(elem.title, vulnerability.name,
        elem.description, elem.references,
        elem.versions)
    })

    dependencies[vulnerability.name].vulnerabilities = vulnerabilities
  }

  fileManager.writeBuildFile('dependencies-vulnerabilities.json', JSON.stringify(dependencies))
  debug('End process')
}
