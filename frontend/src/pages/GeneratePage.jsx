import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import SelectionForm from "../components/SelectionForm";
import logo from "../assets/logo.png";
import educationHero from "../assets/education_hero.png";
import { Award, Zap, CheckCircle, School, Sliders } from "lucide-react";

export default function GeneratePage() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState(null);

  const handleSelection = (sel) => {
    setSelection(sel);
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden w-full overflow-x-hidden bg-slate-50 font-sans selection:bg-brand-glow selection:text-brand-primary">
      {/* Background gradients */}
      <Background />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen lg:h-full lg:max-h-screen w-full max-w-7xl flex-col justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200/50 pb-3 pt-2 print:hidden">
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
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-xs font-bold text-white border border-brand-accent/20 hover:bg-brand-dark transition-all duration-300 shadow-sm cursor-pointer"
          >
            <Sliders size={14} />
            <span>Admin</span>
          </button>
        </header>
        {/* Split Grid Layout */}
        <main className="my-auto grid w-full grid-cols-1 gap-8 py-4 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Column: Brand Copy & Taglines */}
          <div className="flex flex-col justify-center space-y-4 lg:space-y-3.5 lg:col-span-7 animate-scale-in">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-[52px] leading-tight">
                Craft the Perfect{" "}
                <span className="bg-gradient-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent">
                  Exam Paper
                </span>{" "}
                in Seconds
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-slate-700 text-justify">
                Empower your teaching with the ultimate question paper builder.
                Choose your class, course parameters, select chapters, and
                instantly generate print-ready assessments.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 lg:space-y-2 text-slate-700 font-bold text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-brand-primary" />
                <span>100% Curriculum &amp; Syllabus Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-brand-primary" />
                <span>Live Interactive A4 Print Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-brand-primary" />
                <span>Instant PDF Generation &amp; Print Layouts</span>
              </div>
            </div>

            {/* Visual Hero Image */}
            <div className="relative group max-w-xs sm:max-w-sm lg:max-w-[360px] pt-1">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-accent opacity-20 blur-xl transition duration-1000 group-hover:opacity-25" />
              <div className="relative overflow-hidden rounded-3xl border border-white bg-white/40 p-1 shadow-lg backdrop-blur-sm">
                <img
                  src={educationHero}
                  alt="Praxis Learning Education Hero"
                  className="w-full rounded-2xl object-cover aspect-[16/10] shadow-inner"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 border-t border-slate-200/60 pt-4 lg:pt-3 max-w-md">
              <div className="space-y-0.5">
                <div className="text-xl lg:text-2xl font-black text-brand-primary">
                  10k+
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Papers Built
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl lg:text-2xl font-black text-brand-primary">
                  99%
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Time Saved
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl lg:text-2xl font-black text-brand-primary">
                  100%
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Setup selection card */}
          <div className="flex items-center justify-center lg:col-span-5 animate-scale-in">
            <div className="w-full max-w-md transition-all duration-300 hover:translate-y-[-2px]">
              <div className="relative overflow-hidden  border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(120,30,90,0.06)]">
                {/* Visual Accent top stripe */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary to-brand-dark" />

                {/* Embedded Setup Headers */}
                <div className="px-8 pt-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand-primary border border-brand-accent/10">
                    <School size={20} />
                  </div>
                  <h3 className="mt-2.5 text-xl font-black text-brand-primary">
                    Educator Workspace
                  </h3>
                  <p className="mt-0.5 text-xs font-bold text-slate-400">
                    Fill in the details below to generate your custom paper.
                  </p>
                </div>

                {/* Render the selection form */}
                <SelectionForm setSelection={handleSelection} />

                {/* Card Footer */}
                <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-3 text-center">
                  <p className="text-[9px] font-extrabold font-black text-brand-primary uppercase tracking-widest">
                    Authorized Educator Access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/40 py-3 text-center text-xs font-medium text-slate-400 print:hidden">
          © {new Date().getFullYear()} Praxis Learning. All rights reserved.
          Designed for professional educators.
        </footer>
      </div>
    </div>
  );
}
