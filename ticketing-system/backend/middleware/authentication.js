const express = require("express");
const getCookies = require("../utils/cookieParser");
const { getdb } = require("../utils/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config({ quiet: true });

async function authentication(req, res, next) {
    const cookieObj = getCookies(req.headers.cookie);
    
    if (!cookieObj.token) {
        return res.status(401).json(
            {
                success: false,
                error: "Authentication required"
            }
        );
    }

    try {
        const verifyPayload = jwt.verify(cookieObj.token, process.env.JWT_SECRET);

        const user = await getdb().collection("users").findOne({ _id: new ObjectId(verifyPayload._id) });

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token"
        });
    }

    next();
}

module.exports = authentication