const chapterService = require("../services/chapterService");

async function getChapters(req, res) {
  try {
    const { subjectId } = req.params;

    const chapters = await chapterService.getChaptersBySubject(subjectId);

    res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chapters",
    });
  }
}

module.exports = {
  getChapters,
};
