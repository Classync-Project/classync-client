interface LoadingSpinnerProps {
    message?: string;
  }
  
  const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "Loading..." 
  }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 font-medium">{message}</p>
      </div>
    );
  };
  
  export default LoadingSpinner;
  