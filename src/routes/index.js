import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Application from 'containers/Application'
import Welcome from 'containers/Welcome'
import OperationWidgetContainer from 'containers/OperationWidgetContainer'
import NotFound from 'containers/NotFound'

export default function (store) {
  return (
    <Route>
      <Route path='/' component={Application}>
        <IndexRoute component={Welcome} />
        <Route path='operation/:id' component={OperationWidgetContainer} >
          {APIExplorer.widgetTabs.map(widgetTab =>
            <Route key={widgetTab.slug} path={widgetTab.slug} component={widgetTab.component} />
          )}
        </Route>
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  )
}
