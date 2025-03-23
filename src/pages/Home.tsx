import React from "react";
import { ChevronRight, Calendar, BookOpen, CheckSquare, HelpCircle, Layers, Bot } from "lucide-react";
import FeatureCard from "../components/common/FeatureCard";
import { FeatureCardProps } from "../types/FeatureCardProps";

import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const features: Array<FeatureCardProps> = [
    {
      icon: <Layers className="w-10 h-10 text-purple-500" />,
      title: "Classroom Management",
      description:
        "Easily organize and manage virtual classrooms with intuitive controls and student tracking.",
    },
    {
      icon: <CheckSquare className="w-10 h-10 text-blue-500" />,
      title: "Assignment Evolution",
      description:
        "Automated grading system that evaluates assignments instantly and provides meaningful feedback.",
    },
    {
      icon: <BookOpen className="w-10 h-10 text-green-500" />,
      title: "Assignment Management",
      description:
        "Create, distribute, and track assignments with customizable templates and deadlines.",
    },
    {
      icon: <HelpCircle className="w-10 h-10 text-orange-500" />,
      title: "Doubt Management",
      description:
        "Interactive platform for students to raise questions and receive timely responses.",
    },
    {
      icon: <Calendar className="w-10 h-10 text-pink-500" />,
      title: "Calendar Functionality",
      description:
        "Integrated scheduling system to track classes, assignments, and important deadlines.",
    },
    {
      icon: <Bot className="w-10 h-10 text-indigo-500" />,
      title: "AI Classroom Assistant",
      description:
        "Personalized AI assistant for each classroom to help with queries, resources, and administrative tasks.",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-950 to-gray-900  text-white mb-10">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="text-center relative">
          {/* Abstract background elements */}
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 text-transparent bg-clip-text mb-8">
              Welcome to Classync
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
              Elevate your teaching experience with our comprehensive classroom management platform designed for modern educators.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center group"
                onClick={() =>
                  navigate("/")
                }
              >
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                onClick={() =>

                  navigate("/user-guide")
                }
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mt-4 mb-10">
        <div className="text-center mb-6">

          <p className="text-gray-400 max-w-3xl mx-auto">
            Everything you need to create an engaging and effective virtual learning environment
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            />
          ))}
        </div>
      </div>




    </div>
  );
};

export default Home;