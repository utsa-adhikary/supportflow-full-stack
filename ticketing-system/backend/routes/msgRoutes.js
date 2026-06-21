const express = require("express");
const authentication = require("../middleware/authentication");
const msgController = require("../controllers/msgController");

const router = express.Router();


router.get("/:ticket_id/messages", authentication, msgController.getChat);

router.post("/:ticket_id/messages", authentication, msgController.sendChat);

module.exports = router;