const { ObjectId } = require("mongodb");
const { getdb } = require("../utils/database");

const getCollection = () => getdb().collection("tickets");


async function getTickets(query) {
    return await getCollection().find(query).toArray();
}

async function getTicketById(ticket_id) {
    return await getCollection().findOne({ _id: new ObjectId(ticket_id) });
}

async function createTicket(ticketObj) {
    await getCollection().insertOne(ticketObj);
}

async function updateTicket(ticket_id, updateObj) {
    await getCollection().updateOne({ _id: new ObjectId(ticket_id) }, { $set: updateObj })
}

async function deleteTicket(ticket_id) {
    // delete ticket
    await getCollection().deleteOne({ _id: new ObjectId(ticket_id) });

    // message delete
    await getdb().collection("messages").deleteOne({ ticket_id: new ObjectId(ticket_id) });
}

module.exports = { getTickets, getTicketById, createTicket, updateTicket, deleteTicket }