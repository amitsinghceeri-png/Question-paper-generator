import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import {
  GraduationCap,
  BookOpen,
  Library,
  ClipboardList,
  ArrowRight,
  Lock,
  Check,
  ChevronDown,
} from "lucide-react";

export default function SelectionForm({ setStep, setSelection }) {
  const [form, setForm] = useState({
    class: "",
    subject: "",
    chapter: "",
    exam: "",
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchExamTypes();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API}/api/classes`);
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Failed to load classes", error);
    }
  };

  const fetchSubjects = async (className) => {
    if (!className) {
      setSubjects([]);
      return;
    }
    try {
      // "Class 10" → 10
      const classId = className.replace("Class ", "");
      const response = await axios.get(`${API}/api/subjects/${classId}`);
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Failed to load subjects", error);
    }
  };

  const fetchChapters = async (subjectName) => {
    if (!subjectName) {
      setChapters([]);
      return;
    }
    try {
      const subject = subjects.find(
        (item) => item.subject_name === subjectName,
      );

      if (!subject) return;

      const response = await axios.get(`${API}/api/chapters/${subject.id}`);
      setChapters(response.data.data || []);
    } catch (error) {
      console.error("Failed to load chapters", error);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const response = await axios.get(`${API}/api/exam-types`);
      setExams(response.data.data || []);
    } catch (error) {
      console.error("Failed to load exam types", error);
    }
  };

  const canContinue = form.class && form.subject && form.chapter && form.exam;

  const getStatus = (fieldName) => {
    switch (fieldName) {
      case "class":
        return form.class ? "completed" : "active";
      case "subject":
        if (!form.class) return "locked";
        return form.subject ? "completed" : "active";
      case "chapter":
        if (!form.subject) return "locked";
        return form.chapter ? "completed" : "active";
      case "exam":
        if (!form.chapter) return "locked";
        return form.exam ? "completed" : "active";
      default:
        return "locked";
    }
  };

  const Field = ({
    label,
    icon,
    value,
    options,
    disabled,
    onChange,
    status,
  }) => {
    const isCompleted = status === "completed";
    const isActive = status === "active";
    const isLocked = status === "locked";

    return (
      <div
        className={`space-y-2 transition-all duration-300 ${isLocked ? "opacity-45" : "opacity-100"}`}
      >
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-300 ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : isActive
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-slate-50 text-slate-400 border-slate-100"
              }`}
            >
              {icon}
            </span>
            <span
              className={`transition-colors duration-200 ${isActive ? "text-slate-900 font-bold" : "text-slate-600"}`}
            >
              {label}
            </span>
          </label>

          {/* Status Indicator */}
          <div className="flex items-center">
            {isCompleted && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm animate-scale-in">
                <Check size={11} strokeWidth={3.5} />
              </span>
            )}
            {isActive && (
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                <span>Select</span>
              </span>
            )}
            {isLocked && (
              <span className="text-slate-400/80">
                <Lock size={13} />
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm font-semibold outline-none transition-all duration-200
              ${isCompleted ? "border-emerald-200 bg-emerald-50/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" : ""}
              ${isActive ? "border-blue-400 shadow-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50" : ""}
              ${isLocked ? "border-slate-100 bg-slate-50/50 cursor-not-allowed text-slate-400" : "border-slate-200 text-slate-800 hover:border-slate-300 focus:border-blue-500"}
            `}
          >
            <option value="">Select {label}</option>
            {options.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isActive ? "text-blue-500" : ""}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 px-8 py-6">
      <Field
        label="Class"
        icon={<GraduationCap size={16} />}
        value={form.class}
        options={classes.map((item) => item.class_name)}
        status={getStatus("class")}
        onChange={(v) => {
          setForm({
            class: v,
            subject: "",
            chapter: "",
            exam: "",
          });
          setSubjects([]);
          setChapters([]);
          fetchSubjects(v);
        }}
      />

      <Field
        label="Subject"
        icon={<BookOpen size={16} />}
        disabled={!form.class}
        value={form.subject}
        options={subjects.map((item) => item.subject_name)}
        status={getStatus("subject")}
        onChange={(v) => {
          setForm({
            ...form,
            subject: v,
            chapter: "",
            exam: "",
          });
          setChapters([]);
          fetchChapters(v);
        }}
      />

      <Field
        label="Chapter / Topic"
        icon={<Library size={16} />}
        disabled={!form.subject}
        value={form.chapter}
        options={chapters.map((item) => item.chapter_name)}
        status={getStatus("chapter")}
        onChange={(v) => {
          setForm({
            ...form,
            chapter: v,
            exam: "",
          });
        }}
      />

      <Field
        label="Examination Type"
        icon={<ClipboardList size={16} />}
        disabled={!form.chapter}
        value={form.exam}
        options={exams.map((item) => item.exam_name)}
        status={getStatus("exam")}
        onChange={(v) => {
          setForm({
            ...form,
            exam: v,
          });
        }}
      />

      <button
        disabled={!canContinue}
        onClick={() => {
          if (!canContinue) return;

          const selectedSubject = subjects.find(
            (item) => item.subject_name === form.subject,
          );

          const selectedChapter = chapters.find(
            (item) => item.chapter_name === form.chapter,
          );

          const selectedExam = exams.find(
            (item) => item.exam_name === form.exam,
          );

          if (setSelection) {
            setSelection({
              className: form.class,
              subjectId: selectedSubject.id,
              subjectName: form.subject,
              chapterId: selectedChapter.id,
              chapterName: form.chapter,
              examTypeId: selectedExam.id,
              examTypeName: form.exam,
            });
          }

          if (setStep) {
            setStep(2);
          }
        }}
        className={`group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-bold transition-all duration-300 shadow-md
          ${
            canContinue
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed shadow-none"
          }`}
      >
        <span>Continue</span>
        <ArrowRight
          size={18}
          className={`transition-transform duration-300 ${canContinue ? "group-hover:translate-x-1" : ""}`}
        />
      </button>
    </div>
  );
}
