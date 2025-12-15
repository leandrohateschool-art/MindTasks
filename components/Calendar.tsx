import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  currentDate: Date;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasksByDate: Record<string, number>; // Date string -> task count
}

export const Calendar: React.FC<CalendarProps> = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate,
  tasksByDate 
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Adjust for Monday start if desired, but screenshot looks like standard layout
  // Let's assume standard Sun-Sat or Mon-Sun. Screenshot shows "Tue 30", "Wed 1". 
  // Let's render a standard grid.

  const days = [];
  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-hand font-bold text-white">{monthNames[month]}</h2>
        {/* Placeholder logic for changing months if needed, strictly UI per screenshot is static month but we make it usable */}
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-zinc-500 text-xs font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-4">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;
          
          const dateStr = formatDate(day);
          const isSelected = selectedDate === dateStr;
          const hasTask = tasksByDate[dateStr] > 0;
          const today = isToday(day);

          return (
            <div key={day} className="flex flex-col items-center justify-start h-10 relative">
              <button
                onClick={() => onSelectDate(dateStr)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all relative
                  ${isSelected ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-zinc-300 hover:bg-zinc-800'}
                  ${today && !isSelected ? 'text-blue-400 font-bold' : ''}
                `}
              >
                {day}
              </button>
              {hasTask && (
                <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
