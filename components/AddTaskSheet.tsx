import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar as CalendarIcon, Clock, Flag } from 'lucide-react';
import { Button } from './Button';
import { Task, Priority } from '../types';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string, date: string, time: string, priority: Priority }, useAI: boolean) => Promise<void>;
  initialDate: string;
  taskToEdit?: Task | null;
}

export const AddTaskSheet: React.FC<AddTaskSheetProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDate,
  taskToEdit 
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDate(taskToEdit.date);
        setTime(taskToEdit.time || '');
        setPriority(taskToEdit.priority);
      } else {
        setTitle('');
        setDate(initialDate);
        setTime('');
        setPriority('medium');
      }
    }
  }, [isOpen, taskToEdit, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (useAI: boolean) => {
    if (!title.trim()) return;
    setIsProcessing(true);
    await onSave({ title, date, time, priority }, useAI);
    setIsProcessing(false);
    onClose();
  };

  const priorityConfig: Record<Priority, { label: string, classes: string }> = {
    low: { label: 'Low', classes: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
    medium: { label: 'Medium', classes: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
    high: { label: 'High', classes: 'border-red-500/50 bg-red-500/10 text-red-400' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-zinc-900 rounded-t-3xl p-6 shadow-2xl border-t border-zinc-800 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-transparent text-xl text-white placeholder:text-zinc-600 border-none focus:ring-0 p-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(false);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium ml-1">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-medium ml-1">Time (Optional)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500 font-medium ml-1 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                    priority === p 
                    ? priorityConfig[p].classes 
                    : 'border-zinc-800 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
             <Button 
              onClick={() => handleSubmit(true)} 
              disabled={!title.trim() || isProcessing}
              isLoading={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none text-white py-3"
              icon={<Sparkles className="w-4 h-4" />}
            >
              {taskToEdit ? 'Regenerate AI' : 'AI Breakdown'}
            </Button>
            <Button 
              onClick={() => handleSubmit(false)} 
              disabled={!title.trim() || isProcessing}
              variant="secondary"
              className="flex-1 bg-white hover:bg-zinc-200 text-black border-none py-3 font-semibold"
            >
              {taskToEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
