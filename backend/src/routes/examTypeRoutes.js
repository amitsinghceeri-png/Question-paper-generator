const express = require("express");

const router = express.Router();

const examTypeController = require("../controllers/examTypeController");

router.get("/", examTypeController.getExamTypes);

module.exports = router;
