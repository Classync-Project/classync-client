import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Plus,
  ChevronRight,
  Calendar,
  FileText,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import CreateAssignment from "../pages/CreateAssignment";
import { Assignment } from "../types/Assignment";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { ScrollArea } from "../components/ui/scroll-area";

interface AssignmentsTabProps {
  assignments: Assignment[];
  classroomId: string | undefined;
  role: string | undefined;
  onAssignmentCreated: () => void;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  classroomId,
  role,
  onAssignmentCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">("all");
  const [bookmarkedAssignments, setBookmarkedAssignments] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleCreateAssignmentClose = () => {
    setShowModal(false);
    onAssignmentCreated();
  };

  const toggleBookmark = (assignmentId: number) => {
    setBookmarkedAssignments(prev =>
      prev.includes(assignmentId)
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const filteredAssignments = assignments?.length > 0 &&
    assignments
    .slice()
    .reverse()  
    .filter(assignment => {
      // Apply search filter
      if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Apply status filter
      if (filterStatus === "upcoming") {
        return new Date(assignment.dueDate) > new Date();
      } else if (filterStatus === "past") {
        return new Date(assignment.dueDate) < new Date();
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const getDueDateLabel = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Overdue", color: "bg-red-100 text-red-800" };
    } else if (diffDays === 0) {
      return { text: "Due Today", color: "bg-amber-100 text-amber-800" };
    } else if (diffDays <= 3) {
      return { text: "Due Soon", color: "bg-orange-100 text-orange-800" };
    } else {
      return { text: "Upcoming", color: "bg-green-100 text-green-800" };
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      }
    }),
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" pl-10 bg-gray-50 border-gray-200 focus:ring-blue-500 "
            />
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="border-gray-200"
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{sortOrder === "asc" ? "Oldest first" : "Newest first"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Assignments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("upcoming")}>
                  Upcoming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("past")}>
                  Past Due
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {role !== "STUDENT" && (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Assignment</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {Array.isArray(filteredAssignments) && filteredAssignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Assignments Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchQuery
                ? "Try changing your search or filter criteria"
                : "No assignments available for this class yet"}
            </p>
            {role !== "STUDENT" && (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Assignment
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(filteredAssignments) && filteredAssignments.map((assignment, index) => {
              const dueStatus = getDueDateLabel(assignment.dueDate);
              const isBookmarked = bookmarkedAssignments.includes(Number(assignment.id));

              return (
                <motion.div
                  key={assignment.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layoutId={`assignment-${assignment.id}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border-t-4 border-t-blue-500 flex flex-col">
                    <CardHeader className="relative pb-2">
                      <div className="absolute right-4 top-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(Number(assignment.id));
                                }}
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Bookmark className="h-5 w-5 text-gray-400" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Badge className={`mb-2 ${dueStatus.color}`}>
                        {dueStatus.text}
                      </Badge>
                      <CardTitle className="text-xl font-semibold text-gray-800 pr-8">
                        {assignment.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="line-clamp-3 mb-4 text-gray-600">
                        {assignment.content}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 border-t flex justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() =>
                          navigate(`/classrooms/${classroomId}/assignments/${assignment.id}`)
                        }
                      >
                        View <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for your class. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] overflow-auto">
            <div className="px-1">
              <CreateAssignment onClose={handleCreateAssignmentClose} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignmentsTab;