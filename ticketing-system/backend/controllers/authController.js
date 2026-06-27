const { getdb } = require("../utils/database");
const createJWT = require("../utils/createJWT");
const bcrypt = require("bcrypt");
require("dotenv").config({ quiet: true });

async function register(req, res) {
    try {

        let { name, email, password } = req.body;

        name = (name || "").trim();
        email = (email || "").trim();
        password = password || "";

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Missing or invalid fields"
            });
        }

        if (password.trim().length < 4) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 4 characters long"
            });
        }

        let db = getdb();

        if (await db.collection("users").findOne({ email })) {
            return res.status(409).json({
                success: false,
                error: "Email is already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        let user = await db.collection("users").insertOne({ name, email, role: "customer", passwordHash, createdAt: new Date() });

        // jwt token
        const token = createJWT(
            {
                _id: user.insertedId,
                name: name,
                role: "customer"
            }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);


        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                _id: user.insertedId,
                name: name,
                role: "customer"
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Registration failed"
        });
    }
}

async function login(req, res) {
    try {
        let { email, password } = req.body;

        email = (email || "").trim();
        password = (password || "").trim();

        if (!email || !password) {
            return res.status(400).json({
                "success": false,
                "error": "Missing or invalid fields"
            });
        }

        let db = getdb();

        let user = await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(401).json({
                "success": false,
                "error": "Invalid email or password"
            });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            return res.status(401).json({
                "success": false,
                "error": "Invalid email or password"
            });
        }

        // jwt token
        const token = createJWT(
            {
                _id: user._id,
                name: user.name,
                role: user.role
            }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}

async function me(req, res) {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "data fetch failed"
        })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal Error"
        })
    }
}

module.exports = { register, login, me, logout }