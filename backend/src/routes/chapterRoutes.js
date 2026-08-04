const express = require("express");

const router = express.Router();

const chapterController = require("../controllers/chapterController");

router.get("/:subjectId", chapterController.getChapters);

module.exports = router;
