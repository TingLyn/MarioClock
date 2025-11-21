export interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
  completedAt: number; // timestamp
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  tasks: Task[];
}

export enum TimerMode {
  WORK = 'WORK',
  BREAK = 'BREAK'
}

export type ViewState = 'TIMER' | 'CALENDAR';