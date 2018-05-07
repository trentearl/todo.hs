import { delay } from 'bluebird';
import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { loadUsers } from './actions';
import Inner from './inner';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(sagas);

var props = {};

class Main extends Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <Router>
                        <Inner />
                    </Router>
                </Provider>
            </div>
        );
    }
}

export default Main;
