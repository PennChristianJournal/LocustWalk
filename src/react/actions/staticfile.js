mport fetch from 'isomorphic-fetch';

export const REQUEST_STATIC_FILE = 'REQUEST_STATIC_FILE';


function requestArticles(name) {
  return {
    type: REQUEST_STATIC_FILE,
    name
  };
}

export function fetchStaticPage(name, getArticles = clientAdapter) {
  params.page = page;

  return dispatch => {
    dispatch(requestArticles(name, page));
    return getArticles(params).then(json => dispatch(receiveArticles(name, page, json)));
  };
}
