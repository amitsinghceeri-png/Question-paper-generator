const classService = require("../services/classService");

async function getClasses(req, res) {
  try {
    const classes = await classService.getAllClasses();

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
}

module.exports = {
  getClasses,
};
