module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message', {
		text: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		user: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 252]
			}
		},
		sender: {
			type: DataTypes.STRING,
			allowNull: false
		},
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,200]
			}
		},
		ts: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {}
		}
	});
};