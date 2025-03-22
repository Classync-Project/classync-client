import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Bell, HelpCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

interface ClassroomTabsProps {
  children: React.ReactNode;
  defaultTab?: string;
}

const ClassroomTabs: React.FC<ClassroomTabsProps> = ({ 
  children, 
  defaultTab = "assignments" 
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full max-w-7xl mx-auto mt-20">
      <TabsList className="p-1 rounded-xl shadow-md mb-8 flex w-full py-3">
        <TabsTrigger
          value="assignments"
          className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center space-x-2 py-3"
        >
          <Calendar className="w-5 h-5" />
          <span>Assignments</span>
        </TabsTrigger>
        <TabsTrigger
          value="participants"
          className="flex-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 flex items-center justify-center space-x-2 py-3"
        >
          <Users className="w-5 h-5" />
          <span>People</span>
        </TabsTrigger>
        <TabsTrigger
          value="announcements"
          className="flex-1 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 flex items-center justify-center space-x-2 py-3"
        >
          <Bell className="w-5 h-5" />
          <span>Announcements</span>
        </TabsTrigger>
        <TabsTrigger
          value="doubts"
          className="flex-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 flex items-center justify-center space-x-2 py-3"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Doubts</span>
        </TabsTrigger>
      </TabsList>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </Tabs>
  );
};

export default ClassroomTabs;
