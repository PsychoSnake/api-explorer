import { connect } from 'react-redux'

export default function widgetWrapper (widgetTab) {
  return connect(
          state => {
            const URI_PROTOCOL_REGEX = /([a-z]+):\/\//
            let operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
            operation = operation.size > 0 ? operation.toJS() : null
            let defaultScheme = URI_PROTOCOL_REGEX.exec(state.configs.get('url').url).splice(1).toString()
            return {
              operation: operation,
              definitions: state.definitions.size > 0 ? state.definitions.toJS() : {},
              apis: state.apis.get('byName').get(operation.apiname),
              config: { defaultScheme: defaultScheme, useProxy: state.configs.get('url').useProxy, headers: state.configs.get('headers') }
            }
          }
        )(widgetTab)
}
