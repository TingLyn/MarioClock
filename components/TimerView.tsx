import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Plus } from 'lucide-react';
import MarioButton from './ui/MarioButton';
import MarioCard from './ui/MarioCard';
import { saveTask, getDailyRecord } from '../services/storage';
import { Task } from '../types';
import clsx from 'clsx';

const PRESETS = [5, 10, 15, 25, 45, 60];

const TimerView: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [completedEffect, setCompletedEffect] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load today's tasks on mount
    const record = getDailyRecord(new Date());
    if (record) {
      setTodaysTasks(record.tasks);
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setCompletedEffect(true);
    
    // Simple beep fallback if no sound file
    try {
        // In a real app, we'd play a sound here
        // new Audio('/mario-coin.mp3').play();
    } catch(e) {}

    const durationMin = Math.floor(initialTime / 60);
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName || `Focus Session (${durationMin}m)`,
      duration: durationMin,
      completedAt: Date.now(),
    };

    saveTask(newTask);
    setTodaysTasks((prev) => [...prev, newTask]);
    
    setTimeout(() => setCompletedEffect(false), 3000);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setPreset = (minutes: number) => {
    setIsActive(false);
    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Timer Card */}
      <MarioCard title="Time Left" type="question" className="text-center relative">
        
        {/* Completion Effect Overlay */}
        {completedEffect && (
          <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center animate-pulse">
             <h2 className="font-pixel text-mario-yellow text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4">LEVEL CLEARED!</h2>
             <div className="text-6xl">🍄</div>
          </div>
        )}

        <div className="mb-8 mt-4">
          <div className={clsx(
            "font-pixel text-5xl md:text-7xl transition-colors",
            isActive ? "text-mario-green" : "text-gray-800",
            timeLeft < 60 && isActive ? "text-mario-red animate-pulse" : ""
          )}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Task Input */}
        <div className="mb-6 px-4">
            <div className="flex items-center border-4 border-black rounded-lg overflow-hidden shadow-cartoon-sm">
                <input 
                    type="text" 
                    placeholder="What are you working on?" 
                    className="w-full p-3 outline-none font-sans text-lg"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    disabled={isActive}
                />
                <div className="bg-mario-yellow p-3 border-l-4 border-black">
                    <span className="font-pixel text-xs">?</span>
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <MarioButton 
            onClick={toggleTimer} 
            variant={isActive ? "yellow" : "green"}
            className="w-32 flex justify-center items-center gap-2"
          >
             {isActive ? <Pause size={18} /> : <Play size={18} />}
             {isActive ? "PAUSE" : "START"}
          </MarioButton>
          
          <MarioButton 
            onClick={resetTimer} 
            variant="red"
            className="flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} />
          </MarioButton>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {PRESETS.map((min) => (
            <button
              key={min}
              onClick={() => setPreset(min)}
              className={clsx(
                "font-pixel text-xs py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                initialTime === min * 60 
                  ? "bg-mario-blue text-white" 
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {min}m
            </button>
          ))}
        </div>
      </MarioCard>

      {/* Today's Log */}
      <MarioCard title="Today's Coins" className="min-h-[200px]">
        {todaysTasks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="font-pixel text-xs mb-2">NO COINS YET...</p>
            <p>Start the timer to collect them!</p>
          </div>
        ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {todaysTasks.slice().reverse().map((task) => (
                    <div key={task.id} className="flex items-center justify-between bg-yellow-50 border-2 border-mario-yellow p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex-shrink-0 w-8 h-8 bg-mario-yellow rounded-full border-2 border-black flex items-center justify-center text-xs font-bold shadow-sm">$</div>
                            <span className="font-medium truncate">{task.name}</span>
                        </div>
                        <span className="text-gray-500 text-sm font-pixel ml-2">{task.duration}m</span>
                    </div>
                ))}
            </div>
        )}
      </MarioCard>
    </div>
  );
};

export default TimerView;