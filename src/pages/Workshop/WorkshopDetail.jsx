import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useWorkshopStore } from "../../stors/useWorkshopStore";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import { ArrowLeft, Edit, Play, Image as ImageIcon } from "lucide-react";

export default function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workshop, loading, getWorkshopById } = useWorkshopStore();

  React.useEffect(() => {
    if (id) {
      getWorkshopById(parseInt(id));
    }
  }, [id, getWorkshopById]);

  const handleEdit = () => {
    navigate(`/workshop/form`, { state: { editingWorkshop: workshop } });
  };

  if (loading) {
    return (
      <PageLayout title="Workshop Details | ProfMSE">
        <PageHeader title="Workshop Details" description="Loading workshop information..." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Loading workshop details...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!workshop) {
    return (
      <PageLayout title="Workshop Not Found | ProfMSE">
        <PageHeader title="Workshop Not Found" description="The requested workshop could not be found." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Workshop not found.
            </p>
            <Link
              to="/workshop"
              className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workshops
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${workshop.title} | ProfMSE`}>
      <div className="col-span-12">
        {/* Header with navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/workshop"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Workshops
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Workshop Details
              </h1>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Workshop
            </button>
          </div>
        </div>

        {/* Workshop Details Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {workshop.title}
            </h2>
          </div>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            {/* Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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

            {/* Link */}
            {workshop.link && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Workshop Link
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <a
                    href={workshop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline break-all inline-flex items-center"
                  >
                    {workshop.link}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Media Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Media Content
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                {workshop.image && (
                  <div>
                    <div className="flex items-center mb-3">
                      <ImageIcon className="w-5 h-5 mr-2 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Workshop Image</h4>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={workshop.image.startsWith('http') ? workshop.image : `https://www.programshouse.com/dashboards/medical/api${workshop.image}`}
                        alt="Workshop Image"
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Video */}
                {workshop.video && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Play className="w-5 h-5 mr-2 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Workshop Video</h4>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-auto"
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
                
                {/* No media message */}
                {!workshop.image && !workshop.video && (
                  <div className="col-span-2 text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500">
                      <ImageIcon className="mx-auto h-12 w-12 mb-3" />
                      <p className="text-lg">No media files available</p>
                      <p className="text-sm mt-1">This workshop doesn't have any images or videos uploaded.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Created At
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {workshop.created_at 
                    ? new Date(workshop.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown'
                  }
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Last Updated
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {workshop.updated_at 
                    ? new Date(workshop.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
