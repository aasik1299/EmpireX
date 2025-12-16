import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Socratic Tutor</h1>
          <p className="text-xs text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-semibold text-indigo-700">Deep Reasoning Enabled</span>
      </div>
    </header>
  );
};