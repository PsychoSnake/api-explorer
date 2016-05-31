import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

const STORAGE_KEY = 'apiexplorer-dev-headers'
localStorage.setItem(STORAGE_KEY, localStorage.getItem(STORAGE_KEY))
const storageHeaders = JSON.parse(localStorage.getItem(STORAGE_KEY))

let INITIAL_STATE = Map({ url: '', headers: storageHeaders })

export default function configsReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CONFIG_URL:
      return state.set('url', action.url)
    case types.CONFIG_HEADERS:
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.headers))
      if (!storageHeaders && action.startup) {
        return state.set('headers', action.headers)
      }
      if (!action.startup) {
        return state.set('headers', action.headers)
      }
  }
  return state
}
