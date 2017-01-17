
import fetch from 'isomorphic-fetch'

export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES';

function requestArticles(name, page) {
    return {
        type: REQUEST_ARTICLES,
        name,
        page
    }
}

function receiveArticles(name, page, articles) {
    return {
        type: RECEIVE_ARTICLES,
        name,
        page,
        articles
    }
}

export function fetchArticles(name, page = 1, params = {}) {
    params = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&');

    return dispatch => {
        dispatch(requestArticles(name, page));
        return fetch(`http://localhost:3000/api/articles/?page=${page}&${params}`)
            .then(response => response.json())
            .then(json => dispatch(receiveArticles(name, page, json)))
    }
}

function shouldFetchArticles(state, name, page) {
    if (!state.articles || !state.articles[name] || !state.articles[name][page]) {
        return true
    }
    if (state.articles[name][page].fetching) {
        return false
    }
    return !state.articles[name][page].valid
}

export function fetchArticlesIfNeeded(name, page = 1, params = {}) {
    return (dispatch, getState) => {
        if (shouldFetchArticles(getState(), name, page, params)) {
            return dispatch(fetchArticles(name, page, params))
        } else {
            return Promise.resolve()
        }
    }
}
