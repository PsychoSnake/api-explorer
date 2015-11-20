import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import configureStore from 'store/configureStore'
import Root from 'containers/Root'
import { load as loadSpec, apiConfigurations, headers } from 'actions/loadActionCreators'
import * as Loaders from 'infrastructure/loaders'
import widgetWrapper from 'infrastructure/WidgetWrapper'
import Url from 'infrastructure/Url'

import { TryOutWidgetTab, SpecWidgetTab, ResponseSchemaWidgetTab } from 'components'

const store = configureStore()

class APIExplorerConfigurator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  swagger1API (friendlyName, url, useProxy = false) {
    this.apiExplorer.addConfiguration(
      friendlyName,
      'Swagger1Loader',
      new Url(url, useProxy)
    )
    return this
  }

  swagger2API (friendlyName, url, useProxy = false) {
    this.apiExplorer.addConfiguration(
      friendlyName,
      'Swagger2Loader',
      new Url(url, useProxy)
    )
    return this
  }
}

class APIExplorerInterceptorConfigurator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  swagger1Interceptor (interceptor) {
    this.apiExplorer.addInterceptor(
      this.apiExplorer.SupportedLoaders.Swagger1Loader,
      interceptor
    )
    return this
  }

  swagger2Interceptor (interceptor) {
    this.apiExplorer.addInterceptor(
      this.apiExplorer.SupportedLoaders.Swagger2Loader,
      interceptor
    )
    return this
  }
}

class APIExplorerWidgetTabConfigurator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  addWidgetTab (name, component) {
    this.apiExplorer.addWidgetTab(name, component)
    return this
  }
}

class APIExplorerHeaderConfigurator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  addHeader (name, value) {
    this.apiExplorer.addHeader(name, value)
    return this
  }
}

class APIExplorer {
  constructor () {
    this.SupportedLoaders = {
      Swagger1Loader: 'Swagger1Loader',
      Swagger2Loader: 'Swagger2Loader'
    }

    this.Loaders = {}
    this.Loaders[this.SupportedLoaders.Swagger1Loader] = Loaders.Swagger1Loader
    this.Loaders[this.SupportedLoaders.Swagger2Loader] = Loaders.Swagger2Loader

    this.apiConfigurations = [] // This will store all the configured API in APIExplorer
    this.widgetTabs = [] // This will store all the api operations configured for ApiExplorer
    this.headers = [] // This will store all the headers needed
    this.queryStringLoadEnabled = false
    this.interceptors = {}

    this.addWidgetTab('Try It', TryOutWidgetTab)
    this.addWidgetTab('Spec', SpecWidgetTab)
    this.addWidgetTab('Response Schema', ResponseSchemaWidgetTab)
  }

  /**
   * Method of the fluent API used to configure APIExplorer with API Specifications
   * @param  {[function]} configurator    A function used to configure API Explorer
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  config (configurator) {
    const apiExplorerConfigurator = new APIExplorerConfigurator(this)
    configurator(apiExplorerConfigurator)
    return this
  }

  enableQueryStringConfig () {
    const queryString = { }
    document.location.search.substr(1)
          .split('&')
          .map(_ => _.split('='))
          .forEach(a => queryString[decodeURIComponent(a[0]).replace('[]', '')] = decodeURIComponent(a[1]))

    // If a specification exists in the query string
    if (queryString.hasOwnProperty('swaggerSpec')) {
      const specLoader = queryString.swaggerLoader || 'Swagger2Loader'
      const swaggerUseProxy = queryString.swaggerUseProxy === 'on'
      this.addConfiguration(
        'url',
        specLoader,
        new Url(queryString.swaggerSpec, swaggerUseProxy)
      )
    }

    return this
  }

  /*
   * Method of the fluent API used to configure The widgets of APIExplorer
   * @param  {[function]} configurator    A function used to configure the widgets
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  configWidgetTabs (configurator) {
    const apiExplorerWidgetTabConfigurator = new APIExplorerWidgetTabConfigurator(this)
    configurator(apiExplorerWidgetTabConfigurator)
    return this
  }

    /*
   * Method of the fluent API used to configure The widgets of APIExplorer
   * @param  {[function]} configurator    A function used to configure the widgets
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  configInterceptors (configurator) {
    const apiExplorerInterceptorConfigurator = new APIExplorerInterceptorConfigurator(this)
    configurator(apiExplorerInterceptorConfigurator)
    return this
  }

  configHeaders (configurator) {
    const apiExplorerHeaderConfigurator = new APIExplorerHeaderConfigurator(this)
    configurator(apiExplorerHeaderConfigurator)
    return this
  }

  /**
   * Method of the fluent API used to start APIExplorer.
   * Will dispach actions to process the configurations, and render the UI
   * @param  {String} domAnchor   Alternative DOM anchor point if 'root' cannot be used
   * @return {[APIExplorer]}      APIExplorer instance to provide a fluent interface
   */
  start (domAnchor = 'root') {
    store.dispatch(apiConfigurations(this.apiConfigurations))

    // Dispatch actions to load configurations
    for (const config of this.apiConfigurations) {
      const interceptor = this.interceptors[config.loaderType]
      if (interceptor) {
        config.interceptor = interceptor
      }
      store.dispatch(loadSpec(config))
    }

    store.dispatch(headers(this.headers))

    // Render UI
    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }

  /**
   * Adds an API configuration
   * @param {[type]} loaderType The type of loader used to parse the api description
   * @param {[type]} extraProps Extra properties specific to the loader
   */
  addConfiguration (friendlyName, loaderType, url) {
    const loader = this.Loaders[loaderType]
    this.apiConfigurations.push({ friendlyName, loaderType, loader, url })
  }

  /**
   * Adds a new interceptor to make changes to the swagger spec before usage
   * Only one interceptor per type is supported
   * @param {[type]} loaderType The type of loader to associate this interceptor with
   * @param {[function]} interceptor A function to change the properties of swagger spec
   */
  addInterceptor (loaderType, interceptor) {
    if (this.interceptors[loaderType]) {
      console.warn(`The register of the interceptor for type '${loaderType}' will overlap the previous register. Only one interceptor is supported for each loader type.`)
    }
    this.interceptors[loaderType] = interceptor
  }

  /**
   * Adds a new Widget
   * @param {[type]} name      friendly name of the Widget (to appear in the wodgets tab)
   * @param {[type]} widgetTab Object that represents the component do add to the widgets tab
   */
  addWidgetTab (name, component) {
    const slug = name.replace(/([^a-zA-Z0-9]+)/g, '-').toLowerCase()
    this.widgetTabs.push({ name, component: widgetWrapper(component), slug: slug })
  }

  /**
   * Adds a new Header
   * @param {[type]} name  Name of the Header
   * @param {[type]} value Value of the Header
   */
  addHeader (name, value) {
    this.headers.push({ name, value })
  }
}

const explorer = new APIExplorer()
module.exports = window.APIExplorer = explorer
