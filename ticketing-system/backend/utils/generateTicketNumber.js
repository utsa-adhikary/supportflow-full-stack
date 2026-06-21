const { getdb } = require("./database");

async function generateTicketNumber(req, res) {
    try {
        const db = getdb();

        const ticketCount = (await db.collection("counters").findOne({ name: "counter" }) || { serial: 0 }).serial;

        await db.collection("counters").updateOne(
            { name: "counter" },
            {
                $setOnInsert: { name: "counter" },
                $set: { serial: (ticketCount + 1) }
            },
            { upsert: true }
        )

        return `TKT-${String(ticketCount + 1).padStart(3, "0")}`;

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to genetrate ticket number."
        });
    }
}

module.exports = generateTicketNumber

