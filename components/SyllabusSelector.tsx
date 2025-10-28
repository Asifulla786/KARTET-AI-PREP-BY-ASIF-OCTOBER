import React from 'react';
import { SyllabusTopic } from '../types';

interface SyllabusSelectorProps {
  topics: SyllabusTopic[];
  onSelect: (topic: SyllabusTopic) => void;
  selectedTopic: SyllabusTopic | null;
  disabled?: boolean;
}

const SyllabusSelector: React.FC<SyllabusSelectorProps> = ({ topics, onSelect, selectedTopic, disabled = false }) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const topic = topics.find(t => t.id === selectedId);
    if (topic) {
      onSelect(topic);
    }
  };

  const groupedTopics = topics.reduce((acc: Record<string, SyllabusTopic[]>, topic) => {
    const key = `${topic.paper} - ${topic.subject}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(topic);
    return acc;
  }, {} as Record<string, SyllabusTopic[]>);

  return (
    <div className="relative">
      <select
        value={selectedTopic?.id || ''}
        onChange={handleSelectChange}
        disabled={disabled}
        className="block w-full px-4 py-3 text-base text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled>-- Choose a topic --</option>
        {/* FIX: Replaced Object.entries with Object.keys to avoid a TypeScript error where the topic group was inferred as 'unknown'. */}
        {Object.keys(groupedTopics).map((groupName) => (
          <optgroup label={groupName} key={groupName}>
            {groupedTopics[groupName].map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.topic}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default SyllabusSelector;
