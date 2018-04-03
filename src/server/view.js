export default config => app => {
    app.get('/', (req, res, next) => {
        res.render('index');
    })
}

