import { Map, fromJS } from 'immutable';

export default (tasks, action) => {
    if (action.type == 'TASKS_REFRESH') {
        return fromJS(
            action.tasks.sort(
                (a, b) => {
                    if (a.done == b.done)
                        return a.index - b.index
                    else if (a.done && !b.done)
                        return 1;
                    else return -1;
                }
            )
        );
    }

    return tasks || null;
}

