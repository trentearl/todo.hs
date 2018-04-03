import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import Tasks from './tasks';

class Inner extends Component {
    render() {
        return (
            <div>
                <Route exact path='/' component={Tasks} />
            </div>
        );
    }
}

export default Inner;

