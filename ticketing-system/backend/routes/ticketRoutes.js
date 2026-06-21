const express = require("express");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { route } = require("./authRoutes");

router.get("/tickets", authentication, ticketController.getTickets);

router.get("/tickets/:ticket_id", authentication, ticketController.getTicketById);

router.post("/tickets", authentication, authorization.customerCheck, ticketController.createTicket);

router.patch("/tickets/:ticket_id", authentication, ticketController.updateTicket);

router.delete("/tickets/:ticket_id", authentication, ticketController.deleteTicket);

module.exports = router;