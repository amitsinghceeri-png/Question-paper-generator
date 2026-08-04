const examTypeService = require("../services/examTypeService");

async function getExamTypes(req, res) {
  try {
    const examTypes = await examTypeService.getExamTypes();

    res.status(200).json({
      success: true,
      data: examTypes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam types",
    });
  }
}

module.exports = {
  getExamTypes,
};
