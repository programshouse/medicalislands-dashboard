import React from "react";
import { X } from "lucide-react";

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Service Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Title
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {service.title}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          {/* Image */}
          {service.image && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Image
              </h3>
              <img
                src={service.image}
                alt={service.title}
                className="w-full max-w-md h-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Created At
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {service.created_at 
                  ? new Date(service.created_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Updated At
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {service.updated_at 
                  ? new Date(service.updated_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
