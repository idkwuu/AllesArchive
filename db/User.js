const {DataTypes} = require("sequelize");

module.exports = db => {
	db.User = db.define(
		"user",
		{
			id: {
				primaryKey: true,
				type: DataTypes.UUID,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			nickname: {
				type: DataTypes.STRING,
				allowNull: false
			},
			tag: {
				type: DataTypes.STRING,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING
			},
			email: {
				type: DataTypes.STRING
			},
			xp: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false
			},
			country: {
				type: DataTypes.STRING
			},
			bDay: {
				type: DataTypes.TINYINT
			},
			bMonth: {
				type: DataTypes.TINYINT
			},
			bYear: {
				type: DataTypes.SMALLINT
			},
			plus: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			stripeCustomerId: {
				type: DataTypes.STRING
			}
		},
		{
			updatedAt: false,
			paranoid: true
		}
	);
};
