import * as express     from 'express';
import * as config      from './config/db';
import * as db          from './model/db';
import * as router      from './routes/api';

let app     = express();
let port    = process.env.PORT || 3000;


app.set('secret', 'todochangesecrettosomershprivatekeyinaseperatefilehiddenfromyou');
app.set('saltRounds', 10);

app.use('/', router.api);           //  Set API Router

db.connectDb(config.dbconf);        //  Initialize Connection with Database

app.listen(port);

