import db from '../lib/db';

export const taskNew = ({ task }) => (dispatch, getState) => {
    var maxOrdinal = Math.max(
        ...getState().tasks
            .map(task => task.get('index')).toJS()
    ) || 0;

    db.post({ task: task, done: false, ordinal: maxOrdinal + 1  })
        .then(_ => dispatch(tasksRefresh()))
}

export const taskUnDone = task => dispatch => {
    db.put({
        ...task.toJS(),
        ...{ done: false }
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
    db.allDocs({ attachments: true, include_docs: true })
        .then(({ rows }) => {
            var tasks = rows.map(({ doc }) => doc)

            dispatch({
                type: 'TASKS_REFRESH',
                tasks
            });
        });
}


