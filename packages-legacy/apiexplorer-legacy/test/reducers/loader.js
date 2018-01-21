/* eslint-env mocha */

import { fromJS } from 'immutable'
import { expect } from 'chai'
import loaderReducer from '../../src/reducers'

describe('reducers', () => {
  it('handles UPDATE_PROGRESS', () => {
    const action = { 'type': 'UPDATE_PROGRESS', 'currentStep': 'Current Step' }
    const nextState = loaderReducer(undefined, action)

    expect(nextState.loader).to.equal(
      fromJS({
        loaded: false,
        totalApis: 0,
        loadedApis: 0,
        progress: [ 'Current Step' ],
        currentStep: 'Current Step'
      })
    )
  })

  it('handles LOAD_COMPLETE', () => {
    const action = { 'type': 'LOAD_COMPLETE', 'apis': 'Load completed with success' }
    const nextState = loaderReducer(undefined, action)

    expect(nextState.loader).to.equal(
      fromJS({
        loaded: false,
        totalApis: 0,
        loadedApis: 1,
        progress: [ ],
        currentStep: ''
      })
    )
  })
})
