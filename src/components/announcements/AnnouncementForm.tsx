import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { toast } from "react-toastify";
import { createAnnouncement } from "../../service/announcementService";

interface AnnouncementFormProps {
  classroomId: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  classroomId,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = localStorage.getItem("useremail");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAnnouncement({
        title,
        content,
        classId: classroomId || "",
        userEmail: userEmail || "",
        file
      });
      
      toast.success("Announcement added successfully!");
      setTitle("");
      setContent("");
      setFile(null);
      onSuccess();
    } catch (error) {
      toast.error("Failed to add announcement.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Announcement</DialogTitle>
        <DialogDescription>
          Post an announcement to the class. All students will receive a
          notification.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Content
          </label>
          <Textarea
            placeholder="Enter announcement content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Attach File
          </label>
          <Input
            type="file"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Announcement"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AnnouncementForm;