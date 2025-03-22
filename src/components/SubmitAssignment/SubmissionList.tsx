import React from 'react';
import { Loader } from 'lucide-react';
import { Submission } from '@/types/Submission';
import SubmissionItem from './SubmissionItem';

interface SubmissionListProps {
  submissions: Submission[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEvaluate: (id: string) => void;
  loadingScores: { [key: string]: boolean };
  isDueDatePassed: boolean;
}

const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  isLoading,
  onDelete,
  onEvaluate,
  loadingScores,
  isDueDatePassed,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-600">Loading your submissions...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-800">
        Your Submissions
      </h4>
      <div className="space-y-3">
        {submissions.map((submission, index) => (
          <SubmissionItem
            key={submission.id}
            submission={submission}
            index={index}
            onDelete={onDelete}
            onEvaluate={onEvaluate}
            isLoading={loadingScores[submission.id] || false}
            isDueDatePassed={isDueDatePassed}
          />
        ))}
      </div>
    </div>
  );
};

export default SubmissionList;