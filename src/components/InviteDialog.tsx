import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface InviteDialogProps {
  showInviteDialog: boolean;
  setShowInviteDialog: (show: boolean) => void;
  classRoomId: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({
  showInviteDialog,
  setShowInviteDialog,
  classRoomId,
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("STUDENT");
  const [isInviting, setIsInviting] = useState(false);

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      await axios.post(
        `http://localhost:8080/api/classrooms/${classRoomId}/invite`,
        { email: inviteEmail, role: inviteRole },
        { withCredentials: true }
      );
      toast.success(`Invitation sent to ${inviteEmail}`, {
        position: "bottom-right",
        icon: <UserCheck className="text-green-500" />,
      });
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-md transition-all duration-200">
          <UserPlus className="w-4 h-4" />
          <span>Invite Participant</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Classroom</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new participant to this classroom.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="STUDENT">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>Student</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TEACHER">
                    <div className="flex items-center">
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Teacher</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => setShowInviteDialog(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleInviteUser}
            disabled={isInviting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;