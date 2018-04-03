import { delay } from 'bluebird';
import React, { Component } from 'react';
import {
    Link,
    BrowserRouter as Router,
} from 'react-router-dom'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';

import { loadUsers } from './actions';
import Inner from './inner';
import RootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
var props = {};
var reducer = RootReducer;
const store = createStoreWithMiddleware(reducer, props);

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

