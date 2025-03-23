import React from 'react';
import { FeatureCardProps } from '../../types/FeatureCardProps';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
};

export default FeatureCard