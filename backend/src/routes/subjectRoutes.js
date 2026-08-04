const express = require("express");

const router = express.Router();

const subjectController = require("../controllers/subjectController");

router.get("/:classId", subjectController.getSubjects);

module.exports = router;
