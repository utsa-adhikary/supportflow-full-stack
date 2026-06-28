const { ObjectId } = require("mongodb");
const ticketModel = require("../models/ticketModel");
const msgModel = require("../models/msgModel");

async function getChat(req, res) {
    try {
        if (!ObjectId.isValid(req.params.ticket_id)) {

            return res.status(400).json({
                success: false,
                error: "Invalid ticket id"
            });

        }

        const ticket = await ticketModel.getTicketById(req.params.ticket_id);

        if (!ticket || (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString())) {
            return res.status(404).json({
                success: false,
                error: "ticket not found"
            })
        }

        const targetChat = await msgModel.getChat(req.params.ticket_id);

        return res.status(200).json({
            success: true,
            message: targetChat
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Unable to fetch messages"
        });
    }

}

async function sendChat(req, res) {
    try {

        if (!ObjectId.isValid(req.params.ticket_id)) {

            return res.status(400).json({

                success: false,
                error: "Invalid ticket id"
            });

        }

        const ticket = await ticketModel.getTicketById(req.params.ticket_id);

        if (!ticket || (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString())) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            })
        }

        const newMsgObj = req.body;

        const text = (newMsgObj.text || "").trim();

        if (!text || text.length > 2000) {
            return res.status(400).json({
                success: false,
                error: "Message text is required and must not exceed 2000 characters"
            })
        }

        await msgModel.sendChat(req.params.ticket_id, newMsgObj);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal Error"
        });
    }
}

module.exports = { getChat, sendChat }