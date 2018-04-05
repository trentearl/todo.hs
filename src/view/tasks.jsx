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
import {Sortable} from '@shopify/draggable';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { taskReorder, taskNew, tasksRefresh } from './actions/index';

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

    componentDidUpdate() {
        console.log('update')

        const sortable = new Sortable(document.querySelectorAll('.task-holder'), {
            draggable: '.task',
            handle: '.drag-handle',
            mirror: {
                xAxis: false,
                constrainDimensions: true
            },

        });

        sortable.on('drag:stop',  ({ data }) => {
            var id = data.originalSource.dataset.id

            var tasks = Array.from(
                document.querySelectorAll('.task-holder .task')
            );

            var index = tasks.findIndex(task => 
                task.dataset.id == id
            );
            var task = this.props.tasks.find(task => task.get('_id') == id);

            var lower =  Math.min(
                ...this.props.tasks.map(
                    task => task.get('index')
                )
                .toJS()
            ) - 2;

            var upper =  Math.max(
                ...this.props.tasks.map(
                    task => task.get('index')
                )
                .toJS()
            ) + 2;

            function getIndex(tasks, id) {
                return tasks.find(task => task.get('_id') == id)
                    .get('index')
            }

            if (tasks[index - 1])
                lower = getIndex(
                    this.props.tasks,
                    tasks[index - 1].dataset.id
                );

            if (tasks[index + 1])
                upper = getIndex(
                    this.props.tasks,
                    tasks[index + 1].dataset.id
                );

            var newIndex = (upper - lower) / 2 + lower;
            console.log(lower, upper);

            this.props.dispatch(
                taskReorder({
                    task,
                    index: newIndex
                })
            );
        })
    }

    render() {
        var image = null;

        if (!this.props.tasks) return <span>Loading</span>;

        return (
            <Container>
                <div className='task-holder'>
                    {this.props.tasks.map(task =>
                        <Task key={task.get('_id')} task={task} />
                    ).toJS()}
                </div>

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
                                    autoFocus={true}
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


