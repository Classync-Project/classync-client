const StepGuide = ({ steps }: any) => {
  return (
    <div className="space-y-8 mt-4">
      {steps.map((step: any, index: any) => (
        <div key={index} className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold text-xl border border-purple-600/30">
            {index + 1}
          </div>
          <div className="flex-grow">
            <h4 className="text-lg font-medium text-white mb-2">{step.title}</h4>
            <p className="text-gray-300 mb-4 font-light">{step.description}</p>

            {step.image && (
              <div className="flex items-center mb-4">
                <div className="h-44 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                  <img
                    src={step.image}
                    alt={`Step ${index + 1} illustration`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 text-gray-400 text-sm">
                  {step.imageCaption }
                </div>
              </div>
            )}

            {step.tip && (
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-blue-300 text-sm">
                <span className="font-semibold">Pro Tip:</span> {step.tip}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepGuide;