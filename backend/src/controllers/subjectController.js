const subjectService = require("../services/subjectService");

async function getSubjects(req, res) {
  try {
    const { classId } = req.params;

    const subjects = await subjectService.getSubjectsByClass(classId);

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
}

module.exports = {
  getSubjects,
};
