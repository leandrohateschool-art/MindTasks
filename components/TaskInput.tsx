import React, { useState, KeyboardEvent } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface TaskInputProps {
  onAddTask: (title: string, useAI: boolean) => Promise<void>;
  isProcessing: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(false);
    }
  };

  const handleSubmit = async (useAI: boolean) => {
    if (!input.trim()) return;
    await onAddTask(input, useAI);
    setInput('');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
          disabled={isProcessing}
        />
        <div className="flex gap-2">
          <Button 
            onClick={() => handleSubmit(false)} 
            disabled={!input.trim() || isProcessing}
            variant="secondary"
            className="flex-1 sm:flex-none"
            icon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            disabled={!input.trim() || isProcessing}
            isLoading={isProcessing}
            variant="primary"
            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-none"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Smart Add
          </Button>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 ml-1">
        💡 Tip: Use "Smart Add" to let AI break down complex tasks for you.
      </p>
    </div>
  );
};
