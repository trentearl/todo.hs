import DB from 'pouchdb';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { taskReorder, taskNew, tasksRefresh } from './actions/index';
import Tasks from './tasks';

class Inner extends Component {
    componentDidMount() {
        var sync = DB.sync('https://couch.trentearl.com/todo', 'todo', {
            live: true,
            username: 'admin',
            password: 'we are trent',
            retry: true
        })
            .on('change', _ => this.props.dispatch(tasksRefresh()))
            .on('paused', function(err) {
                console.log('paused ', err);
            })
            .on('active', function() {
                console.log('active');
            })
            .on('denied', function(err) {
                console.log('denied', err);
            })
            .on('complete', function(info) {
                console.log('compete', info);
            })
            .on('error', function(err) {
                console.log('error', err);
            });
    }

    render() {
        return (
            <div>
                <Route exact path="/" component={Tasks} />
            </div>
        );
    }
}

export default connect()(Inner);
