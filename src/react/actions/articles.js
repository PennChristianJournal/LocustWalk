
import fetch from 'isomorphic-fetch'

export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES';
export const INVALIDATE_ARTICLES = 'INVALIDATE_ARTICLES';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';

if (process.env.APP_ENV !== 'browser') {
    var nconf = require('nconf');
}

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

function clientAdapter(params) {
    var query = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&');

    var url = `${process.env.SERVER_ROOT}api/articles/?${query}`;
    return fetch(url).then(response => response.json());
}

export function fetchArticles(name, page = 0, params = {}, getArticles = clientAdapter) {
    params.page = page;

    return dispatch => {
        dispatch(requestArticles(name, page));
        return getArticles(params).then(json => dispatch(receiveArticles(name, page, json)))
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

export function fetchArticlesIfNeeded(name, page = 0, params = {}) {
    return (dispatch, getState) => {
        if (shouldFetchArticles(getState(), name, page, params)) {
            return dispatch(fetchArticles(name, page, params))
        } else {
            return Promise.resolve()
        }
    }
}

export function invalidateArticles(name, page = 0) {
    return {
        type: INVALIDATE_ARTICLES,
        name,
        page
    }
}

export function updateArticle(id, property, value) {
    return {
        type: UPDATE_ARTICLE,
        id,
        property,
        value
    }
}