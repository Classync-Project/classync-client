import React from "react";
import { ChevronRight, BookOpen, Clock, Users, FolderGit2 } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { FeatureCardProps } from "../types/FeatureCardProps";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const features: Array<FeatureCardProps> = [
    {
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      title: "Smart Learning Paths",
      description:
        "Personalized course management with AI-driven recommendations and progress tracking.",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Efficient Task Management",
      description:
        "Streamlined assignment creation and grading with automated workflows.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Collaborative Tools",
      description:
        "Real-time collaboration features with integrated discussion boards and group projects.",
    },
    {
      icon: <FolderGit2 className="w-8 h-8 text-orange-500" />,
      title: "Resource Hub",
      description:
        "Centralized resource management with smart organization and quick access.",
    },
  ];

  return (
    <div className="w-full">
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-6 animate-fade-in">
              Welcome to ClassSync
            </h1>
            <p className="text-gray-400 text-xl mb-12 animate-fade-in-up">
              Elevate your learning experience with our next-gen educational
              platform.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <Footer></Footer>
    </div>
  );
};

export default Home;
