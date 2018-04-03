import React, { Component } from 'react';

class Container extends Component {
    render() {
        return (
            <div className='container'
                style={{
                    height: '100%',
                }}>
                {this.props.children}
            </div>
        );
    }
}

export default Container;

