import { Map, fromJS, Set } from 'immutable';

export default (tasks, action) => {
    if (action.type == 'TASKS_REFRESHED') {
        return fromJS(
            action.tasks.sort((a, b) => {
                if (a.done == b.done) return a.index - b.index;
                else if (a.done && !b.done) return 1;
                else return -1;
            })
        );
    }

    return tasks || new Set();
};
