import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import html2pdf from "html2pdf.js";

const API = import.meta.env.VITE_API_URL;

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
  Eye,
  Edit3,
  Download,
} from "lucide-react";

export default function QuestionBank() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state?.selection;

  const chapterId = selection?.chapterId;
  const examTypeId = selection?.examTypeId;

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [view, setView] = useState("select"); // "select" or "preview"

  // Ref for the A4 printable paper sheet
  const paperRef = useRef(null);

  // Redirect if no selection is present
  useEffect(() => {
    if (!selection) {
      navigate("/");
    }
  }, [selection, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!chapterId || !examTypeId) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${API}/api/questions/${chapterId}/${examTypeId}`,
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
    } else {
      const newSelected = [...selected];
      groupIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelected(newSelected);
    }
  };

  // PDF Save Handler with OKLCH Color Parsing Fix
  // PDF Save Handler with Dynamic Height & OKLCH Fix
  const handleDownloadPDF = async () => {
    if (!paperRef.current) return;

    setDownloading(true);

    try {
      const element = paperRef.current;

      const opt = {
        margin: [10, 10, 10, 10], // Top, left, bottom, right margins in mm
        filename: `${selection?.subjectName || "Question"}_${selection?.chapterName || "Paper"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          // OKLCH Color parsing crash fix:
          onclone: (clonedDoc) => {
            const allElements = clonedDoc.querySelectorAll("*");
            allElements.forEach((el) => {
              const style = window.getComputedStyle(el);
              if (style.color.includes("oklch")) {
                el.style.color = "#000000";
              }
              if (style.backgroundColor.includes("oklch")) {
                el.style.backgroundColor = "#ffffff";
              }
              if (style.borderColor.includes("oklch")) {
                el.style.borderColor = "#1e293b";
              }
            });
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("Question Paper downloaded successfully!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Direct PDF failed, opening print window...");
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (!selection) return null;

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-brand-glow selection:text-brand-primary print:bg-white print:p-0">
      {/* Top Navigation / Brand Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* Logo and Brand Name */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="Praxis Learning Logo"
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-black text-slate-900">
                Praxis <span className="text-brand-primary">Learning</span>
              </span>
            </div>
            {/* Mobile Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-dark transition cursor-pointer sm:hidden shadow-sm shadow-brand-glow"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-brand-primary border border-brand-accent/20">
                <GraduationCap size={11} />
                {selection.className}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-brand-primary border border-brand-accent/20">
                <BookOpen size={11} />
                {selection.subjectName}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-brand-primary border border-brand-accent/20">
                <ClipboardList size={11} />
                {selection.examTypeName}
              </span>
            </div>

            {/* Desktop Back Button */}
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-brand-primary text-white hover:text-white hover:bg-brand-dark transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 print:p-0 print:max-w-none">
        {/* Mobile View Toggle Bar */}
        <div className="flex items-center justify-center p-1 bg-slate-200/80 mb-6 lg:hidden print:hidden max-w-sm mx-auto">
          <button
            onClick={() => setView("select")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer
              ${view === "select" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Edit3 size={14} />
            <span>Select Questions</span>
          </button>
          <button
            onClick={() => setView("preview")}
            disabled={totalSelectedCount === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer
              ${totalSelectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""}
              ${view === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <FileText size={16} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 bg-white border border-slate-200/60 shadow-sm print:hidden">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
            <p className="text-sm font-extrabold text-slate-500">
              Fetching Relevant Questions
            </p>
          </div>
        ) : questions.length === 0 ? (
          /* Empty Database Screen */
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm print:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand-primary mb-4 border border-brand-accent/20">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-brand-primary">
              No Questions Available
            </h3>
            <p className="mt-2 max-w-sm text-xs font-semibold text-slate-400 leading-relaxed">
              There are no questions in the database matching this chapter and
              exam type combination. Try returning to setup and choose another
              topic.
            </p>
            <button
              onClick={() => navigate("/generate")}
              className="mt-5 rounded-full bg-brand-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition cursor-pointer shadow-md shadow-brand-glow"
            >
              Go Back
            </button>
          </div>
        ) : (
          /* Responsive Layout Panels */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
            {/* LEFT PANEL: Question Selection Builder */}
            <div
              className={`lg:col-span-7 space-y-5 print:hidden ${view === "preview" ? "hidden lg:block" : "block"}`}
            >
              {/* Header Title */}
              <div className="bg-white border border-slate-200/60 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-brand-primary">
                      Compile Questions
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      Chapter :{" "}
                      <span className="text-slate-700">
                        {selection.chapterName}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Selections
                    </div>
                    <div className="text-sm font-black text-slate-800">
                      {totalSelectedCount} Qs / {totalSelectedMarks} Marks
                    </div>
                  </div>
                </div>
              </div>

              {/* Question list groups */}
              <div className="space-y-4">
                {marksKeys.map((marks) => {
                  const groupQuestions = groupedQuestions[marks];
                  const isAllSelected = isGroupAllSelected(marks);

                  return (
                    <div
                      key={marks}
                      className=" border border-slate-200/60 bg-white shadow-sm overflow-hidden"
                    >
                      {/* Section Heading */}
                      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-xs font-black text-brand-primary border border-brand-accent/10">
                            {marks} M
                          </span>
                          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                            {marks} Mark{marks > 1 ? "s" : ""}
                          </h3>
                          <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                            {groupQuestions.length} Questions
                          </span>
                        </div>

                        <button
                          onClick={() => toggleGroupSelection(marks)}
                          className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition cursor-pointer border
                            ${
                              isAllSelected
                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                : "bg-brand-light text-brand-primary border-brand-accent/20 hover:bg-brand-glow"
                            }`}
                        >
                          {isAllSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      {/* Section Question Rows */}
                      <div className="p-4 space-y-2">
                        {groupQuestions.map((q) => {
                          const isChecked = selected.includes(q.id);
                          return (
                            <label
                              key={q.id}
                              className={`flex items-start gap-4 p-4 transition-all duration-200 cursor-pointer hover:shadow-sm
                                ${
                                  isChecked
                                    ? "border-brand-accent bg-brand-pink/40"
                                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                                }`}
                            >
                              <div className="relative mt-0.5 flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleQuestion(q.id)}
                                  className="peer h-5 w-5 appearance-none rounded-full border border-slate-300 bg-white checked:border-brand-primary checked:bg-brand-primary outline-none transition-all duration-200 cursor-pointer"
                                />
                                <Check
                                  size={12}
                                  strokeWidth={3.5}
                                  className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                />
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                  {q.question_text}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky action bar */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-lg flex items-center justify-between lg:hidden">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Selections
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    {totalSelectedCount} Qs / {totalSelectedMarks} Marks
                  </div>
                </div>
                <button
                  disabled={totalSelectedCount === 0}
                  onClick={() => setView("preview")}
                  className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-5 text-xs font-bold transition-all shadow-md
                    ${
                      totalSelectedCount > 0
                        ? "bg-brand-primary text-white hover:bg-brand-dark"
                        : "bg-slate-100 text-slate-400 border cursor-not-allowed"
                    }`}
                >
                  <FileText size={14} />
                  <span>Preview Paper</span>
                </button>
              </div>
            </div>

            {/* RIGHT PANEL: Live A4 Question Paper Preview */}
            <div
              className={`lg:col-span-5 space-y-5 print:block ${view === "select" ? "hidden lg:block" : "block"}`}
            >
              {/* Print Action Bar */}
              <div className="bg-white border border-slate-200/60 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-brand-primary">
                      Live Paper Preview
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      Chapter :{" "}
                      <span className="text-slate-700">
                        {selection.chapterName}
                      </span>
                    </p>
                  </div>
                  <button
                    disabled={totalSelectedCount === 0 || downloading}
                    onClick={handleDownloadPDF}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-extrabold text-white transition cursor-pointer shadow-md
                    ${
                      totalSelectedCount > 0 && !downloading
                        ? "bg-brand-primary hover:bg-brand-dark shadow-brand-glow"
                        : "bg-slate-100 text-slate-400 border cursor-not-allowed shadow-none"
                    }`}
                  >
                    {downloading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Printer size={14} />
                    )}
                    <span>{downloading ? "Saving PDF..." : "Save"}</span>
                  </button>
                </div>
              </div>

              {/* On-screen A4 Paper Mockup */}
              {totalSelectedCount === 0 ? (
                <div className="border border-dashed border-slate-200 bg-white/50 p-8 text-center flex flex-col items-center justify-center min-h-[400px] print:hidden animate-scale-in">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                    <FileText size={22} />
                  </div>
                  <h4 className="text-xl font-black text-brand-primary">
                    Empty Exam Sheet
                  </h4>
                  <p className="text-xs font-medium text-slate-400 max-w-[300px] mx-auto mt-1 leading-relaxed">
                    Check standard questions on the left builder panel to add
                    them to your paper.
                  </p>
                </div>
              ) : (
                /* The actual paper sheet container attached to paperRef */
                <div
                  ref={paperRef}
                  className="w-full max-w-3xl h-auto bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-slate-200 print:border-none print:shadow-none p-8 md:p-12 font-serif text-slate-950 text-xs sm:text-sm"
                >
                  {/* Exam Board Header */}
                  <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5 mb-5">
                    <h2 className="text-xl font-bold uppercase tracking-wide">
                      {selection.examTypeName || "Examination"}
                    </h2>
                    <div className="flex justify-between text-xs font-semibold tracking-tight px-2">
                      <span>Class: {selection.className}</span>
                      <span>Subject: {selection.subjectName}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold tracking-tight px-2 border-t pt-2 border-slate-300">
                      <span>Chapter: {selection.chapterName}</span>
                      <span>Max Marks: {totalSelectedMarks}</span>
                    </div>
                  </div>

                  {/* General Instructions */}
                  <div className="mb-6 text-[10px] sm:text-xs space-y-1 leading-relaxed font-sans italic border-b border-dashed pb-3 text-slate-700">
                    <p className="font-bold uppercase text-slate-900 not-italic">
                      General Instructions:
                    </p>
                    <p>
                      1. All questions are compulsory. Marks are indicated
                      against each question.
                    </p>
                    <p>
                      2. Please check that this question paper contains{" "}
                      {totalSelectedCount} questions.
                    </p>
                    <p>
                      3. Section-wise questions must be attempted sequentially.
                    </p>
                  </div>

                  {/* Section Questions content */}
                  <div className="space-y-6">
                    {marksKeys.map((marks, idx) => {
                      const groupQuestions = groupedQuestions[marks].filter(
                        (q) => selected.includes(q.id),
                      );
                      if (groupQuestions.length === 0) return null;
                      const sectionLetter = String.fromCharCode(65 + idx);

                      return (
                        <div
                          key={marks}
                          className="space-y-3 print:break-inside-avoid"
                        >
                          <h4 className="font-bold border-b border-slate-800 pb-1 text-xs sm:text-sm uppercase tracking-wider flex justify-between">
                            <span>
                              Section {sectionLetter} ({marks} Mark
                              {marks > 1 ? "s" : ""} Questions)
                            </span>
                            <span className="text-[11px] font-normal normal-case text-slate-700">
                              [{groupQuestions.length} × {marks} ={" "}
                              {groupQuestions.length * marks} Marks]
                            </span>
                          </h4>

                          <ol className="list-decimal pl-5 space-y-3">
                            {groupQuestions.map((q) => (
                              <li key={q.id} className="pl-2 leading-relaxed">
                                <div className="flex justify-between items-start gap-4">
                                  <span className="text-[12px] sm:text-[13px] font-medium font-serif">
                                    {q.question_text}
                                  </span>
                                  <span className="font-bold text-xs select-none">
                                    [{marks}]
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
