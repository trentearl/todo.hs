
export default config => app => {
    app.get('/tasks.json', (req, res, next) => {
        config.db(`
            select distinct on (task_id) *
            from tasks
            order by task_id, created_at desc
        `)
        .then(data => data.rows)
        .then(data => res.json(data), next)
    });

    app.post('/task/:id\.json', (req, res, next) => {
        config.db(
            `
            insert into tasks(task_id, task, completed, hidden)
            values
            ($1, $2, $3, $4)
            `,
            [
                req.params.id,
                req.body.task,
                req.body.completed,
                req.body.hidden
            ]
        )
        .then(_ => res.json({}), next)
    });

    app.put('/task/new.json', (req, res, next) => {
        config.db(
            `
            insert into tasks(task_id, task)
            values
            ((select coalesce(max(task_id) + 1, 0) from tasks), $1)
            `,
            [ req.body.task ]
        )
        .then(_ => res.json({}), next)
    });

}

