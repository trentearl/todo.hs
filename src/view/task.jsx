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
            <Row style={{ width: '100%', margin: 10 }} className='task' data-id={this.props.task.get('_id')}>
                <Col className='col-8'
                    style={{ marginTop: 7 }}>
                    <Input type='checkbox'
                        onChange={this.handleToggle.bind(this)}
                        checked={done} />

                    <strong style={{ textDecoration: done ? 'line-through' : 'none' }}>
                        {this.props.task.get('task')}
                    </strong>
                </Col>

                <Col className='col-1'>
                    <Button color='danger' onClick={this.handleDelete.bind(this)}>
                        <i className='fa fa-trash' />
                    </Button>
                </Col>

                <Col className='col-1'>
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


