import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Assignment } from "../../types/Assignment";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface UpcomingAssignmentsProps {
  assignments?: Assignment[]; 
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({
  assignments = [], 
}) => {

  const navigate = useNavigate();
  const { classroomId } = useParams<{ classroomId: string }>();
  // console.log(assignments);
  const upcomingAssignments = assignments.length == 0 ? [] : assignments
    .filter((assignment) => assignment.dueDate && new Date(assignment.dueDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="bg-white shadow-sm sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Upcoming Assignments</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {upcomingAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Badge
              variant="outline"
              className="mb-2 bg-green-50 text-green-600 border-green-200"
            >
              All caught up!
            </Badge>
            <p className="text-sm text-gray-500">No upcoming assignments</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96 pr-4">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-3 rounded-lg bg-gray-50 mb-3 last:mb-0 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/classrooms/${classroomId}/assignments/${assignment.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {assignment.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <p>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;
