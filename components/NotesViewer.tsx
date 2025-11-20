import React from 'react';
import { GEO_NOTES } from '../constants';
import { ScrollText, BookOpen } from 'lucide-react';

const NotesViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Simple parser to make the text look nice without heavy markdown libraries
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-blue-900 mt-8 mb-4 pb-2 border-b-2 border-blue-200">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-teal-700 mt-6 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ') || line.trim().startsWith('*')) {
        const content = line.replace('*', '').trim();
        // Bold text parsing for **text**
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return (
          <li key={index} className="ml-6 list-disc text-slate-700 mb-1">
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong> 
                : part
            )}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      
       // Paragraph parsing with bold support
       const parts = line.split(/(\*\*.*?\*\*)/g);
       return (
         <p key={index} className="text-slate-700 mb-2 leading-relaxed">
           {parts.map((part, i) => 
             part.startsWith('**') && part.endsWith('**') 
               ? <strong key={i} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong> 
               : part
           )}
         </p>
       );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="bg-white shadow-sm border-b p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Učni Zapiski</h2>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Nazaj na meni
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full fade-in">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {renderContent(GEO_NOTES)}
        </div>
      </div>
    </div>
  );
};

export default NotesViewer;