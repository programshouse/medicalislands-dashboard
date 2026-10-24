import React from "react";

const ServiceCard = ({ 
  title, 
  description, 
  image = null,
  features = [],
  className = "" 
}) => {
  return (
    <div className={`bg-white  rounded-lg shadow-sm border border-gray-200  overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {/* Image Section */}
      <div className="w-full h-48">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100  flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900  mb-3">
          {title}
        </h3>
        <p className="text-gray-600  mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Features Preview */}
        {features && features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="inline-block bg-brand-100  text-brand-800  text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="inline-block text-gray-500  text-xs px-2 py-1">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Get Service
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
