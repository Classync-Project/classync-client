import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateClassForm = ({ onClose, useremail }: { onClose: () => void, useremail: string | null }) => {
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const classroomName = (e.target as any).createClassroomName.value;
  
      try {
        const response = await axios.post(
          "http://localhost:8080/api/classrooms/create",
          {
            className: classroomName,
            useremail,
          },
          {
            withCredentials: true,
          }
        );
  
        if (response.status === 200) {
          const data = response.data;
          toast.success(`Classroom "${data.className}" created successfully!`);
          navigate(`/classrooms/${data.classroomId}`);
        } else {
          throw new Error("Failed to create classroom.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while creating the classroom.");
      }
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-300">Classroom Name</span>
          <input
            type="text"
            name="createClassroomName"
            placeholder="Enter classroom name"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1 text-white focus:outline-none focus:border-purple-500"
            required
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Create
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  export default CreateClassForm;