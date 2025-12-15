export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  subtasks: SubTask[];
  createdAt: number;
  date: string; // ISO Date string YYYY-MM-DD
  time?: string; // HH:mm
  isExpanded?: boolean;
}

export type Priority = 'low' | 'medium' | 'high';

export interface AIBSuggestion {
  subtasks: string[];
  estimatedTime?: string;
  prioritySuggestion?: Priority;
}
