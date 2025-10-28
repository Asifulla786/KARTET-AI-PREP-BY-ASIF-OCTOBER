import React from 'react';
import { Language, Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedLanguage: Language;
  userAnswer: string | null;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  isExamMode: boolean;
  isFinished: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  selectedLanguage,
  userAnswer,
  onAnswer,
  isAnswered,
  isExamMode,
  isFinished,
}) => {
  const getQuestionText = () => {
    switch (selectedLanguage) {
      case 'en':
        return question.english_question;
      case 'ur':
        return question.urdu_question;
      case 'kn':
        return question.kannada_question;
      default:
        return question.english_question;
    }
  };

  const getOptions = () => {
    switch (selectedLanguage) {
      case 'en':
        return question.options.english_options;
      case 'ur':
        return question.options.urdu_options;
      case 'kn':
        return question.options.kannada_options;
      default:
        return question.options.english_options;
    }
  };

  const questionText = getQuestionText();
  const options = getOptions();
  const correctAnswer = options[question.correct_answer_index];
  
  const isRtl = selectedLanguage === 'ur';

  const getOptionClassName = (option: string) => {
    const showResults = (isAnswered && !isExamMode) || isFinished;
    if (showResults) {
        if (option === correctAnswer) {
            return 'border-green-500 bg-green-100 dark:bg-green-900/50 ring-2 ring-green-500 text-green-800 dark:text-green-200 font-semibold';
        }
        if (option === userAnswer && option !== correctAnswer) {
            return 'border-red-500 bg-red-100 dark:bg-red-900/50 ring-2 ring-red-500 text-red-800 dark:text-red-300 font-semibold';
        }
    }
    
    if (userAnswer === option) {
        return 'border-sky-500 bg-sky-100 dark:bg-sky-900/50 ring-2 ring-sky-500 text-sky-800 dark:text-sky-200 font-semibold';
    }

    return 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-slate-700';
  };
  
  const langClassName = isRtl ? 'font-nastaleeq text-2xl' : 'font-sans text-base';

  const isRepeated = question.repeated_years && !question.repeated_years.toLowerCase().includes('new');
  const isHighYield = question.repeated_years && question.repeated_years.toLowerCase().includes('new');

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl shadow-lg mb-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
        <h3 className={`flex-1 min-w-0 text-xl font-semibold text-slate-800 dark:text-slate-100 ${langClassName} ${isRtl ? 'text-right' : 'text-left'} break-words`}>
            <span className="text-sky-600 dark:text-sky-400 font-bold mr-2">{questionIndex + 1}.</span>
            {`${questionText}`}
        </h3>
        {isRepeated && (
            <span className="flex-shrink-0 flex items-center space-x-1.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5v6.75c0 .14.11.25.25.25h10.5a.25.25 0 00.25-.25V8.5h-11z" clipRule="evenodd" />
                </svg>
                <span>KARTET {question.repeated_years}</span>
            </span>
        )}
        {isHighYield && (
            <span className="flex-shrink-0 flex items-center space-x-1.5 text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{question.repeated_years}</span>
            </span>
        )}
      </div>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={(isAnswered && !isExamMode) || isFinished}
            className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed 
            ${getOptionClassName(option)} 
            ${langClassName} 
            ${isRtl ? 'text-right flex-row-reverse' : 'text-left'}`}
          >
            <span className="flex-shrink-0 font-bold text-slate-600 dark:text-slate-300">{String.fromCharCode(65 + index)}</span>
            <span className="flex-1 text-slate-700 dark:text-slate-200 break-words">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;