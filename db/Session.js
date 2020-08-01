const {DataTypes} = require("sequelize");

module.exports = db => {
	db.Session = db.define(
		"session",
		{
			id: {
				primaryKey: true,
				type: DataTypes.UUID,
				allowNull: false
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			paranoid: true,
			updatedAt: false
		}
	);

	// User Association
	db.User.hasMany(db.Session);
	db.Session.belongsTo(db.User);
};
