'use strict'

const fileManager = require('./file-manager')

const {License} = require('../report_model')

const debug = require('debug')('Licenses')
const parse = require('spdx-expression-parse')
const correct = require('spdx-correct')
const fetch = require('isomorphic-fetch')

const seeLicenseInFileRegex = /SEE LICENSE IN (.*?)$/i

// TODO: Logic - [Search package.json, Search in github or npm]

function filterLicenseInFile (fileData) {

}

function getCorrectLicense (licenseName) {
  try {
    const correctedVersion = correct(licenseName)
    const parsedLicense = parse(correctedVersion)
    return new License(parsedLicense, 'Found in license property of package.json')
  } catch (err) {

  }
}

function getLocalLicense (pkg) {
  return new Promise((resolve, reject) => {
    if (pkg.license !== undefined && pkg.license !== null) {
      if (pkg.license.constructor.name === 'Object') {
        return resolve(getCorrectLicense(pkg.license.type))
      }

      if (pkg.license.constructor.name === 'Array') {
        return resolve(pkg.license.map(value => {
          return getCorrectLicense(value)
        }))
      }

      const licenseFile = pkg.license.match(seeLicenseInFileRegex)
      if (licenseFile != null) {
        fileManager.readFile('./node_modules/' + pkg._location + '/' + licenseFile, (err, data) => {
          if (err) {
            throw new Error(err.message)
          }
          filterLicenseInFile(data)
        })
        return resolve()
      }

      return resolve(getCorrectLicense(pkg.license))
    }
  })
}

function getLicense (dependency, depPkg) {
  getLocalLicense(depPkg)
    .then(license => {
      if (license) {
        if (license.constructor.name === 'Array') {
          dependency.license.push(...license)
        } else {
          dependency.license.push(license)
        }
      }
    })
    .catch(err => {
      debug('Error with: ' + depPkg.name + '\n' + err)
    })

  // getGitHubLicense()
}

module.exports = getLicense

/*
function getLicences ({dependencies}) {
  debug('Checking Licenses')

  const keyQuantity = Object.keys(dependencies).length
  let count = 0
  const objToWrite = {}

  for (let dependency in dependencies) {
    objToWrite[dependency.name] = dependency.license

    if (++count == keyQuantity) {
      writeFile('licenses.json', JSON.stringify(objToWrite))
      debug('Licenses checked with success')
    }
  }
}

function writeFile (fileName, data) {
  const fileDescriptor = openSync('build/' + fileName, 'w')
  writeFileSync(fileDescriptor, data, 'utf-8')
  closeSync(fileDescriptor)
}
*/
