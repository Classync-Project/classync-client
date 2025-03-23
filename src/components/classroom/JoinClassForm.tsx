import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JoinClassForm = ({ onClose, useremail }: { onClose: () => void, useremail: string | null }) => {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const classCode = (e.target as any).joinClassCode.value;

        try {
            const response = await axios.post(
                "http://localhost:8080/api/classrooms/join",
                {
                    classCode,
                    useremail,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                const data = response.data;
                toast.success(`Successfully joined classroom: "${data.className}"`);
                navigate(`/classrooms/${data.id}`);
            }
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.error ||
                    "An error occurred while joining the classroom.";
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred while joining the classroom.");
            }
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <label className="block mb-4">
                <span className="text-gray-300">Class Code</span>
                <input
                    type="text"
                    name="joinClassCode"
                    placeholder="Enter class code"
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                    required
                />
            </label>
            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                    Submit
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
export default JoinClassForm;