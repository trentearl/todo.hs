import bodyParser from 'body-parser';
import express from 'express';
import { join } from 'path';

import DB from './lib/db';
import View from './view';

const app = express();

const config = {
    db: DB('postges://localhost/todo')
};

var port = 8532;

app.use(express.static(join(__dirname, '..', '..', 'build')));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/../../html`);

app.use(
    bodyParser.json({
        limit: '4mb'
    })
);

View(config)(app);

app.listen(port);
