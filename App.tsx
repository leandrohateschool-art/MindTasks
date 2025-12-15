import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, LayoutList, MoreVertical, SquareCheck, Calendar as CalendarIcon, Hexagon, Plus } from 'lucide-react';
import { Task, SubTask, Priority } from './types';
import { breakdownTask } from './services/geminiService';
import { TaskItem } from './components/TaskItem';
import { Calendar } from './components/Calendar';
import { AddTaskSheet } from './components/AddTaskSheet';
import { Toast } from './components/Toast';

const STORAGE_KEY = 'mindfultasks-data-v2';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [currentDateObj] = useState(new Date()); 
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Undo state
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsAddTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = async (data: { title: string, date: string, time: string, priority: Priority }, useAI: boolean) => {
    let subtasks: SubTask[] = [];
    let priority: Priority = data.priority;
    let description = '';

    // If using AI, generate content
    if (useAI) {
      const suggestion = await breakdownTask(data.title);
      // AI suggests priority, but we could respect user choice if we wanted. 
      // For now, let's allow AI to suggest if requested.
      priority = suggestion.prioritySuggestion || 'medium';
      description = suggestion.estimatedTime || '';
      subtasks = (suggestion.subtasks || []).map(st => ({
        id: crypto.randomUUID(),
        title: st,
        completed: false
      }));
    }

    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            title: data.title,
            date: data.date,
            time: data.time || undefined,
            priority: priority,
            // Only update AI fields if AI was requested
            ...(useAI ? { description, subtasks, isExpanded: subtasks.length > 0 } : {})
          };
        }
        return t;
      }));
    } else {
      // Create new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: data.title,
        completed: false,
        priority: priority,
        description: useAI ? description : '',
        subtasks: useAI ? subtasks : [],
        createdAt: Date.now(),
        date: data.date,
        time: data.time || undefined,
        isExpanded: subtasks.length > 0
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newSubtasks = t.subtasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);
      const allDone = newSubtasks.every(st => st.completed);
      const shouldCompleteParent = allDone && newSubtasks.length > 0;
      return { 
        ...t, 
        subtasks: newSubtasks,
        completed: shouldCompleteParent ? true : (t.completed && !allDone ? false : t.completed)
      };
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks(prev => prev.filter(t => t.id !== id));
      setShowToast(true);
    }
  };

  const undoDelete = () => {
    if (lastDeletedTask) {
      setTasks(prev => [lastDeletedTask, ...prev]);
      setLastDeletedTask(null);
      setShowToast(false);
    }
  };

  const toggleExpand = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
  };

  const tasksForSelectedDate = tasks.filter(t => t.date === selectedDate);
  
  // Aggregate tasks for calendar dots
  const tasksByDate = tasks.reduce((acc, t) => {
    if (!t.completed) {
      acc[t.date] = (acc[t.date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans max-w-md mx-auto md:max-w-full md:flex-row relative">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Bar */}
        <header className="p-4 flex items-center justify-between">
          <div className="w-10"></div> {/* Spacer for alignment */}
          <div className="flex items-center gap-4">
             <button className="text-zinc-400 hover:text-white"><SlidersHorizontal className="w-5 h-5" /></button>
             <button className="text-zinc-400 hover:text-white"><LayoutList className="w-5 h-5" /></button>
             <button className="text-zinc-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <Calendar 
            currentDate={currentDateObj} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
            tasksByDate={tasksByDate}
          />

          {/* Today Divider */}
          <div className="px-6 py-2 mt-2">
            <h3 className="text-zinc-500 font-bold tracking-widest text-xs uppercase">
              {new Date().toISOString().split('T')[0] === selectedDate ? 'Today' : selectedDate}
            </h3>
          </div>

          {/* Task List */}
          <div className="px-4 mt-2">
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-10 text-zinc-600">
                <p>No tasks for this day.</p>
              </div>
            ) : (
              tasksForSelectedDate.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onEditTask={handleEditTask}
                  onToggleSubTask={toggleSubTask}
                  onToggleExpand={toggleExpand}
                />
              ))
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={handleOpenAddTask}
          className="absolute bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 transition-transform active:scale-95 z-20"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>

        {/* Bottom Navigation */}
        <div className="bg-black/90 backdrop-blur-sm border-t border-zinc-900 p-4 flex justify-between items-center px-12 pb-6 absolute bottom-0 w-full z-10">
          <button className="text-zinc-600 hover:text-white transition-colors">
            <SquareCheck className="w-6 h-6" />
          </button>
          <button className="text-white bg-zinc-800 p-2 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </button>
          <button className="text-zinc-600 hover:text-white transition-colors">
            <Hexagon className="w-6 h-6" />
          </button>
        </div>

        {/* Undo Toast */}
        <Toast 
          message="Task deleted" 
          actionLabel="Undo" 
          onAction={undoDelete} 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
        />

      </main>

      {/* Add/Edit Task Modal */}
      <AddTaskSheet 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)} 
        onSave={handleSaveTask}
        initialDate={selectedDate}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default App;
