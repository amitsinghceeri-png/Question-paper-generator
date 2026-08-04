const express = require("express");

const router = express.Router();

const questionController = require("../controllers/questionController");

router.get("/:chapterId/:examTypeId", questionController.getQuestions);

module.exports = router;
