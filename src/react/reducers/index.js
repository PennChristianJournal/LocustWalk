
import { combineReducers } from 'redux'
import metadata from './metadata'
import articles from './articles'

export default combineReducers({
    metadata,
    articles
})