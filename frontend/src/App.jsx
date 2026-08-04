import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import EntryPage from "./pages/EntryPage";
import QuestionBank from "./pages/QuestionBank";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/question-bank" element={<QuestionBank />} />
      </Routes>
    </>
  );
}
