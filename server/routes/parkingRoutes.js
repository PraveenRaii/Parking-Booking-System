const express = require("express");

const router = express.Router();

const {

getAllParking,
getParkingById,
addParking,
updateParking,
deleteParking

} = require("../controllers/parkingController");

router.get("/", getAllParking);

router.get("/:id", getParkingById);

router.post("/", addParking);

router.put("/:id", updateParking);

router.delete("/:id", deleteParking);

module.exports = router;