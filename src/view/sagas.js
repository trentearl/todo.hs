import { call, select, put, takeEvery, all } from 'redux-saga/effects';

import db from './lib/db';

function* taskNew(action) {
    var { task, top } = action;
    var index = null;

    var tasks = yield select(state => state.tasks);

    if (top)
        index =
            (Math.min(...tasks.map(task => task.get('index')).toJS()) || 0) - 2;
    else
        index =
            (Math.max(...tasks.map(task => task.get('index')).toJS()) || 0) + 2;

    yield call(db.post, { task, done: false, index });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskRefresh() {
    var docs = yield call(db.allDocs, {
        attachments: true,
        include_docs: true
    });

    var tasks = docs.rows.map(({ doc }) => doc);

    yield put({
        type: 'TASKS_REFRESHED',
        tasks
    });
}

function* taskDown(action) {
    var tasks = yield select(store => store.tasks);

    var index = Math.max(...tasks.map(task => task.get('index')).toJS()) + 2;

    var { task } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ index }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskUp(action) {
    var tasks = yield select(store => store.tasks);

    var index = Math.min(...tasks.map(task => task.get('index')).toJS()) - 2;

    var { task } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ index }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskReorder(action) {
    var { task, index } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ index }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskRemove(action) {
    var { task } = action;

    yield call(db.remove, task.get('_id'), task.get('_rev'));

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskUnDone(action) {
    var { task } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ done: false }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskDone(action) {
    var { task } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ done: true }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

function* taskTextChange(action) {
    var { task, taskText } = action;

    yield call(db.put, {
        ...task.toJS(),
        ...{ task: taskText }
    });

    yield put({ type: 'TASKS_REFRESH' });
}

export default function* rootSaga() {
    yield all([
        yield takeEvery('TASKS_REFRESH', taskRefresh),
        yield takeEvery('TASK_NEW', taskNew),
        yield takeEvery('TASK_TEXT_CHANGE', taskTextChange),
        yield takeEvery('TASK_DONE', taskDone),
        yield takeEvery('TASK_UNDONE', taskUnDone),
        yield takeEvery('TASK_REORDER', taskReorder),
        yield takeEvery('TASK_UP', taskUp),
        yield takeEvery('TASK_DOWN', taskDown),
        yield takeEvery('TASK_REMOVE', taskRemove)
    ]);
}
