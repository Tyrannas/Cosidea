import * as config from './config/db';
import * as db from './model/db';
import * as project from './model/project';
import * as idee from './model/idee';

db.connectDb(config.dbconf);

// project.addProject("t3st", "some project")
// .then(console.log)
// .catch(() => {});

// project.findProjectByTitle('t2st')
// .then((projs) => {
//         console.log(projs.description);
// })
// .catch(() => console.log('err'));

// idee.addIdee(1, 'id', 'amazing idee')
// .then(console.log)


idee.getIdeeByProjectId(1)
.then(console.log)
.catch(console.log);

// var bcrypt = require('bcrypt');
// const saltRounds = 10;
// const password = "test";

// bcrypt.hash(password, saltRounds, function(err, hash) {
// 	console.log(hash.length);
// 	bcrypt.compare(password, "$2a$10$BMpigDCvyzfqtiqJen3I6.T.y1YdeLrQIKUWivokWLDHnyQZY9gOO", function(err, res) {
// 		console.log(res);
// 	});
// });
