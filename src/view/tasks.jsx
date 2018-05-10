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

import Sortable from './lib/sortable';
import Task from './task';

class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: '',
            id: null
        };
    }

    componentDidMount() {
        this.props.dispatch({ type: 'TASKS_REFRESH' });
        this.setTitle();

        this.setupSort();
    }

    componentDidUpdate(prevProps) {
        this.setTitle();

        if (!this.props.tasks || this.props.tasks.equals(prevProps.tasks))
            return;

        this.setupSort();
    }

    setupSort() {
        if (this.state.sortable) this.state.sortable.destroy();

        const sortable = new Sortable(
            document.querySelectorAll('.task-holder'),
            {
                draggable: '.task',
                handle: '.drag-handle',
                mirror: {
                    xAxis: false,
                    constrainDimensions: true
                }
            }
        );

        sortable.on('drag:stop', ({ data }) => {
            var id = data.originalSource.dataset.id;

            var tasks = Array.from(
                document.querySelectorAll('.task-holder .task')
            );

            var index = tasks.findIndex(task =>
                Array.from(task.classList).includes(
                    'draggable-source--is-dragging'
                )
            );

            var task = this.props.tasks.find(task => task.get('_id') == id);

            var lower =
                Math.min(
                    ...this.props.tasks.map(task => task.get('index')).toJS()
                ) - 2;

            var upper =
                Math.max(
                    ...this.props.tasks.map(task => task.get('index')).toJS()
                ) + 2;

            function getIndex(tasks, id) {
                return tasks.find(task => task.get('_id') == id).get('index');
            }

            if (tasks[index - 1])
                lower = getIndex(this.props.tasks, tasks[index - 1].dataset.id);

            if (tasks[index + 1])
                upper = getIndex(this.props.tasks, tasks[index + 1].dataset.id);

            var newIndex = (upper - lower) / 2 + lower;

            this.props.dispatch({
                type: 'TASK_REORDER',
                task,
                index: newIndex
            });
        });

        this.setState({ sortable });
    }

    setTitle() {
        if (!this.props.tasks) return;

        var total = this.props.tasks.size;
        var done = this.props.tasks.filter(task => !task.get('done')).size;

        document.title = `Todo: ${done}/${total}`;
    }

    render() {
        var image = null;

        if (!this.props.tasks) return <span>Loading</span>;

        return (
            <Container>
                <div className="task-holder">
                    {this.props.tasks
                        .map(task => (
                            <Task
                                key={task.get('_id')}
                                selected={
                                    task.get('_id') == this.state.selected
                                }
                                onSelect={id => this.setState({ selected: id })}
                                task={task}
                            />
                        ))
                        .toJS()}
                </div>

                <Row>
                    <Col>
                        <hr />
                    </Col>
                </Row>

                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormGroup>
                        <Row>
                            <Col className="col-8">
                                <Input
                                    type="text"
                                    onKeyDown={e => {
                                        if (e.keyCode != 13 || !e.metaKey)
                                            return;

                                        this.props.dispatch({
                                            type: 'TASK_NEW',
                                            task: this.state.task,
                                            top: true
                                        });

                                        this.setState({ task: '' });
                                    }}
                                    autoFocus={true}
                                    placeholder="New Task"
                                    autoComplete="off"
                                    name="task-new"
                                    value={this.state.task}
                                    onChange={({ target }) =>
                                        this.setState({ task: target.value })
                                    }
                                />
                            </Col>

                            <Col className="col-4">
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

        this.props.dispatch({ type: 'TASK_NEW', task: this.state.task });

        this.setState({ task: '' });
    }
}

export default withRouter(
    connect((state, props) => ({
        tasks: state.tasks
    }))(Tasks)
);
