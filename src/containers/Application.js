import './Application.css'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ExplorerHeader } from 'components'

class Application extends Component {
  render () {
    const loaded = this.props.loader.get('loaded')
    return loaded ? this.renderApplication() : this.renderLoadingScreen()
  }

  renderLoadingScreen () {
    const topLoadingStype = {
      backgroundColor: '#222',
      textAlign: 'center',
      color: 'white',
      paddingTop: '20%',
      height: 2000
    }
    const { loader } = this.props
    return (
      <div>
        <div style={topLoadingStype} >
          <img src='data:image/png;base64,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' />
          <br />
          <h1 id='loading-documentation' style={{ fontFamily: 'verdana' }}>Loading API documentation...</h1>
          <br />
          <br />
          <br />
          <p>
            { loader.get('currentStep') }
          </p>
          <pre style={{ textAlign: 'left', fontSize: 10, marginLeft: '20%', marginRight: '20%' }}>
            { this.props.loader.get('progress').map(p => <div key={p}>{p}</div>) }
          </pre>
        </div>
        <div style={{ position: 'fixed', bottom: 10, right: 10 }} >
          <a href='#' id='btnResetExplorer'>reset explorer</a>
        </div>
      </div>
    )
  }

  renderApplication () {
    return (
      <div id='content'>
        <div id='sidebar'>
          <div className='api-explorer-logo'>
            <Link to='/' >
            <img src='https://dev.int.skystore.com/api/explorer/public/images/logo_transparent.png' />
            </Link>
          </div>
          <ul className='nav' id='side-menu'>
            <li>
              <Link to='/' >
              <i className='fa fa-fw fa-home'></i><span>Home</span>
              </Link>
            </li>
          </ul>
          <div id='lateral-menu'>
            LATERAL MENU
          </div>
        </div>
        <div id='main-content'>
          <div className='container-fluid'>
            <div className='row' id='top'>
              <div className='col-lg-12'>
                <ExplorerHeader api={{ apiName: 'Sample API', apiVersion: '1.0.0', productVersion: 'asdasd12' }} />
                {this.props.children}
                <div>FOOTER</div>
                  Copyright &copy; API Explorer 2015
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  children: PropTypes.element
}

export default connect(
  state => { return { loader: state.loader } }
)(Application)
