async function customerCheck(req, res, next) {

    if (req.user.role !== "customer") {
        return res.status(403).json({
            success: false,
            error: "Forbidden"
        });
    }

    next();
}


async function adminCheck(req, res, next) {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Forbidden"
        });
    }

    next();
}

module.exports = { customerCheck, adminCheck };