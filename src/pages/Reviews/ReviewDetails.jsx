import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reviews, loading, getAllReviews, deleteReview } = useReviewStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedReview = reviews?.find(r => r.id === parseInt(id));

  useEffect(() => {
    if (reviews.length === 0) {
      getAllReviews().catch(console.error);
    }
  }, [getAllReviews, reviews.length]);

  const handleDelete = async () => {
    if (!selectedReview) return;
    
    if (window.confirm(`Are you sure you want to delete review from ${selectedReview.user_name || 'Unknown'}?`)) {
      try {
        setIsDeleting(true);
        await deleteReview(selectedReview.id);
        navigate('/reviews');
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Error deleting review. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (selectedReview) {
      navigate(`/reviews/form?id=${selectedReview.id}`);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <PageLayout title="Review Details | ProfMSE">
        <PageHeader title="Review Details" description="View review details" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading review details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!selectedReview) {
    return (
      <PageLayout title="Review Details | ProfMSE">
        <PageHeader title="Review Details" description="View review details" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">Review not found.</p>
            <button 
              onClick={() => navigate('/reviews')}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              Back to Reviews
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Review Details | ProfMSE">
      <PageHeader 
        title={`Review from ${selectedReview.user_name || 'Anonymous'}`} 
        description="View review details" 
      />
      <div className="col-span-12">
        <PageCard title="Review Details">
          <div className="space-y-6">
            {/* User Profile */}
            <div className="flex items-center gap-6">
              {selectedReview.user_image ? (
                <img
                  src={typeof selectedReview.user_image === "string" ? selectedReview.user_image : (selectedReview.user_image instanceof File || selectedReview.user_image instanceof Blob) ? URL.createObjectURL(selectedReview.user_image) : ''}
                  alt={selectedReview.user_name || "Reviewer"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedReview.user_name || "Unnamed"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedReview.user_job || "No job title"}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Review</h3>
              <div className="text-gray-900 dark:text-white whitespace-pre-wrap p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                {selectedReview.review || "No review text"}
              </div>
            </div>

            {/* Review Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-full ${
                  selectedReview.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {selectedReview.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Created Date</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedReview.created_at ? new Date(selectedReview.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828L8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button
                  onClick={() => navigate('/reviews')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Back to Reviews
                </button>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </PageLayout>
  );
}
