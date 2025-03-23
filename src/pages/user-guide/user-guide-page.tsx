import { useState } from "react";
import { Bookmark, Layers, BookOpen, HelpCircle, Calendar, Bot } from "lucide-react";
import GuideSection from "../..//components/user-guide/GuideSection";
import StepGuide from "../..//components/user-guide/StepGuide";

const QuickTip = ({ title, children }: any) => {
  return (
    <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4 mb-4">
      <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
        <Bookmark className="w-4 h-4" />
        {title}
      </h4>
      <div className="text-gray-300 text-sm font-light">
        {children}
      </div>
    </div>
  );
};

// Main UserGuide component
const UserGuide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSectionToggle = (sectionId: string) => {
    setOpenSection(prevSection => (prevSection === sectionId ? null : sectionId));
  };


  const classroomManagementSteps = [
    {
      title: "Creating a New Classroom",
      description: "Start by creating a virtual classroom where you can organize your students, assignments, and resources all in one place.",
      image: "/user-guide/1/create_classroom.png",
      imageCaption: "Figure 1: Creating a new classroom via the dashboard",
      tip: "Use descriptive names for your classrooms to easily identify them later."
    },
    {
      title: "Inviting Students",
      description: "Once your classroom is set up, you can invite students using their email addresses or by sharing a unique classroom code.",
      image: "/user-guide/1/invite_students.png",
      // imageCaption: "Figure 2: Student invitation interface"
    },
  ];






  // Helper function to render section content
  const renderSectionContent = (title: any) => {
    switch (title) {
      case "Classroom Management":
        return (
          <>
            <p className="text-gray-300 mb-6">
              The Classroom Management module helps you organize virtual learning spaces, manage student rosters, and track participation effortlessly.
            </p>
            <StepGuide steps={classroomManagementSteps} />
            {/* <QuickTip title="Quick Access">
              You can access your most recent classrooms directly from the dashboard by starring them as favorites.
            </QuickTip> */}
          </>
        );

      case "Assignment Creation & Automatic Evaluation":
        return (
          <>
            <p className="text-gray-300 mb-6">
              Our automated grading system evaluates assignments instantly, providing meaningful feedback to students while saving you valuable time.
            </p>
            <div className="space-y-6 mt-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h4 className="text-white font-medium mb-3">Automated Grading Features</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
                  <li>Upload PDF files for grading</li>
                  <li>Teachers can add solutions for assignments</li>
                  <li>Students can click "Get Your Score" to receive instant feedback</li>
                </ul>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src="/user-guide/2/new_assignment.png"
                  alt="Teacher uploading solution"
                  className="w-full"
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 1: Creating a new assignment with solution upload
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src="/user-guide/2/evaluation.gif"
                  alt="Student receiving grades"
                  className="w-3/4 mx-auto"
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 2: Student receiving automated evaluation results
                </div>
              </div>
            </div>
          </>
        );

      case "Doubt Management":
        return (
          <>
            <p className="text-gray-300 mb-6">
              Provide an interactive platform for students to raise questions and receive timely responses from you or their peers.
            </p>
            <div className="space-y-6 mt-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h4 className="text-white font-medium mb-3">Doubt Management Features</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
                  <li>Submit questions with context references</li>
                  <li>Receive responses from teachers and peers</li>
                  <li>View answer history and related questions</li>
                </ul>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src="/user-guide/3/doubts.png"
                  alt="Doubt management interface"
                  className="w-full"
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 1: The Doubt Management Dashboard
                </div>
              </div>
            </div>
          </>
        );

      case "Calendar Functionality":
        return (
          <>
            {/* <p className="text-gray-300 mb-6">
              Integrated scheduling system to track classes, assignments, and important deadlines in one centralized calendar view.
            </p>
            <div className="space-y-6 mt-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h4 className="text-white font-medium mb-3">Calendar Features</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
                  <li>Multiple view options (month, week, day, agenda)</li>
                  <li>Color coding by class or assignment type</li>
                  <li>Automated reminders for upcoming deadlines</li>
                  <li>Synchronization with external calendars (Google, Outlook)</li>
                  <li>Recurring event scheduling for regular classes</li>
                </ul>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img 
                  src="/api/placeholder/800/400" 
                  alt="Calendar interface" 
                  className="w-full" 
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 1: Calendar Monthly View
                </div>
              </div>
            </div>
            <QuickTip title="Event Templates">
              Save time by creating event templates for regularly scheduled activities like quizzes or study sessions.
            </QuickTip> */}
          </>
        );

      case "Saarthi - AI Classroom Assistant":
        return (
          <>
            <p className="text-gray-300 mb-6">
              <strong>Saarthi</strong>, your AI-powered classroom assistant, keeps students updated with announcements and course materials while assisting with queries efficiently.
            </p>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h4 className="text-white font-medium mb-3">Saarthi's Capabilities</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
                    <li>Responds to classroom announcements dynamically</li>
                    <li>Answers queries based on uploaded course materials</li>
                    <li>Provides quick summaries of recent updates</li>
                    <li>Offers supplementary learning resources</li>
                  </ul>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h4 className="text-white font-medium mb-3">Integration with Announcements</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
                    <li>Fetches and summarizes recent announcements</li>
                    <li>Notifies students about important deadlines</li>
                    <li>Provides context-aware responses based on teacher uploads</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src="/user-guide/4/announcement.gif"
                  alt="Teacher making an announcement"
                  className="w-full"
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 1: Teacher Making an Announcement
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <img
                  src="/user-guide/4/saarthi.gif"
                  alt="Saarthi responding to announcements"
                  className="w-full"
                />
                <div className="p-2 bg-gray-800 text-gray-400 text-sm text-center">
                  Figure 2: Saarthi Fetching Latest Announcements
                </div>
              </div>
            </div>

            <QuickTip title="Enhancing Saarthi's Responses">
              Upload lecture notes and announcements regularly so Saarthi can provide relevant updates and support to students.
            </QuickTip>
          </>
        );

      default:
        return null;
    }
  };

  // Features for the guide with IDs for accessibility
  const guideFeatures = [
    {
      id: "classroom-management",
      title: "Classroom Management",
      icon: <Layers className="w-6 h-6 text-purple-500" />
    },
    {
      id: "saarthi-assistant",
      title: "Saarthi - AI Classroom Assistant",
      icon: <Bot className="w-6 h-6 text-indigo-500" />
    },
    {
      id: "assignment-creation",
      title: "Assignment Creation & Automatic Evaluation",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />
    },
    {
      id: "doubt-management",
      title: "Doubt Management",
      icon: <HelpCircle className="w-6 h-6 text-orange-500" />
    },
    {
      id: "calendar-functionality",
      title: "Calendar Functionality",
      icon: <Calendar className="w-6 h-6 text-pink-500" />
    },

  ];

  // Filter features based on search query
  const filteredFeatures = searchQuery
    ? guideFeatures.filter(feature =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : guideFeatures;

  return (
    <div className="w-full bg-gradient-to-b from-gray-950 to-gray-900 min-h-screen text-white font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center relative">
          <div className="relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 text-transparent bg-clip-text mb-4 brand-font tracking-tight">
              Classync User Guide
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-6 font-light">
              Learn how to use all the powerful features Classync has to offer
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search for features, topics, or questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar (only on large screens) */}
          <div className="hidden lg:block col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 brand-font text-white">Contents</h2>
              <ul className="space-y-2">
                {guideFeatures.map((feature) => (
                  <li key={feature.id}>
                    <a
                      href={`#${feature.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(feature.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          handleSectionToggle(feature.id);
                        }
                      }}
                      className={`flex items-center gap-2 py-2 px-3 rounded transition-colors ${openSection === feature.id
                        ? "bg-gray-700/70 text-white"
                        : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                        }`}
                    >
                      {feature.icon}
                      <span>{feature.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((feature) => (
                <div key={feature.id} id={feature.id} className="scroll-mt-8">
                  <GuideSection
                    title={feature.title}
                    icon={feature.icon}
                    isOpen={openSection === feature.id}
                    onToggle={() => handleSectionToggle(feature.id)}
                  >
                    {renderSectionContent(feature.title)}
                  </GuideSection>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="text-gray-400 mb-4 text-lg">No results found for "{searchQuery}"</div>
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;