const { getdb } = require("../utils/database");
const { ObjectId } = require("mongodb");

const getCollection = () => getdb().collection("messages");


async function getChat(ticket_id) {

    return (await getCollection().findOne({ ticket_id: new ObjectId(ticket_id) }) || { messages: [] }).messages;

}

async function sendChat(ticket_id, newMsg) {

    await getCollection().updateOne(

        { ticket_id: new ObjectId(ticket_id) },
        {
            $setOnInsert: { ticket_id: new ObjectId(ticket_id) },
            $push: { messages: newMsg }
        },
        { upsert: true }

    )
}


module.exports = { getChat, sendChat }