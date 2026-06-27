const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication")
const authController = require("../controllers/authController");

router.post("/register", express.json(), authController.register)

router.post("/login", express.json(), authController.login);

router.get("/me", authentication, authController.me);

router.get("/logout", authentication, authController.logout);

module.exports = router;