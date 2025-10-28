import React from 'react';

type AppState = 'selection' | 'loading' | 'quiz' | 'finished';

interface HeaderProps {
  appState: AppState;
  onRestart: () => void; // This will act as the "Home" button action
}


const Header: React.FC<HeaderProps> = ({ appState, onRestart }) => {
  return (
    <header className="bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6 21v-1a6 6 0 016-6v0a6 6 0 016 6v1" />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    KARTET AI Prep
                </h1>
            </div>
             <div className="flex items-center space-x-4">
                 {(appState === 'quiz' || appState === 'finished') && (
                     <button
                        onClick={onRestart}
                        title="Go to Home Page"
                        aria-label="Go to Home Page"
                        className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center space-x-2 backdrop-blur-sm"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="hidden sm:inline">Home</span>
                    </button>
                 )}
                <p className="text-sm text-sky-100 hidden sm:block">
                    Powered by Google Gemini
                </p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;