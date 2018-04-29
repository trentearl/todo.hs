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
    taskChangeText,
    taskDown
} from './actions/index';

class Task extends Component {
    handleSubmit(e) {
        e.preventDefault();

        this.props.dispatch(
            taskChangeText(
                this.props.task.set('task', this.state.taskRaw)
            )
        );
        this.props.onSelect(null);
    }

    handleReset() {
        this.props.onSelect(null);
        this.setState({ taskRaw: null });
    }

    render() {
        var done = this.props.task.get('done');
        var doneButton = null;

        return (
            <Row style={{ padding: 5, paddingLeft: 5 }}
                onDoubleClick={e => {
                    this.setState(
                        { taskRaw: this.props.task.get('task') },
                        _ => {
                            this.input.focus()
                            this.input.setSelectionRange(
                                0,
                                this.input.value.length
                            )
                        }
                    )
                    this.props.onSelect(this.props.task.get('_id'))
                }}
                className='task'
                data-id={this.props.task.get('_id')}>
                <Col className='col-8'>
                    <Input type='checkbox'
                        autofocus='true'
                        autoFocus='true'
                        style={{ float: 'left' }}
                        onChange={this.handleToggle.bind(this)}
                        checked={done} />

                    {this.renderTask(this.props.task)}
                </Col>

                <Col className='col-3' style={{ textAlign: 'right' }}>
                    <Button color='danger'
                        className='task-hidden-button'
                        onClick={this.handleDelete.bind(this)}>
                        <i className='fa fa-trash' />
                    </Button>

                    {' '}

                    <Button onClick={this.handleDown.bind(this)}
                        className='task-hidden-button mobile-hide'>
                        <i className='fa fa-arrow-down' />
                    </Button>

                    {' '}

                    <Button onClick={this.handleUp.bind(this)}
                        className='task-hidden-button mobile-hide'>
                        <i className='fa fa-arrow-up' />
                    </Button>
                </Col>

                <Col className='col-1 drag-handle' style={{ marginTop: 10, textAlign: 'right' }}>
                    <i className='fa fa-bars' />
                </Col>
            </Row>
        );
    }

    renderTask(task) {
        var taskRaw = task.get('task');
        var done = task.get('done');

        if (this.props.selected) {
            return (
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Input type='text'
                        innerRef={n => this.input = n}
                        onKeyDown={e => {
                            if(e.keyCode != 27) return;

                            this.handleReset()
                        }}
                        value={this.state.taskRaw}
                        onChange={e => this.setState({ taskRaw: e.target.value })} />
                </form>
            )
        }

        var children = taskRaw.split(' ')
            .map((task, i) => {
                if (task.startsWith('MNF-') || task.startsWith('MAINT-') || task.startsWith('CHANGE-'))
                    return (
                        <a key={i} href={`https://malauzai.atlassian.net/browse/${task}`} target='_blank'>
                            {task}&nbsp;
                        </a>
                    );
                else if (task.startsWith('(') && task.endsWith(')'))
                    return (
                        <a key={i} href={`https://admin.malauzai.com/${task.replace(/\W/g, '')}`} target='_blank'>
                            ({task.replace(/\W/g, '')})&nbsp;
                        </a>
                    );
                else
                    return <span key={i}>{task}&nbsp;</span>;
            })

        return (
            <p className='task-text'
                style={{ textDecoration: done ? 'line-through' : 'none' }}>
                <div>{children}</div>
            </p>
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

    handleDelete(e) {
        if (!e.metaKey && !confirm('Are you sure you want to delete this?'))
            return;

        this.props.dispatch(
            taskDelete(this.props.task)
        );
    }
}

export default connect((state, props) => ({
}))(Task);


