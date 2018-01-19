import React, { Component } from 'react'
import {Map} from 'immutable'
import { Grid, Table } from 'semantic-ui-react'

class TryOutWidgetTabHttpHeadersPanel extends Component {
  constructor () {
    super()
    this.state = { ...this.state }
  }

  renderHeaders (headers) {
    var headerMap = Map(headers)
    if (headerMap && headerMap.size > 0) {
      return (
        <Table.Body>
          {headerMap.map((value, key) => (<Table.Row key={key}>
            <Table.Cell>{key}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
          </Table.Row>)
        ).toList()}
        </Table.Body>
      )
    }
    return <Table.Body><Table.Row><Table.Cell colSpan={2}><em>No headers were found</em></Table.Cell></Table.Row></Table.Body>
  }

  render () {
    const responseHeaders = this.props.responseHeaders
    const requestHeaders = this.props.requestHeaders

    return (
      <Grid columns='2'>
        <Grid.Column>
          <Table compact>
            <Table.Header>
              <Table.Row><Table.HeaderCell colSpan={2}>Request Headers</Table.HeaderCell></Table.Row>
            </Table.Header>
            {this.renderHeaders(requestHeaders)}
          </Table>
        </Grid.Column>
        <Grid.Column>
          <Table compact>
            <Table.Header>
              <Table.Row><Table.HeaderCell colSpan={2}>Response Headers</Table.HeaderCell></Table.Row>
            </Table.Header>
            {this.renderHeaders(responseHeaders)}
          </Table>
        </Grid.Column>
      </Grid>
    )
  }
}

// TryOutWidgetTabHttpHeadersPanel.propTypes = {
//   requestHeaders: PropTypes.object,
//   responseHeaders: PropTypes.object
// }

export default TryOutWidgetTabHttpHeadersPanel
