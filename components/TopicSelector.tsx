import React from 'react';
import { SyllabusTopic } from '../types';

interface TopicSelectorProps {
  topics: SyllabusTopic[];
  onSelect: (topic: SyllabusTopic) => void;
  selectedTopic: SyllabusTopic | null;
  disabled?: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, onSelect, selectedTopic, disabled = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map(topic => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic)}
          disabled={disabled}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-full flex flex-col transform hover:-translate-y-1 hover:shadow-lg
            ${
              selectedTopic?.id === topic.id
                ? 'bg-sky-100 dark:bg-sky-900/40 border-sky-500 ring-2 ring-sky-500'
                : 'bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500'
            }
          `}
        >
          <p className="font-semibold text-slate-800 dark:text-slate-100">{topic.subject}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{topic.topic}</p>
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;