const { getdb } = require("../utils/database");


const getCollection = () => getdb().collection("tickets");

async function totalTickets() {
    return getCollection().countDocuments({});
}

async function ticketsByCategory() {
    const Hardware = await getCollection().countDocuments({ category: "Hardware" });
    const Software = await getCollection().countDocuments({ category: "Software" });
    const Network = await getCollection().countDocuments({ category: "Network" });
    const Billing = await getCollection().countDocuments({ category: "Billing" });
    const Others = await getCollection().countDocuments({ category: "Others" });
    return { Hardware, Software, Network, Billing, Others };
}

async function ticketsByStatus() {
    const Open = await getCollection().countDocuments({ status: "Open" });
    const InProgress = await getCollection().countDocuments({ status: "InProgress" });
    const Resolved = await getCollection().countDocuments({ status: "Resolved" });
    return { Open, InProgress, Resolved };
}

async function resolvedToday() {
    const start = new Date();
    const end = new Date();
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    return await getCollection().countDocuments(
        {
            status: "Resolved",
            resolvedAt: {
                $gte: start,
                $lte: end
            }

        })
}

async function createdAt() {
    const data = await getCollection().find({}).toArray();
    const dateObj = {};

    data.forEach(ticket => {
        const day = new Date(ticket.createdAt).toISOString().split('T')[0];
        if (dateObj[day]) {
            dateObj[day]++;
        } else {
            dateObj[day] = 1;
        }
    });

    return dateObj;
}



module.exports = { totalTickets, ticketsByCategory, ticketsByStatus, resolvedToday, createdAt }