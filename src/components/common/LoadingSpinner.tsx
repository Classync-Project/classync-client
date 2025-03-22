import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
    message?: string;
  }
  
  const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "Loading..." 
  }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-blue-600 font-medium">{message}</p>
      </div>
    );
  };
  
  export default LoadingSpinner;
  