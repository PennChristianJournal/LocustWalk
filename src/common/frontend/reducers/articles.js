
import {
  REQUEST_ARTICLES,
  RECEIVE_ARTICLES,
  INVALIDATE_ARTICLES,
  UPDATE_ARTICLE,
  RECEIVE_ARTICLE_COUNT,
} from '../actions/articles';

function articleGroupPage(state = {
  requesting: false,
  valid: false,
  articles: [],
}, action) {
  switch (action.type) {
    case REQUEST_ARTICLES:
      return Object.assign({}, state, {
        requesting: true,
      });
    case RECEIVE_ARTICLES:
      return Object.assign({}, state, {
        requesting: false,
        valid: true,
        articles: action.articles.map(article => article._id),
      });
    default:
      return state;
  }
}

function articleGroup(state = [], action) {
  switch (action.type) {
    case REQUEST_ARTICLES:
    case RECEIVE_ARTICLES:
      const group = articleGroupPage(state[action.page], action);
      return Object.assign([], state, {
        [action.page]: group,
      });

    case RECEIVE_ARTICLE_COUNT:
      return Object.assign([], state, {
        count: action.count,
      });
    default:
      return state;
  }
}

export default function articles(state = { __DB__: {} }, action) {
  var newState = state;
  switch (action.type) {
    case RECEIVE_ARTICLES:
      newState = Object.assign({}, state);
      var dbState = newState.__DB__;
      action.articles.forEach(article => {
        dbState = Object.assign(dbState, {
          [article._id]: article,
        });
      });
      return Object.assign({}, newState, {
        [action.name]: articleGroup(newState[action.name], action),
      });

    case REQUEST_ARTICLES:
      return Object.assign({}, newState, {
        [action.name]: articleGroup(newState[action.name], action),
      });

    case INVALIDATE_ARTICLES:
      newState = Object.assign({}, state);
      state[action.name][action.page].valid = false;
      return newState;

    case UPDATE_ARTICLE:
      newState = Object.assign({}, state);
      var articleState = newState.__DB__[action.id];
      Object.assign(articleState, {
        [action.property]: action.value,
      });
      return newState;

    case RECEIVE_ARTICLE_COUNT:
      return Object.assign({}, newState, {
        [action.name]: articleGroup(newState[action.name], action),
      });

    default:
      return newState;
  }
}
