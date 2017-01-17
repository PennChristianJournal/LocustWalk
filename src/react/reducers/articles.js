
import { REQUEST_ARTICLES, RECEIVE_ARTICLES } from '../actions/articles'

function articleGroupPage(state = {
    requesting: false,
    valid: false,
    articles: []
}, action) {
    switch(action.type) {
        case REQUEST_ARTICLES:
            return Object.assign({}, state, {
                requesting: true
            });
        case RECEIVE_ARTICLES:
            return Object.assign({}, state, {
                requesting: false,
                valid: true,
                articles: action.articles.map(article => article._id)
            });
        default:
            return state;
    }
}

function articleGroup(state = {}, action) {
    switch (action.type) {
        case REQUEST_ARTICLES:
        case RECEIVE_ARTICLES:
            return Object.assign({}, state, {
                [action.page]: articleGroupPage(state[action.page], action)
            })
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
                    [article._id]: article
                })
            });

        case REQUEST_ARTICLES:
            return Object.assign({}, newState, {
                [action.name]: articleGroup(newState[action.name], action)
            });

        default:
            return newState
    }
}