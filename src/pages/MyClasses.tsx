import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Classroom } from "../types/Classroom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserClassroom {
  classroom: Classroom;
  role: string;
}

const MyClasses: React.FC = () => {
  const [userClassrooms, setUserClassrooms] = useState<UserClassroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const useremail = localStorage.getItem("useremail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!useremail) {
      toast.error("User email is not available. Please log in again.");
      return;
    }

    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/classrooms/myclassrooms",
          {
            params: { useremail },
            withCredentials: true,
          }
        );
        console.log(data);
        setUserClassrooms(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching classrooms");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [useremail]);

  // Copy classroom code to clipboard
  const copyToClipboard = (e: React.MouseEvent, code: string) => {
    e.stopPropagation(); // Prevent card click event from triggering
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        toast.success("Classroom code copied to clipboard!");
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy code");
      });
  };

  // Handle card click to navigate to classroom
  const handleCardClick = (classroomId: string, role: string) => {
    navigate(`/classrooms/${classroomId}`, {
      state: { role },
    });
  };

  // Get emoji based on class name or role
  const getClassEmoji = (className: any, role: any) => {
    const classNameLower = className.toLowerCase();
    const roleLower = role.toLowerCase();

    // Subject-based emojis
    if (classNameLower.includes("math")) return "🧮";
    if (classNameLower.includes("science")) return "🔬";
    if (classNameLower.includes("history")) return "📜";
    if (
      classNameLower.includes("english") ||
      classNameLower.includes("literature")
    )
      return "📚";
    if (classNameLower.includes("art")) return "🎨";
    if (classNameLower.includes("music")) return "🎵";
    if (
      classNameLower.includes("computer") ||
      classNameLower.includes("coding")
    )
      return "💻";
    if (classNameLower.includes("physics")) return "⚛️";
    if (classNameLower.includes("chemistry")) return "⚗️";
    if (classNameLower.includes("biology")) return "🧬";

    // Role-based default emojis
    if (roleLower.includes("teacher") || roleLower.includes("creator"))
      return "👨‍🏫";
    if (roleLower.includes("student")) return "👨‍🎓";

    // Default random emojis for other classes
    const defaultEmojis = [
      "📝",
      "📊",
      "🎯",
      "🧠",
      "💡",
      "🔍",
      "📓",
      "🎓",
      "✏️",
      "📖",
    ];
    return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
  };

  // Get role-specific emoji
  const getRoleEmoji = (role: any) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("teacher") || roleLower.includes("creator"))
      return "👨‍🏫";
    if (roleLower.includes("student")) return "👨‍🎓";
    if (roleLower.includes("admin")) return "🔑";
    return "👤";
  };

  // Get card gradient colors based on class name or emoji
  const getCardGradient = (className: any, emoji: any) => {
    if (emoji === "🧮") return "from-blue-600 to-indigo-800";
    if (emoji === "🔬") return "from-green-600 to-teal-800";
    if (emoji === "📜") return "from-amber-600 to-yellow-700";
    if (emoji === "📚") return "from-red-600 to-rose-800"; // English/Literature
    if (emoji === "🎨") return "from-fuchsia-600 to-purple-800"; // Art
    if (emoji === "🎵") return "from-pink-600 to-rose-800"; // Music
    if (emoji === "💻") return "from-cyan-600 to-blue-800"; // Computer/Coding
    if (emoji === "⚛️") return "from-blue-500 to-indigo-700"; // Physics
    if (emoji === "⚗️") return "from-emerald-600 to-green-800"; // Chemistry
    if (emoji === "🧬") return "from-teal-600 to-cyan-800"; // Biology

    // Default gradients for other subjects
    const gradients = [
      "from-purple-600 to-indigo-800",
      "from-blue-600 to-cyan-800",
      "from-emerald-600 to-teal-800",
      "from-pink-600 to-rose-800",
      "from-amber-600 to-orange-800",
      "from-violet-600 to-purple-800",
    ];

    // Hash the class name to get a consistent gradient for the same class
    let hash = 0;
    for (let i = 0; i < className.length; i++) {
      hash = className.charCodeAt(i) + ((hash << 5) - hash);
    }

    return gradients[Math.abs(hash) % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-l-4 border-purple-500 animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-4xl">
            📚
          </div>
        </div>
        <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Loading your learning journey...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-10 px-4 sm:px-6 text-white">
      <div className="container mx-auto max-w-7xl">
        {/* <div className="relative mb-16 text-center">
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text pb-2">
            ✨ My Learning Journey ✨
          </h1>
          <div className="h-1 w-40 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div> */}

        {userClassrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 max-w-2xl mx-auto">
            <div className="text-6xl mb-6 animate-bounce">📭</div>
            <p className="text-center text-2xl text-gray-300 font-semibold mb-8">
              You are not enrolled in any classes yet.
            </p>
            <button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-500/20"
              onClick={() => navigate("/join-class")}
            >
              Discover Classes 🔍
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userClassrooms.map(({ classroom, role }) => {
              const emoji = getClassEmoji(classroom.className, role);
              const gradient = getCardGradient(classroom.className, emoji);
              const isCopied = copiedCode === classroom.classroomCode;

              return (
                <Card
                  id={classroom.id}
                  key={classroom.classroomCode}
                  className={`bg-gradient-to-br ${gradient} shadow-xl border-none rounded-3xl overflow-hidden  transition-all duration-300 group relative cursor-pointer`}
                  onClick={() => handleCardClick(classroom.id, role)}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-0"></div>
                  <div className="absolute top-0 right-0 p-4 z-20">
                    <button
                      onClick={(e) =>
                        copyToClipboard(e, classroom.classroomCode)
                      }
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/30 transition-all duration-300"
                      title="Click to copy classroom code"
                    >
                      <span>{classroom.classroomCode}</span>
                      <span className="text-xs">
                        {isCopied ? "✓ Copied!" : "📋"}
                      </span>
                    </button>
                  </div>

                  <div className="absolute -bottom-10 -right-10 text-8xl opacity-20 transition-transform duration-500 z-0">
                    {emoji}
                  </div>

                  <CardHeader className="relative z-10 pb-2">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-5xl bg-white/10 rounded-full p-3 backdrop-blur-sm"
                        role="img"
                        aria-label="Class emoji"
                      >
                        {emoji}
                      </span>
                      <CardTitle className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
                        {classroom.className}
                      </CardTitle>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <div className="flex items-center bg-black/30 self-start px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <span
                          className="mr-2"
                          role="img"
                          aria-label="Role emoji"
                        >
                          {getRoleEmoji(role)}
                        </span>
                        <span className="text-sm font-medium">{role}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 mt-4 pb-6">
                    <div className="text-center text-white text-sm font-medium opacity-80">
                      Click to enter classroom
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClasses;
