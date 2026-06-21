const { MongoClient } = require("mongodb");

let db;

async function connectdb(MONGO_URI) {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db("ticketing_system");
        console.log("Successfully Connectd to DataBase...");
    } catch (error) {
        console.log("unable to conect to db", error);
        throw error;
    }
}

function getdb() {
    if (!db) {
        throw new Error("Database not connected");
    }
    return db;
}

module.exports = { connectdb, getdb };