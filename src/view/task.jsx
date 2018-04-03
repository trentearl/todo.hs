import React, { Component } from 'react';

import {
    Button,
    Form,
    FormGroup,
    Input,
    Row, 
    Col,
    Label
} from 'reactstrap';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { taskDelete, taskDone, taskUnDone } from './actions/index';

class Task extends Component {
    render() {
        var done = this.props.task.get('done');
        var doneButton = null;

        return (
            <Row style={{ margin: 10 }}>
                <Col className='col-8'
                    onClick={this.handleToggle.bind(this)}>
                    <Input type='checkbox'
                        checked={done} />

                    <strong onClick={this.handleToggle.bind(this)}
                        style={{ textDecoration: done ? 'line-through' : 'none' }}>
                        {this.props.task.get('task')}
                    </strong>
                </Col>

                <Col className='col-2'>
                    <Button color='danger' onClick={this.handleDelete.bind(this)}>
                        delete
                    </Button>
                </Col>
            </Row>
        );
    }

    handleToggle() {
        if (this.props.task.get('done'))
            this.props.dispatch(
                taskUnDone(this.props.task)
            );
        else
            this.props.dispatch(
                taskDone(this.props.task)
            );
    }

    handleUnDone() {
        this.props.dispatch(
            taskUnDone(this.props.task)
        );
    }

    handleDone() {
        this.props.dispatch(
            taskDone(this.props.task)
        );
    }

    handleDelete() {
        this.props.dispatch(
            taskDelete(this.props.task)
        );
    }
}

export default connect((state, props) => ({
}))(Task);


