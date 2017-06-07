var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var sequelize;

if (env === 'production') {
	console.log(DATABASE_URL);
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	})
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname +'/data/dev-todo-api.sqlite'
	}); 
}

var db = {};

db.user = sequelize.import(__dirname + '/models/user.js');
db.message = sequelize.import(__dirname + '/models/message.js');

db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports = db;