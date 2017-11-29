import './index.css'

import APIExplorer from 'apiexplorer'
import { CurlGeneratorTab } from 'apiexplorer-components'

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://petstore.swagger.io/v2/swagger.json', c => {
    c.listOperationsAtWelcome(true)
  })
  .addWidgetTab('CURL', CurlGeneratorTab)
  .start('app')
