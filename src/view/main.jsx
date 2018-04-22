import { delay } from 'bluebird';
import React, { Component } from 'react';
import { fromJS } from 'immutable';
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
var tasks = fromJS(
    window.preFetchedData.map(({ doc }) => doc).sort(
        (a, b) => {
            if (a.done == b.done)
                return a.index - b.index
            else if (a.done && !b.done)
                return 1;
            else return -1;
        }
    )
);

const store = createStoreWithMiddleware(reducer, { tasks });

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

