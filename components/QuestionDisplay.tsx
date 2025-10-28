
import React from 'react';
import { Language, Question } from '../types';
import QuestionCard from './QuestionCard';

interface QuestionDisplayProps {
  questions: Question[];
  selectedLanguage: Language;
  userAnswers: Record<number, string>;
  onAnswer: (questionIndex: number, answer: string) => void;
  isExamMode: boolean;
  isFinished: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questions,
  selectedLanguage,
  userAnswers,
  onAnswer,
  isExamMode,
  isFinished,
  onLoadMore,
  isLoadingMore,
}) => {
  return (
    <div>
      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          question={question}
          questionIndex={index}
          selectedLanguage={selectedLanguage}
          userAnswer={userAnswers[index] || null}
          onAnswer={(answer) => onAnswer(index, answer)}
          isAnswered={!!userAnswers[index] || isFinished}
          isExamMode={isExamMode}
          isFinished={isFinished}
        />
      ))}
      {!isExamMode && !isFinished && (
        <div className="mt-8 flex justify-center">
            <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="bg-gradient-to-r from-slate-200 to-slate-100 hover:from-slate-300 hover:to-slate-200 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-lg text-md transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center transform hover:-translate-y-0.5"
            >
                {isLoadingMore ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading More...
                    </>
                ) : (
                    'Load More Questions'
                )}
            </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;