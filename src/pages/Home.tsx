import React from "react";
import { ChevronRight, Calendar, BookOpen, CheckSquare, HelpCircle, Layers } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { FeatureCardProps } from "../types/FeatureCardProps";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const features: Array<FeatureCardProps> = [
    {
      icon: <Layers className="w-8 h-8 text-purple-500" />,
      title: "Classroom Management",
      description:
        "Easily organize and manage virtual classrooms with intuitive controls and student tracking.",
    },
    {
      icon: <CheckSquare className="w-8 h-8 text-blue-500" />,
      title: "Assignment Evolution",
      description:
        "Automated grading system that evaluates assignments instantly",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      title: "Assignment Management",
      description:
        "Create, distribute, and track assignments with customizable templates and deadlines.",
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-orange-500" />,
      title: "Doubt Management",
      description:
        "Interactive platform for students to raise questions and receive timely responses.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-pink-500" />,
      title: "Calendar Functionality",
      description:
        "Integrated scheduling system to track classes, assignments, and important deadlines.",
    },
  ];

  return (
    <div className="w-full">
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-6 animate-fade-in">
              Welcome to Classync
            </h1>
            <p className="text-gray-400 text-xl mb-12 animate-fade-in-up">
              Elevate your teaching experience with our comprehensive classroom management platform.
            </p>
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center mx-auto group animate-fade-in-up"
              onClick={() => console.log("Get Started clicked")}
            >
              Get Started
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;