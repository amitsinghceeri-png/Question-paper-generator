const questionService = require("../services/questionService");

async function getQuestions(req, res) {
  try {
    const { chapterId, examTypeId } = req.params;

    const questions = await questionService.getQuestions(chapterId, examTypeId);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
}

module.exports = {
  getQuestions,
};
