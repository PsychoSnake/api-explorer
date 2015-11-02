import 'babel-core/polyfill'
import React from 'react'
import uslug from 'uslug'
import { render } from 'react-dom'
import configureStore from 'store/configureStore'
import Root from 'containers/Root'
import { load as loadSpec } from 'actions/loadActionCreators'
import * as Loaders from 'infrastructure/loaders'

import TryOutWidgetTab from 'components/widgets/TryOutWidgetTab'
import SpecWidgetTab from 'components/widgets/SpecWidgetTab'
import SchemaWidgetTab from 'components/widgets/SchemaWidgetTab'

const store = configureStore()

class APIExplorerConfigurator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  swagger2API (friendlyName, url) {
    this.apiExplorer.addConfiguration(friendlyName, this.apiExplorer.Loaders.Swagger2Loader, { url })
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

class APIExplorer {
  constructor () {
    this.Loaders = {
      Swagger2Loader: Loaders.Swagger2Loader
    }

    this.apiConfigurations = [] // This will store all the configured API in APIExplorer
    this.widgetTabs = [] // This will store all the api operations configured for ApiExplorer

    this.addWidgetTab('Try It', TryOutWidgetTab)
    this.addWidgetTab('Spec', SpecWidgetTab)
    this.addWidgetTab('Schema', SchemaWidgetTab)
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

  /*
   * Method of the fluent API used to configure APIExplorer with API Operations
   * @param  {[function]} configurator    A function used to configure API Explorer
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  configWidgetTabs (configurator) {
    const apiExplorerWidgetTabConfigurator = new APIExplorerWidgetTabConfigurator(this)
    configurator(apiExplorerWidgetTabConfigurator)
    return this
  }

  /**
   * Method of the fluent API used to start APIExplorer.
   * Will dispach actions to process the configurations, and render the UI
   * @param  {String} domAnchor   Alternative DOM anchor point if 'root' cannot be used
   * @return {[APIExplorer]}      APIExplorer instance to provide a fluent interface
   */
  start (domAnchor = 'root') {
    // Dispatch actions to load configurations
    for (const config of this.apiConfigurations) {
      store.dispatch(loadSpec(config))
    }

    // Render UI
    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }

  /**
   * Adds an API configuration
   * @param {[type]} loader     The loaded used to parse the api description
   * @param {[type]} extraProps Extra properties specific to the loader
   */
  addConfiguration (friendlyName, loader, props) {
    this.apiConfigurations.push({ friendlyName, loader, props })
  }

  /**
   * Adds an API configuration
   * @param {[type]} name      friendly name of the operation
   * @param {[type]} widgetTab Component Name of the operation
   */
  addWidgetTab (name, component) {
    this.widgetTabs.push({ name, component, slug: uslug(name) })
  }

}

const explorer = new APIExplorer()
module.exports = window.APIExplorer = explorer
