const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                message: "Access Denied. No Token Provided."
            });
        }

        // Remove "Bearer " if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Invalid or Expired Token"
        });

    }

};

module.exports = authMiddleware;