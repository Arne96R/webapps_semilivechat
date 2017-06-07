module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 252]
			}
		},
		isOpen: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		isAnswered: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	});
};