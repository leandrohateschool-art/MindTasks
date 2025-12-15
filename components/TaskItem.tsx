import React from 'react';
import { Check, ChevronDown, ChevronUp, Trash2, Pencil, Clock } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  onToggleExpand: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleSubTask,
  onToggleExpand
}) => {
  const priorityColors: Record<Priority, string> = {
    low: "bg-blue-500",
    medium: "bg-amber-500",
    high: "bg-red-500"
  };

  return (
    <div className="group mb-3">
      <div className={`bg-zinc-900 rounded-xl p-4 flex items-center gap-4 transition-all border border-zinc-800 hover:border-zinc-700 relative overflow-hidden ${task.completed ? 'opacity-60' : ''}`}>
        
        {/* Priority Indicator */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority] || 'bg-zinc-700'}`} />

        {/* Checkbox */}
        <button
          onClick={() => onToggleTask(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ml-1 ${
            task.completed 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-zinc-600 text-transparent hover:border-blue-500'
          }`}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => task.subtasks.length > 0 && onToggleExpand(task.id)}>
          <div className="flex items-center justify-between">
            <h3 className={`font-medium text-base leading-snug truncate ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              {task.time && (
                <span className="text-xs text-zinc-400 flex items-center gap-1 bg-zinc-800 px-1.5 py-0.5 rounded">
                  <Clock className="w-3 h-3" />
                  {task.time}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
             {task.description && (
              <span className="text-xs text-blue-400 font-medium truncate max-w-[150px]">{task.description}</span>
            )}
          </div>

          {task.subtasks.length > 0 && (
             <div className="mt-2 flex items-center gap-2">
               <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden max-w-[100px]">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-300"
                   style={{ width: `${(task.subtasks.filter(t => t.completed).length / task.subtasks.length) * 100}%` }}
                 />
               </div>
               <span className="text-xs text-zinc-500">{task.subtasks.filter(t => t.completed).length}/{task.subtasks.length}</span>
             </div>
          )}
        </div>

        {/* Action Icon (Edit, Delete, Expand) */}
        <div className="flex items-center gap-1">
           <button onClick={() => onEditTask(task)} className="text-zinc-500 hover:text-blue-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <Pencil className="w-4 h-4" />
           </button>
           
           {task.subtasks.length > 0 && (
             <button onClick={() => onToggleExpand(task.id)} className="text-zinc-500 hover:text-white p-1">
               {task.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
             </button>
           )}
           <button onClick={() => onDeleteTask(task.id)} className="text-zinc-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Subtasks */}
      {task.isExpanded && task.subtasks.length > 0 && (
        <div className="ml-8 mt-2 space-y-2 border-l-2 border-zinc-800 pl-4">
          {task.subtasks.map(st => (
            <div key={st.id} className="flex items-center gap-3">
              <button
                onClick={() => onToggleSubTask(task.id, st.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  st.completed ? 'bg-zinc-700 border-zinc-700 text-zinc-300' : 'border-zinc-600 hover:border-zinc-500'
                }`}
              >
                {st.completed && <Check className="w-3 h-3" />}
              </button>
              <span className={`text-sm ${st.completed ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                {st.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
