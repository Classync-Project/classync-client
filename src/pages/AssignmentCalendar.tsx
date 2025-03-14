// AssignmentCalendar.tsx
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday, parseISO } from 'date-fns';

interface Assignment {
  id: number;
  title: string;
  content: string;
  dueDate: string; // Format as ISO string
  createdAt: string;
  questionFilePath: string | null;
  solutionFilePath: string | null;
  classroom: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
  };
}

interface ClassroomOption {
  id: number;
  name: string;
}

const AssignmentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate start and end of the week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });

  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  useEffect(() => {
    // Fetch classrooms
    const fetchClassrooms = async () => {
      try {
        // In a real app, replace with actual API call
        const response = await fetch('/api/classrooms');
        const data = await response.json();
        setClassrooms([{ id: 0, name: 'All classes' }, ...data]);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchClassrooms();
  }, []);

  useEffect(() => {
    // Fetch assignments for the current week
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        // Format dates for API request
        const startDateStr = format(startDate, 'yyyy-MM-dd');
        const endDateStr = format(endDate, 'yyyy-MM-dd');
        
        // Build API URL with parameters
        let url = `/api/assignments?startDate=${startDateStr}&endDate=${endDateStr}`;
        if (selectedClassroom && selectedClassroom > 0) {
          url += `&classroomId=${selectedClassroom}`;
        }
        
        // In a real app, replace with actual API call
        const response = await fetch(url);
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
    
    // Demo data for example (matching your entity structure)
    const demoAssignments = [
      {
        id: 1,
        title: 'LAB 11',
        content: 'Lab exercises on basic programming concepts',
        dueDate: '2025-03-09T23:59:59',
        createdAt: '2025-03-01T10:00:00',
        questionFilePath: '/files/lab11-questions.pdf',
        solutionFilePath: '/files/lab11-solutions.pdf',
        classroom: {
          id: 1,
          name: 'CS 101'
        },
        createdBy: {
          id: 1,
          name: 'Professor Smith'
        }
      },
      {
        id: 2,
        title: 'Lab-11 - Understanding Docker',
        content: 'Introduction to containerization with Docker',
        dueDate: '2025-03-14T23:59:59',
        createdAt: '2025-03-05T14:30:00',
        questionFilePath: '/files/docker-lab-questions.pdf',
        solutionFilePath: null,
        classroom: {
          id: 1,
          name: 'CS 101'
        },
        createdBy: {
          id: 1,
          name: 'Professor Smith'
        }
      }
    ];
    setAssignments(demoAssignments);
    setIsLoading(false);
    
  }, [startDate, endDate, selectedClassroom]);

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleClassroomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const classroomId = parseInt(event.target.value);
    setSelectedClassroom(classroomId === 0 ? null : classroomId);
  };

  // Filter assignments by date
  const getAssignmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return assignments.filter(assignment => {
      // Parse the ISO date string and extract date part only for comparison
      const assignmentDate = format(parseISO(assignment.dueDate), 'yyyy-MM-dd');
      return assignmentDate === dateString;
    });
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow">
      {/* Header with class filter and navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-64">
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleClassroomChange}
            value={selectedClassroom || 0}
          >
            {classrooms.map(classroom => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <button
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={handlePreviousWeek}
          >
            &lt;
          </button>
          <h2 className="mx-4 text-lg font-semibold">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </h2>
          <button
            className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={handleNextWeek}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border rounded-lg overflow-hidden">
        {/* Day Headers */}
        {weekDates.map((date, index) => (
          <div key={`header-${index}`} className="p-2 text-center border-b border-r">
            <div className="font-medium text-gray-600">
              {format(date, 'EEE')}
            </div>
            <div className={`text-2xl font-bold mt-1 mx-auto w-10 h-10 flex items-center justify-center
              ${isToday(date) ? 'bg-blue-500 text-white rounded-full' : 'text-gray-800'}`}>
              {format(date, 'd')}
            </div>
          </div>
        ))}

        {/* Calendar Cells */}
        {weekDates.map((date, index) => {
          const dayAssignments = getAssignmentsForDate(date);
          return (
            <div 
              key={`cell-${index}`} 
              className="h-48 p-2 border-r overflow-y-auto"
            >
              {dayAssignments.map(assignment => (
                <div 
                  key={assignment.id}
                  className="bg-blue-600 text-white p-2 mb-2 rounded-lg text-sm"
                >
                  <div className="font-bold">Assignment: {assignment.title}</div>
                  <div className="text-xs mt-1">{assignment.classroom.name}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center mt-4 text-gray-600">
          Loading assignments...
        </div>
      )}
    </div>
  );
};

export default AssignmentCalendar;