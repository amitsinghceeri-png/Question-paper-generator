import { useState } from "react";
import Background from "../components/Background";
import Header from "../components/Header";
import SelectionForm from "../components/SelectionForm";
import QuestionBank from "./QuestionBank";
import Footer from "../components/Footer";
import { Award, Zap } from "lucide-react";
import educationHero from "../assets/education_hero.png";
import logo from "../assets/logo.png";

export default function EntryPage() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState(null);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-800 print:bg-white print:p-0 print:m-0">
      {/* Dynamic abstract background */}
      <div className="print:hidden">
        <Background />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 md:py-8 lg:px-8 print:block print:p-0 print:m-0 print:w-full print:max-w-none">
        {/* Navigation / Header Brand */}
        <header className="flex items-center gap-2.5 px-2 pb-6 lg:pb-0 print:hidden">
          <img
            src={logo}
            alt="Praxis Learning Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Praxis Learning
          </span>
        </header>

        {/* Responsive Grid Layout */}
        <main className="my-auto grid w-full grid-cols-1 gap-10 py-4 lg:grid-cols-12 lg:gap-12 lg:py-8 print:block print:p-0 print:m-0 print:w-full print:max-w-none">
          {step === 1 ? (
            <>
              {/* Left Column: Educational Branding & Image */}
              <div className="flex flex-col justify-center space-y-6 lg:col-span-7 animate-scale-in">
                {/* Tagline Badge */}
                <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  AI-Powered Assessment Platform
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5.5xl leading-tight">
                    Craft the Perfect{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Exam Paper
                    </span>{" "}
                    in Seconds
                  </h1>
                  <p className="text-sm text-slate-600 sm:text-base md:text-lg leading-relaxed max-w-xl">
                    Empowerd your teaching with the ultimate question paper
                    builder. Select your course details, select chapters, and
                    generate high-quality assessments aligned with standard
                    curricula.
                  </p>
                </div>

                {/* Visual Hero Image Wrapper */}
                <div className="relative group max-w-md lg:max-w-xl">
                  {/* Soft glow backplate */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl transition duration-1000 group-hover:opacity-25" />

                  <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/40 p-2 shadow-2xl backdrop-blur-sm">
                    <img
                      src={educationHero}
                      alt="Exam generation illustration"
                      className="w-full rounded-2xl object-cover aspect-[4/3] sm:aspect-[16/10] shadow-inner transition-transform duration-500 group-hover:scale-[1.01]"
                    />

                    {/* Floating Glassmorphic Badge 1 */}
                    <div className="absolute top-6 left-6 animate-bounce-slow flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                        <Award size={18} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Syllabus
                        </div>
                        <div className="text-xs font-extrabold text-slate-800">
                          100% Aligned
                        </div>
                      </div>
                    </div>

                    {/* Floating Glassmorphic Badge 2 */}
                    <div className="absolute bottom-6 right-6 animate-bounce-slow-delayed flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                        <Zap size={18} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Speed
                        </div>
                        <div className="text-xs font-extrabold text-slate-800">
                          Generate in 30s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-200/50 pt-5 max-w-md">
                  <div className="space-y-1">
                    <div className="text-xl font-black text-slate-900 sm:text-2xl">
                      10k+
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Papers Generated
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-black text-slate-900 sm:text-2xl">
                      99%
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Time Saved
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-black text-slate-900 sm:text-2xl">
                      100%
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Curriculum Fit
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Setup Card */}
              <div className="flex items-center justify-center lg:col-span-5 animate-scale-in">
                <div className="w-full max-w-md transition-all duration-300 hover:translate-y-[-2px]">
                  <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)]">
                    {/* Visual Accent top stripe */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

                    <Header />
                    <SelectionForm
                      setStep={setStep}
                      setSelection={setSelection}
                    />
                    <Footer />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Full Width Question Bank Container */
            <div className="lg:col-span-12 w-full max-w-5xl mx-auto animate-scale-in print:block print:p-0 print:m-0 print:w-full print:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8 print:block print:p-0 print:m-0 print:border-none print:shadow-none print:bg-transparent print:backdrop-blur-none">
                {/* Visual Accent top stripe */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 print:hidden" />
                <QuestionBank selection={selection} setStep={setStep} />
              </div>
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-8 border-t border-slate-200/40 pt-4 text-center text-[10px] font-medium text-slate-400 lg:mt-0 print:hidden">
          © {new Date().getFullYear()} Praxis Learning. All rights reserved.
          Designed for educators.
        </footer>
      </div>
    </div>
  );
}
