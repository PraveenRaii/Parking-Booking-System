const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post("/", upload.single("image"), (req, res) => {

    console.log("File =>", req.file);

    res.json({
        success: true,
        file: req.file
    });

});

module.exports = router;