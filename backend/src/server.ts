import * as express     from 'express';
import * as bodyParser  from 'body-parser';
import * as config      from './config/db';
import * as db          from './model/db';
import * as router      from './routes/api';

let app     = express();
let port    = process.env.PORT || 3000;


app.use(bodyParser.json() );        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('secret', 'hahahahahahahahhahahahahahahahahahaahahah');
app.use('/', router.api);           //  Set API Router

// import * as project from './model/project';
// import * as idea from './model/idea';
// import * as tag from './model/tag';

db.connectDb(config.dbconf);        //  Initialize Connection with Database


app.listen(port);

// var bcrypt = require('bcrypt');
// const saltRounds = 10;
// const password = "test";

// bcrypt.hash(password, saltRounds, function(err, hash) {
// 	console.log(hash.length);
// 	bcrypt.compare(password, "$2a$10$BMpigDCvyzfqtiqJen3I6.T.y1YdeLrQIKUWivokWLDHnyQZY9gOO", function(err, res) {
// 		console.log(res);
// 	});
// });
