const { ObjectId } = require("mongodb");
const generateTicketNumber = require("../utils/generateTicketNumber");
const ticketModel = require("../models/ticketModel");

async function getTickets(req, res) {
    try {

        const query = req.user.role === "admin" ? {} : { createdBy: req.user._id }
        const tickets = await ticketModel.getTickets(query);

        res.status(200).json({
            success: true,
            tickets
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to fetch tickets"
        });

    }
}

async function getTicketById(req, res) {
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

        return res.status(200).json({
            success: true,
            ticket: ticket
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch ticket"
        });
    }
}

async function createTicket(req, res) {
    try {

        let { title, category, priority, description } = req.body;

        title = (title || "").trim();
        category = (category || "").trim();
        priority = (priority || "").trim();
        description = (description || "").trim();

        if (!title || !category || !priority || !description) {
            return res.status(400).json({
                success: false,
                message: " All fields are required"
            })
        }

        const ticketNumber = await generateTicketNumber(req, res);

        const createdAt = new Date();

        const ticketObj = {
            ticketNumber,
            title, category, priority, description,
            status: "InProgress",
            createdBy: req.user._id,
            createdAt: createdAt,
            resolvedAt: null,
            updatedAt: createdAt
        }

        await ticketModel.createTicket(ticketObj)

        return res.status(201).json({
            success: true,
            message: "ticket created successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create ticket"
        });
    }
}

async function updateTicket(req, res) {
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

        let { status, category, priority } = req.body;

        status = (status || "").trim();
        category = (category || "").trim();
        priority = (priority || "").trim();

        if (req.user.role === "admin") {
            if (!status || !category || !priority) {
                return res.status(400).json({
                    success: false,
                    message: " All fields are required"
                })
            } else if (
                !(["Open", "InProgress", "Resolved"].includes(status)) ||
                !(["Hardware", "Software", "Network", "Billing", "Others"].includes(category)) ||
                !(["High", "Medium", "Low"].includes(priority))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "invalid fields"
                })
            } else if (status === ticket.status && category === ticket.category && priority === ticket.priority) {
                return res.status(409).json({
                    success: false,
                    message: "field already exists"
                })
            } else {
                let resolvedAt = ticket.resolvedAt;

                if (ticket.status === "Resolved") {
                    if (status !== "Resolved") {
                        resolvedAt = null;
                    }
                } else {
                    if (status === "Resolved") {
                        resolvedAt = new Date();
                    }
                }

                await ticketModel.updateTicket(req.params.ticket_id, { status, category, priority, resolvedAt, updatedAt: new Date() })
            }

        } else {
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: " All fields are required"
                })
            } else if (status !== "Resolved") {
                return res.status(400).json({
                    success: false,
                    message: "invalid status"
                })
            } else if (ticket.status === "Resolved") {
                return res.status(409).json({
                    success: false,
                    message: "ticket already resolved"
                })
            } else {
                await ticketModel.updateTicket(req.params.ticket_id, { status, resolvedAt: new Date(), updatedAt: new Date() })
            }
        }

        return res.status(200).json({
            success: true,
            message: "Ticket updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update ticket"
        });
    }
}

async function deleteTicket(req, res) {
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

        await ticketModel.deleteTicket(req.params.ticket_id)

        return res.status(200).json({
            success: true,
            message: `Ticket ${ticket.ticketNumber} and all associated messages deleted successfully.`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete ticket"
        });
    }
}

module.exports = { getTickets, getTicketById, createTicket, updateTicket, deleteTicket };