import React from 'react';
import ReactDOM from 'react-dom';

import Container from './container';
import Main from './main';

ReactDOM.render(
    <Container>
        <Main />
    </Container>,
    document.getElementById('container').firstChild
);
