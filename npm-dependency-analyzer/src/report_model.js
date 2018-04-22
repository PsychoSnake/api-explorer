
module.exports.Report = class Report {
  constructor (id, version, name, description) {
    this.id = id
    this.version = version
    this.name = name
    this.description = description
    this.dependencies = []
  }
}

/**
 * Class representing the element Dependency on the report generated
 */
module.exports.Dependency = class Dependency {
  /**
   * Constructor for a Dependency. Initializes all properties that cannot be null (are arrays) and verifies required properties
   * @param {Object} options This object can have 0 to 2 properties, them being title and main_version
   */
  constructor (options) {
    if (options !== undefined && (options.title === undefined || options.main_version === undefined)) {
      throw new Error(`Invalid parameters received:\n\t Everyone needs to be defined\n\t\t
        -title: ${options.title} \n\t\t-main_version: ${options.main_version}`)
    }
    Object.assign(this, options)
    this.private_versions = []
    this.license = []
    this.hierarchy = []
    this.vulnerabilities = []
  }

  initializeDependency (options) {
    this.title = options.title
    this.main_version = options.main_version
  }

  insertHierarchy (options) {
    this.hierarchy.push(options.hierarchy)
    this.private_versions.push(options.private_versions)
  }
}

// TODO: i dont have recomendation and cvss_score
module.exports.Vulnerability = class Vulnerability {
  constructor (vulnerability_title, module_title, description, references, versions) {
    this.vulnerability_title = vulnerability_title
    this.module_title = module_title
    this.description = description
    this.references = references
    this.affected_version = versions
  }
}

module.exports.License = class License {
  constructor (title, origin) {
    this.title = title
    this.origins = [origin]
  }
}
