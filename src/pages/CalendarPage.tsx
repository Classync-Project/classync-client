import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Assignment } from "@/types/Assignment";
import { Classroom } from "@/types/Classroom";
import { toast } from "react-toastify";

interface UserClassroom {
    classroom: Classroom;
    role: string;
}

const CalendarPage: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const calendarRef = useRef<FullCalendar | null>(null);
    const [classFilter, setClassFilter] = useState("All classes");
    const [isLoading, setIsLoading] = useState(true);
    const [classrooms, setClassrooms] = useState<UserClassroom[]>([]);
    const useremail = localStorage.getItem("useremail");

    useEffect(() => {
        if (!useremail) {
            toast.error("User email is not available. Please log in again.");
            return;
        }

        const fetchClassrooms = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(
                    "http://localhost:8080/api/classrooms/myclassrooms",
                    {
                        params: { useremail },
                        withCredentials: true,
                    }
                );
                console.log(data);
                setClassrooms(data);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching classrooms");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassrooms();
    }, [useremail]);

    // useEffect(() => {
    //     const fetchAssignments = async () => {
    //         setIsLoading(true);
    //         const startDate = new Date();
    //         const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

    //         try {
    //             const response = await axios.get("http://localhost:8080/api/classrooms/assignments/assignments", {
    //                 params: {
    //                     startDate: startDate.toISOString(),
    //                     endDate: endDate.toISOString(),
    //                     classroom: classFilter === "All classes" ? null : classFilter,
    //                 },
    //                 withCredentials: true,
    //             });
    //             setAssignments(response.data);
    //         } catch (error) {
    //             console.error("Error fetching assignments", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchAssignments();
    // }, [classFilter]);

    useEffect(() => {
        const fetchAssignments = async () => {
            setIsLoading(true);
            const startDate = new Date();
            const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

            try {
                const response = await axios.get("http://localhost:8080/api/classrooms/assignments/user-assignments", {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        classroom: classFilter === "All classes" ? null : classFilter, // Ensure valid classroom ID or null
                        useremail: useremail, // Include useremail in the request
                    },
                    withCredentials: true,
                });
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching assignments", error);
                toast.error("Failed to fetch assignments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, [classFilter, useremail]);

    // Generate different colors for different assignments
    const getAssignmentColor = (title: string) => {
        const colors = [
            { bg: "#4285F4", border: "#2B5797" },  // Blue
            { bg: "#EA4335", border: "#B23121" },  // Red
            { bg: "#FBBC05", border: "#D99E00" },  // Yellow
            { bg: "#34A853", border: "#1E7E34" },  // Green
            { bg: "#9C27B0", border: "#6A1B9A" },  // Purple
            { bg: "#FF6D00", border: "#E65100" },  // Orange
        ];

        // Simple hash function to determine color
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const events = assignments.map((assignment) => {
        const color = getAssignmentColor(assignment.title);
        return {
            title: assignment.title,
            start: assignment.dueDate,
            end: assignment.dueDate,
            backgroundColor: color.bg,
            borderColor: color.border,
            textColor: "white",
            extendedProps: {
                description: assignment.description || "No description provided",
                classId: assignment.classId,
            },
            className: "rounded-lg shadow-md p-2 font-medium text-sm"
        };
    });

    const handlePrevClick = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.prev();
        const newDate = calendarApi?.getDate();
        if (newDate) {
            setCurrentDate(newDate);
        }
    };

    const handleNextClick = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.next();
        const newDate = calendarApi?.getDate();
        if (newDate) {
            setCurrentDate(newDate);
        }
    };

    const formatDateRange = (date: any) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
        const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });

        const startDay = startOfWeek.getDate();
        const endDay = endOfWeek.getDate();

        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endOfWeek.getFullYear()}`;
    };

    const handleClassFilterChange = (event: any) => {
        setClassFilter(event.target.value);
    };

    const handleEventClick = (clickInfo: any) => {
        const { title, extendedProps } = clickInfo.event;
        alert(`Assignment: ${title}\n${extendedProps.description}`);
    };

    const customDayCell = (arg: any) => {
        const { date, dayNumberText } = arg;
        const isToday = date.toDateString() === new Date().toDateString();

        return {
            html: `
                <div class="flex flex-col items-center pt-1">
                    <div class="${isToday
                    ? 'bg-blue-500 text-white rounded-full shadow-md'
                    : 'text-gray-700'} w-10 h-10 flex items-center justify-center text-xl font-medium">
                        ${dayNumberText}
                    </div>
                </div>
            `
        };
    };

    return (
        <div className="w-full font-sans bg-white rounded-lg shadow-lg p-5 mx-auto max-w-7xl mt-10 max-w-7xl mx-auto mt-10">
            <style>
                {`
                    .fc .fc-col-header-cell-cushion {
                        padding: 10px 0;
                        font-weight: 600;
                        color: #4a5568;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 0.875rem;
                    }
                    
                    .fc .fc-daygrid-day-number {
                        padding: 8px;
                        color: #2d3748;
                        font-size: 1.25rem;
                        font-weight: 500;
                    }
                    
                    .fc-theme-standard td, .fc-theme-standard th {
                        border: none !important;
                    }
                    
                    .fc-theme-standard .fc-scrollgrid {
                        border: none !important;
                    }
                    
                    .fc-daygrid-day-frame {
                        min-height: 150px;
                        transition: background-color 0.2s;
                    }
                    
                    .fc-daygrid-day-frame:hover {
                        background-color: #f7fafc;
                    }
                    
                    .fc-event {
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                        border-radius: 4px;
                    }
                    
                    .fc-event:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    
                    .fc-event-title {
                        white-space: normal !important;
                        overflow: visible !important;
                        padding: 2px 4px;
                    }
                `}
            </style>

            <div className="flex flex-col md:flex-row justify-between items-center py-4 mb-6 gap-4 ">
                <div className="relative w-full md:w-48">
                    <select
                        value={classFilter}
                        onChange={handleClassFilterChange}
                        className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                    >
                        <option value="All classes">All classes</option>
                        {classrooms.map((userClassroom) => (
                            <option key={userClassroom.classroom.id} value={userClassroom.classroom.id}>
                                {userClassroom.classroom.className}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2 shadow-sm">
                    <button
                        onClick={handlePrevClick}
                        className="text-xl px-4 py-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        aria-label="Previous week"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="text-base font-medium text-gray-800 mx-4">
                        {formatDateRange(currentDate)}
                    </div>
                    <button
                        onClick={handleNextClick}
                        className="text-xl px-4 py-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        aria-label="Next week"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="calendar-body bg-white rounded-lg overflow-hidden">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridWeek"
                        initialDate="2025-03-14"
                        headerToolbar={false}
                        events={events}
                        dayMaxEvents={3}
                        height="auto"
                        dayCellContent={customDayCell}
                        dayHeaderFormat={{ weekday: 'short' }}
                        firstDay={0}
                        eventClick={handleEventClick}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                        eventContent={(arg) => {
                            return (
                                <div className="p-1 truncate">
                                    <div className="font-medium">{arg.event.title}</div>
                                </div>
                            );
                        }}
                    />
                </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
                {assignments.length === 0 && !isLoading ? (
                    <p>No assignments due this week</p>
                ) : (
                    <p>Showing {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</p>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;