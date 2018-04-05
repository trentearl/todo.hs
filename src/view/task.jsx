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

import {
    taskDelete,
    taskDone,
    taskUnDone,
    taskUp,
    taskDown
} from './actions/index';

class Task extends Component {
    render() {
        var done = this.props.task.get('done');
        var doneButton = null;

        return (
            <Row style={{ width: '100%', padding: 5, paddingLeft: 5 }} className='task' data-id={this.props.task.get('_id')}>
                <Col className='col-8'>
                    {' '}
                    &nbsp;
                    {' '}

                    <Input type='checkbox'
                        onChange={this.handleToggle.bind(this)}
                        checked={done} />

                    <strong style={{ textDecoration: done ? 'line-through' : 'none' }}>
                        {this.props.task.get('task')}
                    </strong>
                </Col>

                <Col className='col-3' style={{ textAlign: 'right' }}>
                    <Button color='danger'
                        className='task-hidden-button'
                        onClick={this.handleDelete.bind(this)}>
                        <i className='fa fa-trash' />
                    </Button>

                    {' '}

                    <Button onClick={this.handleDown.bind(this)}
                        className='task-hidden-button'>
                        <i className='fa fa-arrow-down' />
                    </Button>

                    {' '}

                    <Button onClick={this.handleUp.bind(this)}
                        className='task-hidden-button'>
                        <i className='fa fa-arrow-up' />
                    </Button>
                </Col>

                <Col className='col-1' style={{ textAlign: 'right' }}>
                    <i className='fa fa-bars drag-handle' style={{ marginTop: 10 }} />
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

    handleDown() {
        this.props.dispatch(
            taskDown(this.props.task)
        );
    }

    handleUp() {
        this.props.dispatch(
            taskUp(this.props.task)
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


