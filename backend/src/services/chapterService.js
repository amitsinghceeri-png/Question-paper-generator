const pool = require("../config/db");

async function getChaptersBySubject(subjectId) {
  const result = await pool.query(
    `SELECT * FROM chapters
     WHERE subject_id = $1
     ORDER BY chapter_no`,
    [subjectId],
  );

  return result.rows;
}

module.exports = {
  getChaptersBySubject,
};
