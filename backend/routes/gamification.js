const express = require("express");
const router = express.Router();
const { awardPoints, getUserStats } = require("../controllers/gamificationController");

router.post("/points", awardPoints);
router.get("/stats", getUserStats);

module.exports = router;