var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-webapps.sqlite'
});

var db = {};

db.user = sequelize.import(__dirname + '/models/user.js');
db.message = sequelize.import(__dirname + '/models/message.js');

db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports = db;