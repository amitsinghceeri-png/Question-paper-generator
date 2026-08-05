import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import logo from "../assets/logo.png";
import educationHero from "../assets/education_hero.png";
import { ArrowRight, Award, Zap, Shield, FileText, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans selection:bg-brand-glow selection:text-brand-primary">
      {/* Background circles / gradients */}
      <Background />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200/50 pb-5 pt-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Praxis Learning Logo" className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105" />
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Praxis <span className="text-brand-primary">Learning</span>
            </span>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-1.5 rounded-xl border border-brand-accent bg-white px-5 py-2 text-sm font-bold text-brand-primary hover:bg-brand-light transition shadow-sm cursor-pointer"
          >
            Go to App
          </button>
        </header>

        {/* Hero Section */}
        <main className="my-auto grid w-full grid-cols-1 gap-12 py-10 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Branding and Copy */}
          <div className="flex flex-col justify-center space-y-7 lg:col-span-7 animate-scale-in">
            
            {/* Tagline Badge */}
            <div className="inline-flex self-start items-center gap-2 rounded-full bg-brand-light px-4 py-2 text-xs font-bold text-brand-primary border border-brand-accent/20">
              <span className="flex h-2.5 w-2.5 rounded-full bg-brand-primary animate-pulse" />
              AI-Powered Assessment Builder
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-tight">
                Craft the Perfect{" "}
                <span className="bg-gradient-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent">
                  Exam Paper
                </span>{" "}
                in Seconds
              </h1>
              <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-xl">
                Empower your teaching with the ultimate question paper builder. Select your class, subject, chapter, and instantly generate print-ready assessments.
              </p>
            </div>

            {/* Key Value Checklist */}
            <div className="space-y-3 text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary" />
                <span>100% Curriculum &amp; Syllabus Aligned</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary" />
                <span>Live Interactive A4 Print Preview</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary" />
                <span>Instant PDF Generation &amp; Print Layouts</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate("/generate")}
                className="group flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-dark text-lg font-extrabold text-white transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer px-8"
              >
                <span>Create Question Paper</span>
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 border-t border-slate-200/60 pt-6 max-w-md">
              <div className="space-y-1">
                <div className="text-2xl font-black text-brand-primary">10k+</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Papers Build</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-brand-primary">99%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Saved</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-brand-primary">100%</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image Frame */}
          <div className="flex items-center justify-center lg:col-span-5 animate-scale-in">
            <div className="relative group w-full max-w-md lg:max-w-none">
              {/* Soft purple glow backplate */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-accent opacity-25 blur-2xl transition duration-1000 group-hover:opacity-35" />
              
              <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/40 p-2.5 shadow-2xl backdrop-blur-sm">
                <img
                  src={educationHero}
                  alt="Exam generation illustration"
                  className="w-full rounded-2xl object-cover aspect-[4/3] sm:aspect-[16/10] shadow-inner transition-transform duration-700 group-hover:scale-[1.01]"
                />
                
                {/* Floating Glassmorphic Badges */}
                <div className="absolute top-6 left-6 animate-bounce-slow flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary text-white shadow-sm shadow-brand-primary/20">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Quality</div>
                    <div className="text-xs font-extrabold text-slate-800">Verified Questions</div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 animate-bounce-slow-delayed flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Speed</div>
                    <div className="text-xs font-extrabold text-slate-800">Ready in 30s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Features Section */}
        <section className="py-8 border-t border-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-white/50 border border-slate-200/30 hover:bg-white/80 transition duration-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Secure Database</h4>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Questions are stored securely, ensuring assessments are private and protected.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/50 border border-slate-200/30 hover:bg-white/80 transition duration-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Standard A4 Layout</h4>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Generated exam papers fit perfectly on physical A4 pages with zero configuration.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/50 border border-slate-200/30 hover:bg-white/80 transition duration-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Super Fast Flow</h4>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Intuitive, streamlined controls let teachers compile papers in just four simple dropdown steps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/40 py-5 text-center text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} Praxis Learning. All rights reserved. Designed for professional educators.
        </footer>

      </div>
    </div>
  );
}
