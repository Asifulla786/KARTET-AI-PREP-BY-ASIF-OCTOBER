import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { Question, SyllabusTopic, Language, PaperType, MediumType } from './types';
import { generateQuestions } from './services/geminiService';
import QuestionDisplay from './components/QuestionDisplay';
import Timer from './components/Timer';
import ExamResults from './components/ExamResults';
import StepSelector from './components/StepSelector';
import SelectionGrid from './components/SelectionGrid';

type AppState = 'selection' | 'loading' | 'quiz' | 'finished';
const TOTAL_QUESTIONS = 5;
const TIME_PER_QUESTION = 60; // 60 seconds per question

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('selection');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);
  const [selectedMedium, setSelectedMedium] = useState<MediumType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_QUESTIONS * TIME_PER_QUESTION);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let timer: ReturnType<typeof setInterval>;
    if (appState === 'quiz' && isExamMode && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && appState === 'quiz' && isExamMode) {
      setAppState('finished');
    }
    return () => clearInterval(timer);
  }, [appState, isExamMode, timeLeft]);
  
  const handleStart = useCallback(async () => {
    if (!selectedTopic) return;
    setAppState('loading');
    setError(null);
    setQuestions([]);
    setUserAnswers({});
    try {
      const generated = await generateQuestions(selectedTopic, TOTAL_QUESTIONS);
      setQuestions(generated);
      setTimeLeft(generated.length * TIME_PER_QUESTION);
      setAppState('quiz');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setAppState('selection');
    }
  }, [selectedTopic]);

  const handleLoadMore = useCallback(async () => {
    if (!selectedTopic) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      const newQuestions = await generateQuestions(selectedTopic, TOTAL_QUESTIONS);
      setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
    } catch (e: any)
      {
        setError(e.message || 'An unknown error occurred while loading more questions.');
      } finally {
      setIsLoadingMore(false);
    }
  }, [selectedTopic]);

  const handleAnswer = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };
  
  const handleFinishExam = () => {
    setAppState('finished');
  };

  const handleRestart = () => {
    setAppState('selection');
    setSelectedPaper(null);
    setSelectedMedium(null);
    setSelectedTopic(null);
    setQuestions([]);
    setUserAnswers({});
    setError(null);
  };
  
  const handleBack = () => {
    if (appState !== 'selection') return; // Only allow back on selection screen

    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedMedium) {
      setSelectedMedium(null);
      setSelectedTopic(null); 
    } else if (selectedPaper) {
      setSelectedPaper(null);
      setSelectedMedium(null);
      setSelectedTopic(null);
    }
  };


  const steps = useMemo(() => {
    // FIX: Refactored step status logic to be more explicit and fix type inference issues.
    // The previous ternary operators with misplaced `as const` were causing incorrect type inference,
    // leading to a type mismatch with the `Step` type expected by `StepSelector`.
    const topicStepStatus: 'current' | 'complete' = appState === 'selection' ? 'current' : 'complete';

    let quizStepStatus: 'current' | 'upcoming' | 'complete' = 'complete';
    if (appState === 'quiz') {
      quizStepStatus = 'current';
    } else if (appState === 'selection' || appState === 'loading') {
      quizStepStatus = 'upcoming';
    }

    const resultsStepStatus: 'current' | 'upcoming' = appState === 'finished' ? 'current' : 'upcoming';
    
    return [
      { name: '1. Select Topic', status: topicStepStatus },
      { name: '2. Take Quiz', status: quizStepStatus },
      { name: '3. View Results', status: resultsStepStatus },
    ];
  }, [appState]);

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingSpinner />;
      case 'quiz':
        return (
          <>
            <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-inner">
                <div className="text-left">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Topic</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedTopic?.subject}</p>
                </div>
                {isExamMode && <Timer timeLeft={timeLeft} />}
            </div>
             {error && <div className="mb-4"><ErrorDisplay message={error} /></div>}
            <QuestionDisplay
              questions={questions}
              selectedLanguage={selectedLanguage}
              userAnswers={userAnswers}
              onAnswer={handleAnswer}
              isExamMode={isExamMode}
              isFinished={false}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
            />
            {isExamMode && Object.keys(userAnswers).length === questions.length && (
              <div className="mt-8 text-center">
                <button onClick={handleFinishExam} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Finish & View Results
                </button>
              </div>
            )}
          </>
        );
      case 'finished':
          return (
            <>
                <ExamResults questions={questions} userAnswers={userAnswers} onRestart={handleRestart} />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 my-6">Review Your Answers</h2>
                <QuestionDisplay
                    questions={questions}
                    selectedLanguage={selectedLanguage}
                    userAnswers={userAnswers}
                    onAnswer={() => {}} // no-op
                    isExamMode={true}
                    isFinished={true}
                    onLoadMore={() => {}} // no-op
                    isLoadingMore={false}
                />
            </>
          );
      case 'selection':
      default:
        return (
          <>
            {error && <ErrorDisplay message={error} />}
            <SelectionGrid 
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
              selectedPaper={selectedPaper}
              onPaperSelect={setSelectedPaper}
              selectedMedium={selectedMedium}
              onMediumSelect={setSelectedMedium}
              selectedTopic={selectedTopic}
              onTopicSelect={setSelectedTopic}
              isExamMode={isExamMode}
              onExamModeToggle={() => setIsExamMode(!isExamMode)}
              onStart={handleStart}
              onBack={handleBack}
              // FIX: This comparison was invalid because `appState` is narrowed to 'selection' in this switch case.
              // Since the loading state displays a spinner instead of this component, `isLoading` is always false here.
              isLoading={false}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header appState={appState} onRestart={handleRestart} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-12 flex justify-center pt-8">
            <StepSelector steps={steps} />
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20">
             {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;