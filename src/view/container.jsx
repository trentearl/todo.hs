import React, { Component } from 'react';

export default props => (
    <div
        className="container"
        style={{
            height: '100%'
        }}>
        {props.children}
    </div>
);
