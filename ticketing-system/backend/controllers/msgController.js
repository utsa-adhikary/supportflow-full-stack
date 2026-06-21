const { ObjectId } = require("mongodb");
const ticketModel = require("../models/ticketModel");
const msgModel = require("../models/msgModel");

async function getChat(req, res) {
    try {
        if (!ObjectId.isValid(req.params.ticket_id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid ticket id"

            });

        }

        const ticket = await ticketModel.getTicketById(req.params.ticket_id);

        if (!ticket || (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString())) {
            return res.status(404).json({
                success: false,
                message: "ticket not found"
            })
        }

        const targetChat = await msgModel.getChat(req.params.ticket_id);

        return res.status(200).json(
            {
                status: "success",
                targetChat
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch messages"
        });
    }

}

async function sendChat(req, res) {
    try {

        if (!ObjectId.isValid(req.params.ticket_id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid ticket id"

            });

        }

        const ticket = await ticketModel.getTicketById(req.params.ticket_id);

        if (!ticket || (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString())) {
            return res.status(404).json({
                success: false,
                message: "ticket not found"
            })
        }

        let { text } = req.body;

        text = (text || "").trim();

        if (!text || text.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "text cannot be empty or exit maxlimit of 2000"
            })
        }

        const newMsg = {
            sender: {
                _id: req.user._id,
                name: req.user.name,
                role: req.user.role
            },
            text,
            timestamp: new Date()
        };

        await sendChat(req.params.ticket_id, newMsg);

        return res.status(200).json({
            status: "success",
            message: "message send successfull"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to send message"
        });
    }
}

module.exports = { getChat, sendChat }