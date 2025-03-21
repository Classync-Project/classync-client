import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageCircle, Send, Trash, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { formatDate, getInitials } from "../../utils/formatters";
import useComments from "../../hooks/useComments";

interface CommentSectionProps {
    announcementId: string;
    user: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    announcementId,
    user,
}) => {
    const {
        comments,
        commentInput,
        isExpanded,
        handleInputChange,
        handleAddComment,
        handleDeleteComment,
        toggleComments
    } = useComments(announcementId, user);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={toggleComments}
                >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {comments.length || 0} Comments
                </Button>
            </div>

            {isExpanded && comments.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-3 max-h-60 overflow-y-auto">
                    {comments.map((comment, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2 group"
                        >
                            <Avatar className="w-8 h-8">
                                <AvatarImage
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        comment.author?.email || "User"
                                    )}&background=random`}
                                />
                                <AvatarFallback>
                                    {getInitials(comment.author?.email || "User")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-white rounded-lg p-3 flex-1 shadow-sm relative">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium">
                                        {comment.author?.email || "User"}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm pr-6">{comment.content}</p>

                                {comment.author?.email === user?.email && (
                                    <div className="absolute top-3 right-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36">
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500 cursor-pointer flex items-center gap-2"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                    <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.email || "User"
                        )}&background=random`}
                    />
                    <AvatarFallback>{getInitials(user?.email || "User")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Input
                        placeholder="Add a comment..."
                        className="pl-3 pr-10 py-2 h-10"
                        value={commentInput}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 h-6 w-6"
                        onClick={handleAddComment}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;