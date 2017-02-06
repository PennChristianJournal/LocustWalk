import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
const logger = createLogger();
import { Provider } from 'react-redux'
import reducer from '../reducers'

export function mount(Page) {
    if (typeof document !== 'undefined') {

        const state = window.__STATE__;
        const store = createStore(reducer, state, applyMiddleware(thunk));
        render(
            <Provider store={store}><Page /></Provider>,
            document.getElementById('root')
        )
    }
}