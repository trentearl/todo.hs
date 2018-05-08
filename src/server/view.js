import React from 'react';
import { fromJS } from 'immutable';
import { renderToString } from 'react-dom/server';
import createSagaMiddleware, { END } from 'redux-saga';

import request from './lib/request';

import { Provider } from 'react-redux';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../view/reducers/index';
import Inner from '../view/inner';

export default config => app => {
    app.get('/', (req, res, next) => {
        request('https://couch.trentearl.com/todo/_all_docs?include_docs=true')
            .then(data => data.body)
            .then(JSON.parse)
            .then(data => {
                const sagaMiddleware = createSagaMiddleware();
                var tasks = data.rows.map(({ doc }) => doc);
                const store = createStore(
                    reducers,
                    applyMiddleware(sagaMiddleware)
                );
                store.dispatch({ type: 'TASKS_REFRESHED', tasks });

                var rendered = renderToString(
                    <Provider store={store}>
                        <StaticRouter location={req.url} context={{}}>
                            <Inner />
                        </StaticRouter>
                    </Provider>
                );

                res.render('index', { rendered, preFetchedData: tasks });
            })
            .then(null, next);
    });
};
