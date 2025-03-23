import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const GuideSection = ({ title, children, icon, isOpen = false } : any) => {
    const [expanded, setExpanded] = useState(isOpen);
    
    return (
      <div className="border border-gray-700 rounded-xl overflow-hidden mb-6 bg-gray-800/50 backdrop-blur-sm">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-xl font-semibold brand-font text-white">{title}</h3>
          </div>
          {expanded ? 
            <ChevronDown className="w-5 h-5 text-gray-400" /> : 
            <ChevronRight className="w-5 h-5 text-gray-400" />
          }
        </div>
        
        {expanded && (
          <div className="p-6 pt-2 border-t border-gray-700">
            {children}
          </div>
        )}
      </div>
    );
  };

export default GuideSection;
  