import React, { useMemo } from 'react';
import { Language, SyllabusTopic, PaperType, MediumType } from '../types';
import { SYLLABUS_TOPICS } from '../constants';
import LanguageSelector from './LanguageSelector';
import TopicSelector from './TopicSelector';
import ExamModeToggle from './ExamModeToggle';

interface SelectionGridProps {
    selectedLanguage: Language;
    onLanguageSelect: (language: Language) => void;
    selectedPaper: PaperType | null;
    onPaperSelect: (paper: PaperType) => void;
    selectedMedium: MediumType | null;
    onMediumSelect: (medium: MediumType) => void;
    selectedTopic: SyllabusTopic | null;
    onTopicSelect: (topic: SyllabusTopic) => void;
    isExamMode: boolean;
    onExamModeToggle: () => void;
    onStart: () => void;
    onBack: () => void;
    isLoading: boolean;
}
const TOTAL_QUESTIONS = 5;

// A helper component for selection buttons
const SelectionButton: React.FC<{label: string; onClick: () => void; isSelected: boolean; disabled: boolean;}> = ({ label, onClick, isSelected, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full sm:w-auto flex-grow text-center px-6 py-3 text-md font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border
            ${
                isSelected
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg focus:ring-sky-300 border-transparent transform scale-105'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:ring-sky-500 border-slate-200 dark:border-slate-600 hover:border-sky-400'
            }
        `}
    >
        {label}
    </button>
);

const SelectionStep: React.FC<{title: string; step: number; children: React.ReactNode; isVisible: boolean;}> = ({ title, step, children, isVisible }) => {
    if (!isVisible) return null;
    return (
        <div className="animate-fade-in transition-all duration-300">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-bold">{step}</span>
                <span>{title}</span>
            </h2>
            {children}
        </div>
    );
};

const SelectionGrid: React.FC<SelectionGridProps> = ({
    selectedLanguage,
    onLanguageSelect,
    selectedPaper,
    onPaperSelect,
    selectedMedium,
    onMediumSelect,
    selectedTopic,
    onTopicSelect,
    isExamMode,
    onExamModeToggle,
    onStart,
    onBack,
    isLoading
}) => {
    const papers: PaperType[] = ['Paper I', 'Paper II'];
    const mediums: MediumType[] = ['Urdu', 'Kannada', 'English'];

    const availableSubjects = useMemo(() => {
        if (!selectedPaper || !selectedMedium) return [];

        const mediumToSubjectMap: Record<MediumType, string> = {
            'Urdu': 'Urdu',
            'Kannada': 'Kannada',
            'English': 'English',
        };
        const lang1Subject = mediumToSubjectMap[selectedMedium];
        const lang2Subject = 'English';

        return SYLLABUS_TOPICS.filter(topic => {
            if (topic.paper !== selectedPaper) return false;

            const isCoreSubject = !['Urdu', 'Kannada', 'English'].includes(topic.subject);
            const isSelectedLang1 = topic.subject === lang1Subject;
            const isSelectedLang2 = topic.subject === lang2Subject && lang1Subject !== lang2Subject;
            
            return isCoreSubject || isSelectedLang1 || isSelectedLang2;
        });
    }, [selectedPaper, selectedMedium]);

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Create Your Test</h2>
                {selectedPaper && (
                     <button
                        onClick={onBack}
                        className="text-sm font-semibold text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors flex items-center space-x-1"
                        aria-label="Go to previous selection step"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                      </button>
                )}
            </div>

            <SelectionStep title="Choose Your Paper" step={1} isVisible={true}>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                    {papers.map(paper => (
                        <SelectionButton 
                            key={paper}
                            label={paper}
                            isSelected={selectedPaper === paper}
                            onClick={() => {
                                onPaperSelect(paper);
                                onTopicSelect(null); // Reset topic when paper changes
                            }}
                            disabled={isLoading}
                        />
                    ))}
                </div>
            </SelectionStep>
            
            <SelectionStep title="Choose Your Medium" step={2} isVisible={!!selectedPaper}>
                 <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                    {mediums.map(medium => (
                        <SelectionButton 
                            key={medium}
                            label={medium}
                            isSelected={selectedMedium === medium}
                            onClick={() => {
                                onMediumSelect(medium);
                                onTopicSelect(null); // Reset topic when medium changes
                            }}
                            disabled={isLoading}
                        />
                    ))}
                </div>
            </SelectionStep>

            <SelectionStep title="Select a Subject" step={3} isVisible={!!selectedPaper && !!selectedMedium}>
                <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg text-sm text-sky-800 dark:text-sky-200 mb-4">
                    <p>
                        Language I is your chosen medium ({selectedMedium || '...'}). Language II is English. Other core subjects are also available.
                    </p>
                </div>
                <TopicSelector 
                    topics={availableSubjects} 
                    selectedTopic={selectedTopic} 
                    onSelect={onTopicSelect} 
                    disabled={isLoading} 
                />
            </SelectionStep>

            <SelectionStep title="Choose Question Language" step={4} isVisible={!!selectedTopic}>
                <LanguageSelector selectedLanguage={selectedLanguage} onSelect={onLanguageSelect} disabled={isLoading} />
            </SelectionStep>

            <ExamModeToggle isExamMode={isExamMode} onToggle={onExamModeToggle} disabled={isLoading || !selectedTopic} />
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={onStart}
                    disabled={!selectedTopic || isLoading}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                >
                    {isLoading ? 'Generating Questions...' : `Generate ${TOTAL_QUESTIONS} Questions & Start`}
                </button>
            </div>
        </div>
    );
};

export default SelectionGrid;