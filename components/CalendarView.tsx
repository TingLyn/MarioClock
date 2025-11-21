import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react';
import MarioCard from './ui/MarioCard';
import { getHistory } from '../services/storage';
import { DailyRecord } from '../types';
import clsx from 'clsx';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [history, setHistory] = useState<Record<string, DailyRecord>>({});
  const [selectedDateRec, setSelectedDateRec] = useState<DailyRecord | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    setSelectedDateRec(null);
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const renderCalendarGrid = () => {
    const grid = [];
    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="h-12 md:h-20 bg-transparent" />);
    }

    // Day cells
    for (let d = 1; d <= days; d++) {
      const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0];
      const record = history[dateKey];
      const hasTasks = record && record.tasks.length > 0;
      
      grid.push(
        <button
          key={d}
          onClick={() => record ? setSelectedDateRec(record) : setSelectedDateRec(null)}
          className={clsx(
            "h-12 md:h-20 border-2 border-black rounded-md flex flex-col items-center justify-center relative transition-transform hover:scale-105",
            hasTasks ? "bg-yellow-100" : "bg-white",
            selectedDateRec?.date === dateKey ? "ring-4 ring-mario-red z-10" : ""
          )}
        >
          <span className="font-bold text-gray-700 text-xs md:text-sm absolute top-1 left-1">{d}</span>
          {hasTasks && (
            <div className="flex flex-col items-center">
               <Star className="w-4 h-4 md:w-6 md:h-6 text-mario-yellow fill-mario-yellow drop-shadow-md" />
               <span className="text-[10px] font-pixel mt-1 text-mario-red hidden md:block">{record.totalMinutes}m</span>
            </div>
          )}
        </button>
      );
    }
    return grid;
  };

  return (
    <div className="space-y-6">
      <MarioCard title="Mission Log" className="bg-white">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 bg-mario-brown text-white rounded border-2 border-black hover:bg-amber-800"><ChevronLeft /></button>
          <h3 className="font-pixel text-sm md:text-lg text-center">{monthName}</h3>
          <button onClick={() => changeMonth(1)} className="p-2 bg-mario-brown text-white rounded border-2 border-black hover:bg-amber-800"><ChevronRight /></button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
             <div key={d} className="font-pixel text-[10px] text-gray-500">{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {renderCalendarGrid()}
        </div>
      </MarioCard>

      {selectedDateRec && (
        <MarioCard title={`Logs: ${selectedDateRec.date}`} className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4 p-3 bg-green-100 border-2 border-mario-green rounded-lg">
             <div className="flex items-center gap-2">
                <Trophy className="text-mario-yellow fill-mario-yellow w-6 h-6" />
                <span className="font-bold text-mario-green">Total Focus:</span>
             </div>
             <span className="font-pixel text-xl">{selectedDateRec.totalMinutes} min</span>
          </div>
          <ul className="space-y-2">
            {selectedDateRec.tasks.map((task, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 border-b-2 border-gray-200 last:border-0">
                <span className="font-medium text-gray-800">{task.name || "Unknown Task"}</span>
                <span className="px-2 py-1 bg-mario-blue text-white text-xs rounded-full font-bold">{task.duration} min</span>
              </li>
            ))}
          </ul>
        </MarioCard>
      )}
    </div>
  );
};

export default CalendarView;