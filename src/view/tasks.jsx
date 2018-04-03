import React, { Component } from 'react';

import {
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';

import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { taskNew, tasksRefresh } from './actions/index';

import Task from './task';

class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: ''
        }
    }

    componentDidMount() {
        this.props.dispatch(tasksRefresh());
    }

    render() {
        var image = null;

        if (!this.props.tasks) return <span>Loading</span>;

        return (
            <Container>
                {this.props.tasks.map(task =>
                    <Task key={task.get('_id')} task={task} />
                ).toJS()}

                <Row>
                    <Col>
                        <hr />
                    </Col>
                </Row>

                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup>
                <Row>
                            <Col className='col-8'>
                                <Input type='text'
                                    placeholder='New Task'
                                    autoComplete='off'
                                    name='task-new'
                                    value={this.state.task}
                                    onChange={({ target }) => this.setState({ task: target.value })} />
                            </Col>

                            <Col className='col-4'>
                                <Button>New</Button>
                            </Col>
                </Row>
                        </FormGroup>
                    </Form>
            </Container>
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.dispatch(
            taskNew({ task: this.state.task })
        );

        this.setState({ task: '' });
    }

}

export default withRouter(connect((state, props) => ({
    tasks: state.tasks
}))(Tasks));


