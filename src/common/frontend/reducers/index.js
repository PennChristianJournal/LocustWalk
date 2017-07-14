
import { combineReducers } from 'redux';
import articles from './articles';
import metadata from './metadata';

export default combineReducers({
  metadata,
  articles,
});
