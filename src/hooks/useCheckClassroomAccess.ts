import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../types/RootState";
import { toast } from "sonner";
import axios from "axios"; // Import axios

const useCheckClassroomAccess = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!classroomId || !user?.id) {
        toast.error("Invalid classroom or user.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}/check-access`,
          {
            params: { userId: user.id }, 
            withCredentials: true, 
          }
        );

        if (!response.data.isMember) {
          toast.error("You are not part of this classroom. Please join first.");
          navigate("/");
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        toast.error("Failed to check classroom access.");
        navigate("/");
      }
    };

    checkAccess();
  }, [classroomId, user, navigate]);

  return hasAccess;
};

export default useCheckClassroomAccess;
