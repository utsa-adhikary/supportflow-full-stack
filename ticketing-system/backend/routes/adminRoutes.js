const express = require("express");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const statsModel = require("../models/statsModel");

const router = express.Router();

router.get("/stats", authentication, authorization.adminCheck, async (req, res) => {
    try {

        const ticketCount = await statsModel.totalTickets();
        const ticketsByStatus = await statsModel.ticketsByStatus();
        const ticketsByCategory = await statsModel.ticketsByCategory();
        const resolvedToday = await statsModel.resolvedToday();
        const createdAt = await statsModel.createdAt();

        return res.status(200).json({
            success: true,
            stat: {
                totalTickets: ticketCount,
                ticketsByStatus,
                resolvedToday,
                ticketsByCategory,
                createdAt
            }
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching statistics."
        });
    }
})

module.exports = router

