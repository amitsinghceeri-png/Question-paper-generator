import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import Background from "../components/Background";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  BookOpen,
  GraduationCap,
  Library,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function AddQuestions() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    class: "",
    subject: "",
    chapter: "",
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Existing questions in the selected chapter
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // New questions form rows
  const [newQuestions, setNewQuestions] = useState([
    { questionText: "", marks: 1 },
  ]);
  const [saving, setSaving] = useState(false);

  // Scroll states and references for Existing Questions List
  const listRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const handleListScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight <= 10;
    setIsAtBottom(atBottom);
    setShowScrollBtn(scrollHeight > clientHeight);
  };

  const handleScrollClick = () => {
    if (!listRef.current) return;
    const { scrollHeight, clientHeight } = listRef.current;
    if (isAtBottom) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      listRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  // Run scroll check when existingQuestions change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleListScroll();
    }, 100);
    return () => clearTimeout(timer);
  }, [existingQuestions, loadingQuestions]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API}/api/classes`);
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    }
  };

  const fetchSubjects = async (className) => {
    try {
      const classId = className.replace("Class ", "");
      const res = await axios.get(`${API}/api/subjects/${classId}`);
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subjects");
    }
  };

  const fetchChapters = async (subjectName, currentSubjects = subjects) => {
    try {
      const subject = currentSubjects.find(
        (s) => s.subject_name === subjectName,
      );
      if (!subject) return;
      const res = await axios.get(`${API}/api/chapters/${subject.id}`);
      setChapters(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chapters");
    }
  };

  // Find the selected chapter
  const selectedChapter = chapters.find((c) => c.chapter_name === form.chapter);

  // Fetch existing questions when selectedChapter changes
  useEffect(() => {
    if (selectedChapter) {
      fetchExistingQuestions(selectedChapter.id);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
      setIsAtBottom(false);
    } else {
      setExistingQuestions([]);
    }
  }, [form.chapter, chapters]);

  const fetchExistingQuestions = async (chapterId) => {
    setLoadingQuestions(true);
    try {
      const res = await axios.get(`${API}/api/questions/${chapterId}`);
      if (res.data && res.data.success) {
        setExistingQuestions(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAddRow = () => {
    setNewQuestions([...newQuestions, { questionText: "", marks: 1 }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...newQuestions];
    updated.splice(index, 1);
    setNewQuestions(updated);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...newQuestions];
    updated[index][field] = value;
    setNewQuestions(updated);
  };

  const handleSaveQuestions = async () => {
    if (!selectedChapter) {
      toast.error("Please select a chapter first");
      return;
    }

    // Filter out empty rows
    const validQuestions = newQuestions.filter(
      (q) => q.questionText.trim() !== "",
    );
    if (validQuestions.length === 0) {
      toast.error("Please add at least one question text");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post(`${API}/api/questions`, {
        chapterId: selectedChapter.id,
        questions: validQuestions,
      });

      if (res.data && res.data.success) {
        toast.success("Questions added successfully!");
        setNewQuestions([{ questionText: "", marks: 1 }]);
        fetchExistingQuestions(selectedChapter.id);
      } else {
        toast.error("Failed to add questions");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving questions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-brand-glow selection:text-brand-primary">
      {/* Background gradients */}
      <Background />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200/50 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Praxis Learning Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="text-xl font-black tracking-tight text-slate-900">
              Praxis <span className="text-brand-primary">Learning</span>
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-brand-primary text-white hover:text-white hover:bg-brand-dark transition cursor-pointer shadow-sm shadow-brand-glow"
            title="Back to Workspace"
          >
            <ArrowLeft size={16} />
          </button>
        </header>

        {/* Main Content */}
        <main className="my-6 space-y-8">
          {/* Upper Section: Course Selection & Add New Questions (Equal Height) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
            {/* Left Column: Course Selection */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl p-6 shadow-md h-full flex flex-col justify-between">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary to-brand-dark absolute top-0 left-0" />

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand-primary border border-brand-accent/10">
                      <Library size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-brand-primary">
                        Course Selection
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400">
                        Select target chapter to manage questions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Class Select */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <GraduationCap size={14} className="text-brand-primary" />
                        <span>Class</span>
                      </label>
                      <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-855 outline-none hover:border-slate-300 focus:border-brand-primary cursor-pointer"
                        value={form.class}
                        onChange={(e) => {
                          setForm({
                            class: e.target.value,
                            subject: "",
                            chapter: "",
                          });
                          setSubjects([]);
                          setChapters([]);
                          fetchSubjects(e.target.value);
                        }}
                      >
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.class_name}>
                            {c.class_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Select */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <BookOpen size={14} className="text-brand-primary" />
                        <span>Subject</span>
                      </label>
                      <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-855 outline-none hover:border-slate-300 focus:border-brand-primary disabled:opacity-50 disabled:bg-slate-50 cursor-pointer"
                        disabled={!form.class}
                        value={form.subject}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            subject: e.target.value,
                            chapter: "",
                          });
                          setChapters([]);
                          fetchChapters(e.target.value);
                        }}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.subject_name}>
                            {s.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chapter Select */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Library size={14} className="text-brand-primary" />
                        <span>Chapter</span>
                      </label>
                      <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-855 outline-none hover:border-slate-300 focus:border-brand-primary disabled:opacity-50 disabled:bg-slate-50 cursor-pointer"
                        disabled={!form.subject}
                        value={form.chapter}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            chapter: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Chapter</option>
                        {chapters.map((c) => (
                          <option key={c.id} value={c.chapter_name}>
                            {c.chapter_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Manage Questions Area */}
            <div className="lg:col-span-7 flex flex-col">
              {!selectedChapter ? (
                <div className="flex h-full min-h-[345px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-center shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand-primary mb-4 border border-brand-accent/20">
                    <Library size={28} />
                  </div>
                  <h3 className="text-xl font-black text-brand-primary">
                    Select a Chapter
                  </h3>
                  <p className="mt-2 max-w-sm text-xs font-semibold text-slate-400 leading-relaxed">
                    Please select class, subject, and chapter from the left panel
                    to start adding or viewing questions.
                  </p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl p-6 shadow-md h-full flex flex-col justify-between">
                  <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary to-brand-dark absolute top-0 left-0" />

                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="text-lg font-black text-brand-primary">
                          Add New Questions
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400">
                          {form.class} • {form.subject} • {form.chapter}
                        </p>
                      </div>
                      <button
                        onClick={handleAddRow}
                        className="flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold text-brand-primary border border-brand-accent/20 hover:bg-brand-primary hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Question {idx + 1}
                            </label>
                            <textarea
                              value={q.questionText}
                              onChange={(e) =>
                                handleRowChange(
                                  idx,
                                  "questionText",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter the question text here..."
                              rows={2}
                              className="w-full border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 outline-none hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-glow resize-none"
                            />
                          </div>
                          <div className="w-28 space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Marks
                            </label>
                            <select
                              value={q.marks}
                              onChange={(e) =>
                                handleRowChange(
                                  idx,
                                  "marks",
                                  parseInt(e.target.value),
                                )
                              }
                              className="h-11 w-full rounded-full border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none hover:border-slate-300 focus:border-brand-primary cursor-pointer"
                            >
                              <option value={1}>1 Mark</option>
                              <option value={2}>2 Marks</option>
                              <option value={3}>3 Marks</option>
                              <option value={4}>4 Marks</option>
                              <option value={5}>5 Marks</option>
                              <option value={6}>6 Marks</option>
                              <option value={8}>8 Marks</option>
                              <option value={10}>10 Marks</option>
                            </select>
                          </div>
                          {newQuestions.length > 1 && (
                            <button
                              onClick={() => handleRemoveRow(idx)}
                              className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveQuestions}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-dark px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            className="animate-spin animate-pulse"
                            size={16}
                          />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Questions</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lower Section: Existing Questions List Card (Only show if selectedChapter is true) */}
          {selectedChapter && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl p-6 shadow-md">
                  <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary to-brand-dark absolute top-0 left-0" />

                  <h3 className="text-lg font-black text-brand-primary">
                    Existing Questions ({existingQuestions.length})
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {form.class} • {form.subject} • {form.chapter}
                  </p>

                  <div className="mt-4">
                    {loadingQuestions ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2
                          className="animate-spin text-brand-primary"
                          size={32}
                        />
                      </div>
                    ) : existingQuestions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <AlertCircle size={24} className="text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-400">
                          No questions in this chapter yet. Add some above!
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          ref={listRef}
                          onScroll={handleListScroll}
                          className="max-h-[300px] overflow-y-auto space-y-2.5 pr-2 pb-14 no-scrollbar [&::-webkit-scrollbar]:hidden"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {existingQuestions.map((q, idx) => (
                            <div
                              key={q.id || idx}
                              className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-brand-accent/20 transition-all"
                            >
                              <div className="flex-1 text-xs font-semibold text-slate-700 leading-relaxed pr-4">
                                {idx + 1}. {q.question_text}
                              </div>
                              <span className="shrink-0 inline-flex items-center rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand-primary border border-brand-accent/10">
                                {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                              </span>
                            </div>
                          ))}
                        </div>

                        {showScrollBtn && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                            <button
                              onClick={handleScrollClick}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-dark transition cursor-pointer shadow-md shadow-brand-glow border border-brand-accent/20"
                              title={isAtBottom ? "Scroll to Top" : "Scroll to Bottom"}
                            >
                              {isAtBottom ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
