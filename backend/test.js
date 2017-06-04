let config = require('config/db');
let db = require('model/db.js');

db.connectDb(config.dbconf);



// var bcrypt = require('bcrypt');
// const saltRounds = 10;
// const password = "test";

// bcrypt.hash(password, saltRounds, function(err, hash) {
// 	console.log(hash.length);
// 	bcrypt.compare(password, "$2a$10$BMpigDCvyzfqtiqJen3I6.T.y1YdeLrQIKUWivokWLDHnyQZY9gOO", function(err, res) {
// 		console.log(res);
// 	});
// });
