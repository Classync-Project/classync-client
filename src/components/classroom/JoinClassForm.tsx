import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JoinClassForm = ({
  onClose,
  useremail,
}: {
  onClose: () => void;
  useremail: string | null;
}) => {
  const navigate = useNavigate();

  let className = "Demo";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const classCode = (e.target as any).joinClassCode.value;
    console.log(classCode);

    try {
      // First, get the class name based on the class code
      const res = await axios.get(
        `http://localhost:8080/api/classrooms/classname/${classCode}`,
        {
          withCredentials: true,
        }
      );
      console.log("Class details:", res.data);

      // Store the class name for welcome email
      className = res.data.className;

      //   setClassName(res.data.className);

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
        sendWelcomeEmails();

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

  const sendWelcomeEmails = async () => {
    try {
      const subject = `Welcome to ${className}!`;
      const message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4a64e1;">Welcome to ${className}!</h2>
            <p>Hello,</p>
            <p>We're excited to welcome you to <strong>${className}</strong>. This virtual classroom has been set up to provide you with an interactive and engaging learning experience.</p>
            
            <h3 style="color: #4a64e1; margin-top: 20px;">Getting Started:</h3>
            <ul>
              <li>Check the Assignments tab for upcoming tasks and deadlines</li>
              <li>Participate in discussions and stay updated through Announcements</li>
              <li>Connect with your classmates through the Participants section</li>
            </ul>
            
            <p>We look forward to seeing your active participation and collaboration in this class.</p>
            
            <p style="margin-top: 30px;">Best regards,<br>The ${className} Team</p>
          </div>
        `;

      await axios.post(
        "http://localhost:8080/api/mail/send",
        {
          to: useremail,
          subject: subject,
          message: message,
        },
        { withCredentials: true }
      );
    } catch (err) {
      //   toast.error("Failed to send welcome emails. Please try again later.");
      console.error("Error sending welcome emails:", err);
    }
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
