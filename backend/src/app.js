const express = require("express");
const cors = require("cors");

const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const examTypeRoutes = require("./routes/examTypeRoutes");
const questionRoutes = require("./routes/questionRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/exam-types", examTypeRoutes);
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
  res.send("Question Paper Generator API");
});

module.exports = app;
