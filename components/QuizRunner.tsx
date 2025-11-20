import React, { useState, useEffect } from 'react';
import { Question, QuizResult } from '../types';
import { CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface QuizRunnerProps {
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onExit: () => void;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ questions, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [history, setHistory] = useState<QuizResult['history']>([]);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) setScore(prev => prev + 1);

    setHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswerIndex: selectedOption,
        isCorrect
      }
    ]);

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      onFinish({
        score: score + (selectedOption === currentQuestion.correctAnswerIndex ? 0 : 0), // Score already updated
        total: questions.length,
        history
      });
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
        {/* Header / Progress */}
        <div className="bg-slate-900 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium opacity-70">Vprašanje {currentIndex + 1} od {questions.length}</span>
            <button onClick={onExit} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition">Izhod</button>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Body */}
        <div className="p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
              
              if (showFeedback) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (idx === selectedOption) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-100 text-gray-400 opacity-50";
                }
              } else {
                if (selectedOption === idx) {
                  buttonClass += "border-blue-500 bg-blue-50 text-blue-900 shadow-sm transform scale-[1.02]";
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-700";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                  {showFeedback && idx === currentQuestion.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {showFeedback && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showFeedback && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 fade-in">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">Razlaga:</p>
                <p className="text-sm text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                selectedOption !== null 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200/50' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Preveri odgovor
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all"
            >
              {currentIndex === questions.length - 1 ? 'Končaj kviz' : 'Naslednje vprašanje'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRunner;