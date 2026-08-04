import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  FileText,
  Printer,
  X,
  Loader2,
  BookOpen,
  GraduationCap,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

export default function QuestionBank({ selection, setStep }) {
  const chapterId = selection?.chapterId;
  const examTypeId = selection?.examTypeId;

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("select"); // "select" or "preview"

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!chapterId || !examTypeId) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/questions/${chapterId}/${examTypeId}`
        );

        if (res.data && res.data.success) {
          setQuestions(res.data.data || []);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Fetch Questions Error:", err);
        toast.error("Failed to load questions from database");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [chapterId, examTypeId]);

  // Group questions dynamically by marks
  const groupedQuestions = useMemo(() => {
    const groups = {};
    questions.forEach((q) => {
      const m = q.marks || 1;
      if (!groups[m]) {
        groups[m] = [];
      }
      groups[m].push(q);
    });
    return groups;
  }, [questions]);

  // Sorted list of unique marks keys (e.g. [1, 2, 3, 5])
  const marksKeys = useMemo(() => {
    return Object.keys(groupedQuestions)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedQuestions]);

  const totalSelectedCount = selected.length;
  
  const totalSelectedMarks = useMemo(() => {
    return questions
      .filter((q) => selected.includes(q.id))
      .reduce((sum, q) => sum + (q.marks || 0), 0);
  }, [questions, selected]);

  const toggleQuestion = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const isGroupAllSelected = (marksGroup) => {
    const groupIds = groupedQuestions[marksGroup].map((q) => q.id);
    return groupIds.every((id) => selected.includes(id));
  };

  const toggleGroupSelection = (marksGroup) => {
    const groupIds = groupedQuestions[marksGroup].map((q) => q.id);
    if (isGroupAllSelected(marksGroup)) {
      setSelected(selected.filter((id) => !groupIds.includes(id)));
      toast.success(`Deselected all ${marksGroup} Marks questions`);
    } else {
      const newSelected = [...selected];
      groupIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelected(newSelected);
      toast.success(`Selected all ${marksGroup} Marks questions`);
    }
  };

  // Render the A4 Question Paper Preview
  if (view === "preview") {
    return (
      <div className="w-full space-y-6 print:space-y-0">
        
        {/* Action Bar (hidden in print) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 print:hidden">
          <div className="space-y-1">
            <button
              onClick={() => setView("select")}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Question Selection</span>
            </button>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              Question Paper Preview
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView("select")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Edit Questions
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition cursor-pointer shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
            >
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* On-screen A4 Paper Mockup (hidden in print) */}
        <div className="bg-slate-100 py-8 px-4 rounded-2xl border border-slate-200 flex justify-center print:hidden">
          <div className="w-full max-w-3xl min-h-[297mm] bg-white shadow-[0_10px_45px_rgba(0,0,0,0.08)] border border-slate-300 p-12 font-serif text-slate-950 transition-all">
            {/* Board Style Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6 mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {selection?.examTypeName || "Examination"}
              </h2>
              <div className="flex justify-between text-sm font-semibold tracking-tight px-2">
                <span>Class: {selection?.className}</span>
                <span>Subject: {selection?.subjectName}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold tracking-tight px-2 border-t pt-2 border-slate-300">
                <span>Chapter: {selection?.chapterName}</span>
                <span>Max Marks: {totalSelectedMarks}</span>
              </div>
            </div>

            {/* General Instructions */}
            <div className="mb-8 text-xs space-y-1.5 leading-relaxed font-sans italic border-b border-dashed pb-4 text-slate-800">
              <p className="font-bold uppercase text-slate-950 not-italic">General Instructions:</p>
              <p>1. All questions are compulsory. Marks are indicated against each question.</p>
              <p>2. Please check that this question paper contains {totalSelectedCount} questions.</p>
              <p>3. Section-wise questions must be attempted sequentially.</p>
            </div>

            {/* Grouped sections */}
            <div className="space-y-8">
              {marksKeys.map((marks, idx) => {
                const groupQuestions = groupedQuestions[marks].filter(q => selected.includes(q.id));
                if (groupQuestions.length === 0) return null;
                const sectionLetter = String.fromCharCode(65 + idx);

                return (
                  <div key={marks} className="space-y-4">
                    <h4 className="font-bold border-b border-slate-800 pb-1 text-base uppercase tracking-wider flex justify-between">
                      <span>Section {sectionLetter} ({marks} Mark{marks > 1 ? "s" : ""} Questions)</span>
                      <span className="text-sm font-normal normal-case">[{groupQuestions.length} × {marks} = {groupQuestions.length * marks} Marks]</span>
                    </h4>
                    
                    <ol className="list-decimal pl-5 space-y-4">
                      {groupQuestions.map((q) => (
                        <li key={q.id} className="pl-2 leading-relaxed">
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-sm md:text-base">{q.question_text}</span>
                            <span className="font-bold text-sm select-none">[{marks}]</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real print sheet (only visible in print) */}
        <div className="hidden print:block bg-white text-black p-[15mm] m-0 border-none shadow-none w-full max-w-none h-auto font-serif text-[12pt] leading-relaxed">
          {/* Header */}
          <div className="text-center space-y-2 border-b-2 border-slate-850 pb-6 mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wide">
              {selection?.examTypeName || "Examination"}
            </h2>
            <div className="flex justify-between text-sm font-semibold tracking-tight px-2">
              <span>Class: {selection?.className}</span>
              <span>Subject: {selection?.subjectName}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold tracking-tight px-2 border-t pt-2 border-slate-300">
              <span>Chapter: {selection?.chapterName}</span>
              <span>Max Marks: {totalSelectedMarks}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 text-xs space-y-1.5 leading-relaxed font-sans italic border-b border-dashed pb-4 text-slate-800">
            <p className="font-bold uppercase text-slate-950 not-italic">General Instructions:</p>
            <p>1. All questions are compulsory. Marks are indicated against each question.</p>
            <p>2. Please check that this question paper contains {totalSelectedCount} questions.</p>
            <p>3. Section-wise questions must be attempted sequentially.</p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {marksKeys.map((marks, idx) => {
              const groupQuestions = groupedQuestions[marks].filter(q => selected.includes(q.id));
              if (groupQuestions.length === 0) return null;
              const sectionLetter = String.fromCharCode(65 + idx);

              return (
                <div key={marks} className="space-y-4 print:break-inside-avoid">
                  <h4 className="font-bold border-b border-slate-800 pb-1 text-base uppercase tracking-wider flex justify-between">
                    <span>Section {sectionLetter} ({marks} Mark{marks > 1 ? "s" : ""} Questions)</span>
                    <span className="text-sm font-normal normal-case">[{groupQuestions.length} × {marks} = {groupQuestions.length * marks} Marks]</span>
                  </h4>
                  
                  <ol className="list-decimal pl-5 space-y-4">
                    {groupQuestions.map((q) => (
                      <li key={q.id} className="pl-2 leading-relaxed print:break-inside-avoid">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-sm md:text-base">{q.question_text}</span>
                          <span className="font-bold text-sm select-none">[{marks}]</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Question Selection View
  return (
    <div className="w-full space-y-6">
      {/* QuestionBank Header Navigation */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Course Details</span>
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Question Bank Selector
          </h2>
        </div>

        {/* Selected parameters badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 border border-slate-200">
            <GraduationCap size={13} />
            {selection?.className || "No Class"}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 border border-blue-100">
            <BookOpen size={13} />
            {selection?.subjectName || "No Subject"}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 border border-indigo-100">
            <ClipboardList size={13} />
            {selection?.examTypeName || "No Exam Type"}
          </span>
        </div>
      </div>

      {/* Chapter Indicator */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-slate-200/55 p-4 flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Chapter:</span>
        <span className="text-sm font-extrabold text-slate-800">{selection?.chapterName || "Not Selected"}</span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-sm font-bold text-slate-500">Fetching questions from database...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-3 border border-amber-100">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">No Questions Available</h3>
          <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 leading-relaxed">
            There are no questions in the database matching this chapter and exam type combination. Try returning to step 1 to choose another.
          </p>
          <button
            onClick={() => setStep(1)}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Question List Grouped by Marks */}
          {marksKeys.map((marks) => {
            const groupQuestions = groupedQuestions[marks];
            const isAllSelected = isGroupAllSelected(marks);

            return (
              <div
                key={marks}
                className="rounded-2xl border border-slate-200 bg-white/40 shadow-sm overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-xs font-black text-blue-700">
                      {marks}M
                    </span>
                    <h3 className="text-sm font-black text-slate-800">
                      {marks} Mark{marks > 1 ? "s" : ""} Questions
                    </h3>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {groupQuestions.length} available
                    </span>
                  </div>

                  <button
                    onClick={() => toggleGroupSelection(marks)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer border
                      ${
                        isAllSelected
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-blue-50 text-blue-700 border-blue-150 hover:bg-blue-100"
                      }`}
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {/* Section Questions */}
                <div className="p-4 space-y-2">
                  {groupQuestions.map((q) => {
                    const isChecked = selected.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={`flex items-start gap-3.5 rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-sm
                          ${
                            isChecked
                              ? "border-blue-200 bg-blue-50/20"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                      >
                        <div className="relative mt-0.5 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleQuestion(q.id)}
                            className="peer h-5 w-5 appearance-none rounded-md border border-slate-300 bg-white checked:border-blue-600 checked:bg-blue-600 outline-none transition-all duration-200 cursor-pointer"
                          />
                          <Check
                            size={12}
                            strokeWidth={3}
                            className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-slate-800 leading-relaxed">
                            {q.question_text}
                          </p>
                          <span className="inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                            ID: {q.id} • {q.marks} Marks
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Sticky Bottom Actions Bar */}
          <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Selection</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-slate-900">{totalSelectedCount}</span>
                <span className="text-xs font-semibold text-slate-500">Questions selected</span>
                <span className="text-xs text-slate-300">|</span>
                <span className="text-sm font-extrabold text-blue-600">Total Marks: {totalSelectedMarks}</span>
              </div>
            </div>

            <button
              disabled={totalSelectedCount === 0}
              onClick={() => setView("preview")}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-bold transition-all duration-300 shadow-md w-full sm:w-auto sm:px-8
                ${
                  totalSelectedCount > 0
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed shadow-none"
                }`}
            >
              <FileText size={18} />
              <span>Generate Paper</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
