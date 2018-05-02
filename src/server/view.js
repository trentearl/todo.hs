import React from 'react';
import { renderToString } from 'react-dom/server';

import request from './lib/request';

import Inner from '../view/inner';
import { Provider } from 'react-redux';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../view/reducers/index';
import thunk from 'redux-thunk';
import { tasksRefreshSync } from '../view/actions';

export default config => app => {
    app.get('/', (req, res, next) => {
        const store = createStore(reducers, applyMiddleware(thunk));

        request('https://couch.trentearl.com/todo/_all_docs?include_docs=true')
            .then(data => data.body)
            .then(JSON.parse)
            .then(data => {
                store.dispatch(tasksRefreshSync(data.rows));

                var rendered = renderToString(
                    <Provider store={store}>
                        <StaticRouter location={req.url} context={{}}>
                            <Inner />
                        </StaticRouter>
                    </Provider>
                );

                res.render('index', { rendered, preFetchedData: data.rows });
            })
            .then(null, next);
    });
};
