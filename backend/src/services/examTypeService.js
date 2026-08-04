const pool = require("../config/db");

async function getExamTypes() {
  const result = await pool.query("SELECT * FROM exam_types ORDER BY id");

  return result.rows;
}

module.exports = {
  getExamTypes,
};
