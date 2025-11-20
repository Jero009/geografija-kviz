import React, { useState, useMemo } from 'react';
import { GEO_NOTES } from '../constants';
import { Settings, Play, ArrowLeft, BookOpen } from 'lucide-react';

interface QuizConfigProps {
  onStart: (topic: string, count: number) => void;
  onBack: () => void;
}

const QuizConfig: React.FC<QuizConfigProps> = ({ onStart, onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>("Vsa snov");
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Dynamically parse topics from the markdown notes
  // Extracts lines starting with "## "
  const topics = useMemo(() => {
    const matches = GEO_NOTES.match(/^##\s.+/gm);
    const extracted = matches ? matches.map(line => line.replace(/^##\s/, '').trim()) : [];
    return ["Vsa snov", ...extracted];
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
        <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold">Nastavitve Kviza</h2>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Topic Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
              Izberi temo
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all hover:bg-slate-100"
              >
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
              Število vprašanj
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[3, 5, 10, 15].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    questionCount === count
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Nazaj
          </button>
          <button
            onClick={() => onStart(selectedTopic, questionCount)}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-teal-400 hover:shadow-teal-200/50 transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-5 h-5 fill-current" />
            Začni Kviz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizConfig;