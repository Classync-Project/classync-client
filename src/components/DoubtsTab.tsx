import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { HelpCircle, MessageSquare, Filter, Clock, ChevronDown, ChevronUp, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface DoubtsTabProps {
  doubts: any[];
  classroomId: string | undefined;
  role: string | undefined;
  user: any;
  onDoubtCreated: () => void;
}

const DoubtsTab: React.FC<DoubtsTabProps> = ({
  doubts,
  classroomId,
  role,
  user,
  onDoubtCreated,
}) => {
  const [title, setTitle] = useState("");
  const [newDoubt, setNewDoubt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredDoubts, setFilteredDoubts] = useState(doubts);
  const [solutionsMap, setSolutionsMap] = useState<{ [key: string]: any[] }>({});
  const [loadingSolutions, setLoadingSolutions] = useState<{ [key: string]: boolean }>({});
  const [expandedDoubts, setExpandedDoubts] = useState<{ [key: string]: boolean }>({});
  const [deletingSolution, setDeletingSolution] = useState<{ doubtId: string, solutionId: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    let filtered = [...doubts];
    const now = new Date();

    if (timeFilter === "today") {
      filtered = doubts.filter(doubt => {
        const doubtDate = new Date(doubt.createdAt);
        return doubtDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
      });
    } else if (timeFilter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = doubts.filter(doubt => new Date(doubt.createdAt) > oneWeekAgo);
    } else if (timeFilter === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = doubts.filter(doubt => new Date(doubt.createdAt) > oneMonthAgo);
    }

    setFilteredDoubts(filtered);
  }, [timeFilter, doubts]);

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !newDoubt.trim()) return;

    setIsSubmitting(true);
    console.log("Posting doubt...", classroomId, title, newDoubt, user.id);

    try {
      await axios.post(
        "http://localhost:8080/api/doubts/create",
        {
          classroomId,
          title,
          content: newDoubt,
          userId: user.id,
        },
        { withCredentials: true }
      );
      setTitle("");
      setNewDoubt("");
      toast.success("Your doubt has been posted");
      onDoubtCreated();
    } catch (error) {
      console.error("Error submitting doubt:", error);
      toast.error("Failed to post your doubt");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSolution = async (doubtId: string) => {
    if (!replyContent[doubtId]?.trim()) return;

    try {
      await axios.post(
        `http://localhost:8080/api/doubts/${doubtId}/solution/add`,
        {
          doubtId,
          content: replyContent[doubtId],
          userId: user.id,
        },
        { withCredentials: true }
      );

      setReplyContent(prev => ({ ...prev, [doubtId]: "" }));
      setReplyingTo(null);
      toast.success("Your solution has been posted");

      viewSolutions(doubtId);
      onDoubtCreated();
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("Failed to post your solution");
    }
  };

  const openDeleteDialog = (doubtId: string, solutionId: string) => {
    setDeletingSolution({ doubtId, solutionId });
  };

  const cancelDelete = () => {
    setDeletingSolution(null);
  };

  const confirmDelete = async () => {
    if (!deletingSolution) return;

    const { doubtId, solutionId } = deletingSolution;
    setIsDeleting(true);

    try {
      await axios.delete(
        `http://localhost:8080/api/doubts/solutions/${solutionId}`,
        {
          withCredentials: true,
          params: { userEmail: user?.email },
        }
      );

      setSolutionsMap(prev => ({
        ...prev,
        [doubtId]: prev[doubtId].filter(sol => sol.id !== solutionId)
      }));

      await viewSolutions(doubtId, true);

      toast.success("Solution deleted successfully");
    } catch (error) {
      toast.error("Failed to delete solution");
      console.error("Error deleting solution:", error);
    } finally {
      setDeletingSolution(null);
      setIsDeleting(false);
    }
  };

  const viewSolutions = async (doubtId: string, forceRefresh = false) => {
    setExpandedDoubts(prev => ({
      ...prev,
      [doubtId]: !prev[doubtId]
    }));

    if (expandedDoubts[doubtId] && !forceRefresh) {
      return;
    }

    if (solutionsMap[doubtId] && !forceRefresh) {
      return;
    }

    setLoadingSolutions(prev => ({ ...prev, [doubtId]: true }));

    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/doubts/${doubtId}/solutions`,
        { withCredentials: true }
      );

      setSolutionsMap(prev => ({
        ...prev,
        [doubtId]: data
      }));

    } catch (error) {
      console.error("Error fetching solutions:", error);
      toast.error("Error fetching solutions");
    } finally {
      setLoadingSolutions(prev => ({ ...prev, [doubtId]: false }));
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSolution} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Solution</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this solution? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Post new doubt form */}
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitDoubt}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doubt Title
              </label>
              <input
                type="text"
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter a title for your doubt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ask a question
              </label>
              <textarea
                rows={3}
                className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="What's your doubt or question?"
                value={newDoubt}
                onChange={(e) => setNewDoubt(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Time filter controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Questions</h3>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Select
            value={timeFilter}
            onValueChange={setTimeFilter}
          >
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List of doubts */}
      {filteredDoubts.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-white rounded-lg shadow-sm border border-gray-100">
          <HelpCircle className="w-12 h-12 text-emerald-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No questions yet</h3>
          <p className="text-gray-600 max-w-md">
            {timeFilter !== "all"
              ? `No questions found for the selected time period. Try a different filter.`
              : `Be the first to ask a question about this class!`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doubt.createdBy?.email || 'User')}&background=random`} />
                    <AvatarFallback>{getInitials(doubt.createdBy?.email || 'User')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{doubt.createdBy?.email || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(doubt.createdAt)}
                        </p>
                      </div>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-900">{doubt.title}</h4>
                    <p className="text-gray-800">{doubt.content}</p>

                    {/* Solutions and replies section */}
                    {expandedDoubts[doubt.id] && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        {loadingSolutions[doubt.id] ? (
                          <div className="py-4 text-center text-gray-500">Loading solutions...</div>
                        ) : solutionsMap[doubt.id]?.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <h5 className="text-sm font-semibold text-gray-700">Solutions</h5>
                              <Badge className="ml-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">
                                {solutionsMap[doubt.id].length}
                              </Badge>
                            </div>

                            <div className="divide-y divide-gray-200">
                              {solutionsMap[doubt.id].map((solution) => (
                                <div key={solution.id} className="py-3 first:pt-0 last:pb-0">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(solution.createdBy?.email || 'User')}&background=random`} />
                                      <AvatarFallback>{getInitials(solution.createdBy?.email || 'User')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start mb-1">
                                        <p className="font-medium text-sm">{solution.createdBy?.email || "Unknown"}</p>
                                        <div className="flex items-center">
                                          <p className="text-xs text-gray-500 mr-2">
                                            {formatDate(solution.createdAt)}
                                          </p>
                                          {solution.createdBy?.email === user?.email && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                              onClick={() => openDeleteDialog(doubt.id, solution.id)}
                                            >
                                              <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-gray-800 text-sm">{solution.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="py-2 text-center text-gray-600">
                            No solutions yet. Be the first to respond!
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reply form */}
                    <div className="mt-4">
                      {replyingTo === doubt.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                            placeholder="Write your response here..."
                            value={replyContent[doubt.id] || ""}
                            onChange={(e) => setReplyContent(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                          ></textarea>
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent(prev => ({ ...prev, [doubt.id]: "" }));
                              }}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              onClick={() => handleSubmitSolution(doubt.id)}
                            >
                              Post as Solution
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs flex items-center gap-1"
                            onClick={() => setReplyingTo(doubt.id)}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Respond
                          </Button>
                          <Button
                            type="button"
                            variant={expandedDoubts[doubt.id] ? "default" : "outline"}
                            size="sm"
                            className={`text-xs flex items-center gap-1 ${expandedDoubts[doubt.id] ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""
                              }`}
                            onClick={() => viewSolutions(doubt.id)}
                          >
                            {expandedDoubts[doubt.id] ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Hide Solutions
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                View Solutions
                                {solutionsMap[doubt.id]?.length > 0 && (
                                  <Badge className="ml-1 text-[10px] py-0 h-4 min-w-4 flex items-center justify-center">
                                    {solutionsMap[doubt.id].length}
                                  </Badge>
                                )}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoubtsTab;