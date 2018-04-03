import DB from 'pouchdb';

var db = new DB('todo');

var sync = DB.sync('https://couch.trentearl.com/todo', 'todo', {
    live: true,
    username: 'admin',
    password: 'we are trent',
    retry: true
})
.on('change', function (info) {
    console.log('change ', info);
})
.on('paused', function (err) {
    console.log('paused ', err);
})
.on('active', function () {
    console.log('active');
})
.on('denied', function (err) {
    console.log('denied', err);
})
.on('complete', function (info) {
    console.log('compete', info);
})
.on('error', function (err) {
    console.log('error', err);
});


export default db;

