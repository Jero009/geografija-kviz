import React, { useState } from 'react';
import { AppState, Question, QuizResult } from './types';
import { generateQuiz } from './services/geminiService';
import NotesViewer from './components/NotesViewer';
import QuizRunner from './components/QuizRunner';
import QuizConfig from './components/QuizConfig';
import { BrainCircuit, BookOpen, Loader2, GraduationCap, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configuration state to persist selection for "Retry"
  const [lastConfig, setLastConfig] = useState<{topic: string, count: number} | null>(null);

  const handleStartQuiz = async (topic: string, count: number) => {
    setLastConfig({ topic, count });
    setView(AppState.QUIZ_LOADING);
    setError(null);
    try {
      const generatedQuestions = await generateQuiz(topic, count);
      setQuestions(generatedQuestions);
      setView(AppState.QUIZ_ACTIVE);
    } catch (err) {
      console.error(err);
      setError("Napaka pri generiranju kviza. Preverite API ključ ali poskusite kasneje.");
      setView(AppState.HOME);
    }
  };

  const handleRetry = () => {
    if (lastConfig) {
      handleStartQuiz(lastConfig.topic, lastConfig.count);
    } else {
      setView(AppState.QUIZ_CONFIG);
    }
  };

  const handleQuizFinish = (result: QuizResult) => {
    setResult(result);
    setView(AppState.QUIZ_RESULTS);
  };

  // HOME SCREEN
  if (view === AppState.HOME) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-600 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center fade-in">
          <div className="mb-6 flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">GeoUčenje</h1>
          <p className="text-blue-100 mb-8 text-lg">Geografija za 2. Letnik</p>
          
          {error && (
             <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mb-6 text-sm text-red-100">
               {error}
             </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={() => setView(AppState.NOTES)}
              className="w-full group relative flex items-center justify-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>Preberi zapiske</span>
            </button>
            
            <button 
              onClick={() => setView(AppState.QUIZ_CONFIG)}
              className="w-full group relative flex items-center justify-center gap-3 bg-teal-500 text-white hover:bg-teal-400 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-teal-400/30"
            >
              <BrainCircuit className="w-5 h-5" />
              <span>Začni AI Kviz</span>
            </button>
          </div>
          
          <p className="mt-8 text-xs text-blue-200 opacity-70">
            Uporablja Gemini AI za generiranje vprašanj iz zapiskov.
          </p>
        </div>
      </div>
    );
  }

  // NOTES SCREEN
  if (view === AppState.NOTES) {
    return <NotesViewer onBack={() => setView(AppState.HOME)} />;
  }

  // QUIZ CONFIG SCREEN
  if (view === AppState.QUIZ_CONFIG) {
    return (
      <QuizConfig 
        onStart={handleStartQuiz}
        onBack={() => setView(AppState.HOME)}
      />
    );
  }

  // LOADING SCREEN
  if (view === AppState.QUIZ_LOADING) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Generiranje Kviza...</h2>
        <p className="text-slate-500 max-w-xs">
          Pripravljam vprašanja za temo: <span className="font-semibold text-blue-600">{lastConfig?.topic || "Vsa snov"}</span>
        </p>
      </div>
    );
  }

  // QUIZ RUNNER
  if (view === AppState.QUIZ_ACTIVE) {
    return (
      <QuizRunner 
        questions={questions} 
        onFinish={handleQuizFinish}
        onExit={() => setView(AppState.HOME)} 
      />
    );
  }

  // RESULTS SCREEN
  if (view === AppState.QUIZ_RESULTS && result) {
    const percentage = Math.round((result.score / result.total) * 100);
    let message = "Dobro delo!";
    if (percentage >= 90) message = "Odlično!";
    else if (percentage < 50) message = "Potrebno bo še malo vaje.";

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center fade-in">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Rezultat</h2>
          <p className="text-slate-500 mb-8">Tvoj uspeh pri reševanju</p>
          
          <div className="relative inline-flex items-center justify-center mb-8">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                className="text-gray-200"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
              <circle
                className={percentage > 50 ? "text-green-500" : percentage > 25 ? "text-yellow-500" : "text-red-500"}
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * percentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
              <span className="text-sm text-slate-500">{result.score} / {result.total}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6">{message}</h3>

          <div className="flex gap-3">
            <button
              onClick={() => setView(AppState.HOME)}
              className="flex-1 py-3 px-4 bg-gray-100 text-slate-700 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Domov
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
            >
              <RotateCcw className="w-4 h-4" />
              Ponovi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;