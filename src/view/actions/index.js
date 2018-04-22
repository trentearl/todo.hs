import db from '../lib/db';

export const taskNew = ({ task, top }) => (dispatch, getState) => {
    var index = null;
    
    if (top)
        index = (Math.min(
        ...getState().tasks
            .map(task => task.get('index'))
            .toJS()
        ) || 0) - 2;
    else
        index = (Math.max(
        ...getState().tasks
            .map(task => task.get('index'))
            .toJS()
        ) || 0) + 2;

    db.post({ task: task, done: false, index })
        .then(_ => dispatch(tasksRefresh()))
}

export const taskReorder = ({ task, index }) => dispatch => {
    db.put({
        ...task.toJS(),
        ...{ index }
    })
    .then(_ => dispatch(tasksRefresh()))
}

export const taskUnDone = task => dispatch => {
    db.put({
        ...task.toJS(),
        ...{ done: false }
    })
    .then(_ => dispatch(tasksRefresh()))
}

export const taskDown = task => (dispatch, getState) => {
    var index = Math.max(
        ...getState()
            .tasks
            .map(task => task.get('index'))
            .toJS()
    ) + 2;

    db.put({
        ...task.toJS(),
        ...{ index }
    })
    .then(_ => dispatch(tasksRefresh()))
}

export const taskUp = task => (dispatch, getState) => {
    var index = Math.min(
        ...getState()
            .tasks
            .map(task => task.get('index'))
            .toJS()
    ) - 2;

    db.put({
        ...task.toJS(),
        ...{ index }
    })
    .then(_ => dispatch(tasksRefresh()))
}

export const taskDone = task => dispatch => {
    db.put({
        ...task.toJS(),
        ...{ done: true }
    })
    .then(_ => dispatch(tasksRefresh()))
}

export const taskDelete = task => dispatch => {
    db.remove(task.get('_id'), task.get('_rev'))
        .then(_ => dispatch(tasksRefresh()))
}

export const tasksRefresh = _  => dispatch => {
    var i = 0;
    db.allDocs({ attachments: true, include_docs: true })
        .then(({ rows }) => {
            var tasks = rows.map(({ doc }) => doc)

            dispatch({
                type: 'TASKS_REFRESH',
                tasks
            });
        });
}

export const tasksRefreshSync = rows => dispatch => {
    var tasks = rows.map(({ doc }) => doc)

    dispatch({
        type: 'TASKS_REFRESH',
        tasks
    });
}


