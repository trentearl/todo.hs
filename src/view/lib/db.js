import DB from 'pouchdb';

var db = new DB('todo');

export default {
    allDocs: args => db.allDocs(args),
    post: args => db.post(args),
    put: args => db.put(args),
    remove: (id, rev) => db.remove(id, rev)
};
