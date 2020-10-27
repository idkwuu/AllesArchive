module.exports = (db) => {
  db.ArtistItem = db.define(
    "artist_item",
    {},
    {
      timestamps: false,
    }
  );

  // Artist
  db.Artist.belongsToMany(db.Item, {
    as: "items",
    through: db.ArtistItem,
    foreignKey: "artistId",
    otherKey: "itemId",
  });

  // Item
  db.Item.belongsToMany(db.Artist, {
    as: "artists",
    through: db.ArtistItem,
    foreignKey: "itemId",
    otherKey: "artistId",
  });
};
