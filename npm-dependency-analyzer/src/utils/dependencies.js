'use strict'

const {Dependency} = require('../report_model')
const licenseManager = require('./licenses')
const fileManager = require('./file-manager')

const rtp = require('read-package-tree')
const debug = require('debug')('Dependencies')

const semver = require('semver')


/**
 * Gets all dependencies and builds an object after filtering into a ReportDependency
 * @param {Function} cb callback called when an error occurs or after filtering all dependencies
 */
function getDependencies (cb) {
  debug('Get dependencies')
  const dependencies = {}

  rtp('./', (err, data) => {
    if (err) {
      debug('Error getting dependencies')
      return cb(err)
    }
    const modules = data.children
    for (let module in modules) {
      const pkg = modules[module].package
      const version = semver.coerce(pkg.version).raw

      let dependency
      if (dependencies[pkg.name]) {
        dependency = dependencies[pkg.name]
        dependency.initializeDependency({title: pkg.name, version})
      } else {
        dependency = new Dependency({title: pkg.name, main_version: version})
        dependencies[pkg.name] = dependency
      }

      licenseManager(dependency, pkg)

      insertHierarchies(dependencies, { children: modules[module].children, pkg })
    }

    debug('Finished filtering dependencies')
    fileManager.writeBuildFile('only-dependencies.json', JSON.stringify(dependencies))
    cb(null, { pkg: data.package, dependencies })
  })
}

/**
 * Inserts all hierarchies of the received module. All the ones that it depends on are inserted in the property hierarchy with a new value
 * @param {Object} dependencies object to store all dependencies
 * @param {Object} module module to search for dependencies to insert hierarchy
 */
function insertHierarchies (dependencies, {children, pkg}) {
  const modules = { ...pkg.dependencies }

  for (let child in children) {
    const childPkg = children[child].package
    let dependency = dependencies[childPkg.name]
    const version = semver.coerce(pkg.version).raw

    if (modules && modules[childPkg.name]) {
      delete modules[childPkg.name]
    }

    if (!dependency) {
      dependency = new Dependency({title: pkg.name, main_version: version})

      dependency.private_versions.push(version)
      dependencies[childPkg.name] = dependency
    }

    dependency.insertHierarchy({
      hierarchy: pkg.name + '/v' + version,
      private_versions: childPkg.version })
  }

  // TODO: apenas as dependencias development do projeto principal e que sao instaladas
  for (let moduleName in modules) { // TODO: Estudar bem esta parte pois esta a aparecer dependencias inexistentes na pasta node_modules
    let dependency = dependencies[moduleName]
    if (!dependencies[moduleName]) {
      dependency = new Dependency()
      dependencies[moduleName] = dependency
    }

    dependency.hierarchy.push(pkg.name + '/v' + pkg.version)
  }
}

module.exports = {
  getDependencies
}
