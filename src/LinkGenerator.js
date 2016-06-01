import URI from 'urijs'

export default class LinkGenerator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  makeHref (api, operationSpec, params) {
    const {host, basePath} = api
    const scheme = api.schemes[0]
    const path = operationSpec.url
    let href = `${scheme}://${host}${basePath}${path}`
    Object.keys(params).forEach(key => {
      const rex = new RegExp(`\{${key}\}`)
      if (rex.test(href)) {
        href = href.replace(rex, params[key])
        delete params[key]
      }
    })
    return new URI(href).query(params).toString()
  }

  toOperation (operationSpec, params = {}) {
    const baseUri = `/operation/${operationSpec.id}/try-it`
    const queryParams = {}
    Object.keys(params).forEach(key => { queryParams[`param-${key}`] = params[key] })
    const newUrl = new URI(baseUri).query(queryParams).toString()
    return newUrl
  }
}
