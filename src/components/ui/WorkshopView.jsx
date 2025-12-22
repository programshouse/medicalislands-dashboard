import React from "react";
import { useWorkshopStore } from "../../stors/useWorkshopStore";

const WorkshopView = ({ workshopId, onClose }) => {
  const { workshop, loading, getWorkshopById } = useWorkshopStore();

  React.useEffect(() => {
    if (workshopId) {
      getWorkshopById(workshopId);
    }
  }, [workshopId, getWorkshopById]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">Loading workshop...</p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <p className="text-gray-600 dark:text-gray-300 text-center">Workshop not found</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-brand-500 text-white py-2 px-4 rounded-lg hover:bg-brand-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workshop.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {workshop.features && workshop.features.length > 0 ? (
                workshop.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {feature}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 dark:text-gray-500">No features listed</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Media
            </h3>
            <div className="space-y-4">
              {workshop.image && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image</h4>
                  <div className="relative">
                    <img
                      src={workshop.image.startsWith('http') ? workshop.image : `https://www.programshouse.com/dashboards/medical/api${workshop.image}`}
                      alt="Workshop Image"
                      className="w-full max-w-md h-auto rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {workshop.video && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video</h4>
                  <div className="relative">
                    <video
                      controls
                      className="w-full max-w-md h-auto rounded-lg shadow-md"
                      preload="metadata"
                    >
                      <source 
                        src={workshop.video.startsWith('http') ? workshop.video : `https://www.programshouse.com/dashboards/medical/api${workshop.video}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
              
              {!workshop.image && !workshop.video && (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No media files available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Created
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {workshop.created_at ? new Date(workshop.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Last Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {workshop.updated_at ? new Date(workshop.updated_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopView;
