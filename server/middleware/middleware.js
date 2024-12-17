const jwt = require("jsonwebtoken")

// authentication
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ msg: "No token provided, Access Denied" })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(400).json({ msg: "Invalid token" })
    }
}

// authorization
const authorizeRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(401).json({ msg: "Access Denied" })
    }
    next()
}
module.exports = {authenticateUser, authorizeRole}