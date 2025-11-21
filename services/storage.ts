import { Task, DailyRecord } from '../types';

const STORAGE_KEY = 'mario_pomodoro_history';

export const getHistory = (): Record<string, DailyRecord> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load history", e);
    return {};
  }
};

export const saveTask = (task: Task) => {
  const history = getHistory();
  const dateKey = new Date(task.completedAt).toISOString().split('T')[0];

  if (!history[dateKey]) {
    history[dateKey] = {
      date: dateKey,
      totalMinutes: 0,
      tasks: []
    };
  }

  history[dateKey].tasks.push(task);
  history[dateKey].totalMinutes += task.duration;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
};

export const getDailyRecord = (date: Date): DailyRecord | null => {
  const history = getHistory();
  const dateKey = date.toISOString().split('T')[0];
  return history[dateKey] || null;
};