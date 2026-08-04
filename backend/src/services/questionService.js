const pool = require("../config/db");

async function getQuestions(chapterId, examTypeId) {
  const result = await pool.query(
    `
    SELECT *
    FROM questions
    WHERE chapter_id = $1
      AND exam_type_id = $2
      AND status = true
    ORDER BY marks ASC, id ASC
    `,
    [chapterId, examTypeId],
  );

  return result.rows;
}

module.exports = {
  getQuestions,
};
