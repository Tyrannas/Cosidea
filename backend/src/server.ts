let config = require('../config.js');

import * as express     from 'express';
import * as socket_io   from 'socket.io';
import * as db          from './model/db';
import * as router      from './routes/api';
import * as socket      from './routes/socket'


let app     = express();
let server  = require('http').Server(app);
let io      = socket_io(server);

let port    = process.env.PORT || 3000;


app.set('secret', 'todochangesecrettosomershprivatekeyinaseperatefilehiddenfromyou');
app.set('saltRounds', 10);

app.use('/', router.api);           //  Set API Router

io.on('connection', (s) => socket.route(s as socket.Socket, app));  //  Set socket.io handler

db.connectDb(config.dbconf);        //  Initialize Connection with Database

server.listen(port);

