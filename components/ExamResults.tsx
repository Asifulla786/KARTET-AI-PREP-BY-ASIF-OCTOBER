import React from 'react';
import { Question } from '../types';

interface ExamResultsProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  onRestart: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({ questions, userAnswers, onRestart }) => {
  const score = questions.reduce((acc, question, index) => {
    // FIX: Correctly check user's answer against the correct option.
    // The user answer is a string of the option text. We check against all language variants of the correct option.
    const correctAnswerIndex = question.correct_answer_index;
    if (correctAnswerIndex === undefined || correctAnswerIndex < 0) return acc;
    
    const correctEnglishAnswer = question.options.english_options[correctAnswerIndex];
    const correctUrduAnswer = question.options.urdu_options[correctAnswerIndex];
    const correctKannadaAnswer = question.options.kannada_options[correctAnswerIndex];
    
    const userAnswer = userAnswers[index];

    if (userAnswer === correctEnglishAnswer || userAnswer === correctUrduAnswer || userAnswer === correctKannadaAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);
  
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getPerformanceMessage = () => {
      if (percentage >= 80) return "Excellent Work!";
      if (percentage >= 60) return "Good Job!";
      if (percentage >= 40) return "Keep Practicing!";
      return "Needs Improvement.";
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 to-indigo-600 rounded-xl text-white p-8 shadow-2xl mb-8 text-center" role="alert">
        <h2 className="text-3xl font-bold mb-2">{getPerformanceMessage()}</h2>
        <p className="text-sky-100 mb-6">You've completed the exam. Here's how you did:</p>
        
        <div className="bg-white/20 rounded-lg p-6 mb-8 flex items-center justify-center space-x-6 backdrop-blur-sm">
            <div className="text-left">
                <p className="text-5xl font-extrabold">{score}<span className="text-3xl font-semibold text-sky-200">/{totalQuestions}</span></p>
                <p className="text-sky-100">Correct Answers</p>
            </div>
            <div className="w-px h-16 bg-white/30"></div>
            <div className="text-left">
                 <p className="text-5xl font-extrabold">{percentage}<span className="text-3xl font-semibold text-sky-200">%</span></p>
                 <p className="text-sky-100">Score</p>
            </div>
        </div>
        
        <button
            onClick={onRestart}
            className="bg-white text-sky-600 font-bold py-3 px-8 rounded-lg hover:bg-sky-100 transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
            Take Another Test
        </button>
    </div>
  );
};

export default ExamResults;