import { Map, fromJS } from 'immutable';

export default (tasks, action) => {
    if (action.type == 'TASKS_REFRESH') {
        return fromJS(action.tasks.sort((a, b) => a.index - b.index));
    }

    return tasks || null;
}

