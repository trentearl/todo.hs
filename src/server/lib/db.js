import pg from 'pg';
import { defer } from 'bluebird';

export default connectionString => (query, attr) => {
    const deferred = defer();

    pg.connect(connectionString, function(error, client, done) {
        if (error) return deferred.reject(error);

        client.query(query, attr, (error, result) => {
            if (error) return deferred.reject(error);

            result.rows = JSON.parse(JSON.stringify(result.rows));

            deferred.resolve(result);
            done();
        });
    });

    return deferred.promise;
};
