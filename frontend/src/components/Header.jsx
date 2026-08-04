import { GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <div className="px-8 pt-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200">
        <GraduationCap size={28} className="text-white" />
      </div>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
        Generate Paper
      </h2>
      <p className="mt-1.5 text-xs font-medium text-slate-500">
        Fill in the details below to generate your custom paper.
      </p>
    </div>
  );
}

