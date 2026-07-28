const express = require("express");
const router = express.Router();

const {
    getUsers,
    deleteUser,
    getProfile,
updateProfile
} = require("../controllers/userController");

router.get("/", getUsers);

router.delete("/:id", deleteUser);
router.get("/:id",getProfile);

router.put("/:id",updateProfile);

module.exports = router;