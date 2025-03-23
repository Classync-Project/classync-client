import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatDate, getRemainingTime } from '../../utils/dateUtils';

interface DueDateProps {
  dueDate: string;
  isLate: boolean;
}

const DueDate: React.FC<DueDateProps> = ({ dueDate, isLate }) => {
  return (
    <>
      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="w-5 h-5 text-blue-500" />
        <div className="text-sm text-blue-700">
          <p>Due: {formatDate(dueDate)}</p>
          <p className="text-xs mt-1">
            {isLate
              ? "Due date has passed. Your submission will be marked as late."
              : `Time remaining: ${getRemainingTime(dueDate)}`}
          </p>
        </div>
      </div>

      {isLate && (
        <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <p className="text-sm text-yellow-700">
            This submission will be marked as late
          </p>
        </div>
      )}
    </>
  );
};

export default DueDate;