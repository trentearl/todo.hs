import React from 'react';
import { renderToString } from 'react-dom/server';
import createSagaMiddleware from 'redux-saga';

import request from './lib/request';

import { Provider } from 'react-redux';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../view/reducers/index';
import Inner from '../view/inner';

export default () => app => {
    app.get('/', (req, res, next) => {
        request('https://couch.trentearl.com/todo/_all_docs?include_docs=true')
            .then(data => data.body)
            .then(JSON.parse)
            .then(data => {
                const sagaMiddleware = createSagaMiddleware();
                const store = createStore(
                    reducers,
                    applyMiddleware(sagaMiddleware)
                );

                var tasks = data.rows.map(({ doc }) => doc);
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
