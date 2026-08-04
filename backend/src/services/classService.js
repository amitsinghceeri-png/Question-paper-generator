const pool = require("../config/db");

async function getAllClasses() {
  const result = await pool.query("SELECT * FROM classes ORDER BY id");

  return result.rows;
}

module.exports = {
  getAllClasses,
};
