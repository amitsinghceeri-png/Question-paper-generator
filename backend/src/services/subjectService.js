const pool = require("../config/db");

async function getSubjectsByClass(classId) {
  const result = await pool.query(
    `SELECT * FROM subjects
     WHERE class_id = $1
     ORDER BY id`,
    [classId],
  );

  return result.rows;
}

module.exports = {
  getSubjectsByClass,
};
