import React, { useState } from 'react';
import { Timer, CalendarDays, Ghost } from 'lucide-react';
import TimerView from './components/TimerView';
import CalendarView from './components/CalendarView';
import MarioButton from './components/ui/MarioButton';
import { ViewState } from './types';
import clsx from 'clsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('TIMER');

  return (
    <div className="min-h-screen pb-10 flex flex-col items-center font-sans text-gray-900">
      
      {/* Header / Clouds Decoration */}
      <header className="w-full max-w-4xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="bg-white border-4 border-black px-6 py-3 shadow-cartoon rounded-full transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
            <h1 className="text-2xl md:text-3xl font-pixel text-mario-red drop-shadow-md">
                MARIO<span className="text-mario-green">CLOCK</span>
            </h1>
        </div>

        <nav className="flex gap-4">
            <MarioButton 
                variant={currentView === 'TIMER' ? 'red' : 'blue'}
                onClick={() => setCurrentView('TIMER')}
                className="flex items-center gap-2"
            >
                <Timer size={20} />
                <span className="hidden md:inline">Timer</span>
            </MarioButton>
            
            <MarioButton 
                variant={currentView === 'CALENDAR' ? 'red' : 'blue'}
                onClick={() => setCurrentView('CALENDAR')}
                className="flex items-center gap-2"
            >
                <CalendarDays size={20} />
                <span className="hidden md:inline">Records</span>
            </MarioButton>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg px-4 z-10 mt-4">
        {currentView === 'TIMER' ? (
            <TimerView />
        ) : (
            <CalendarView />
        )}
      </main>

      {/* Decorative Ground */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-[url('https://i.imgur.com/Is9V2c8.png')] bg-repeat-x z-0 border-t-4 border-black" 
           style={{ backgroundSize: 'contain', backgroundColor: '#8B4513' }}>
      </div>
      
      {/* Floating Elements (Decoration) */}
      <div className="fixed top-20 left-10 text-white opacity-80 animate-bounce hidden lg:block">
          <div className="bg-white w-16 h-8 rounded-full relative"></div>
      </div>
       <div className="fixed top-40 right-20 text-white opacity-80 animate-pulse hidden lg:block">
          <div className="bg-white w-24 h-10 rounded-full relative"></div>
      </div>

    </div>
  );
};

export default App;