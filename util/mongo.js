const credentials = require("../credentials");
const { MongoClient } = require("mongodb");

let connection;

const getCollection = collectionName => connection.collection(collectionName);

const connect = (done) => {
    MongoClient.connect(credentials.mongodb, {
        ignoreUndefined: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
        }, (err, client) => {
        if (err) return done(err);

        connection = client.db("shootydot");

        return done();
    });
};

module.exports = getCollection;
module.exports.connect = connect;