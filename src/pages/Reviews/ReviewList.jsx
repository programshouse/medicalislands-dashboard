import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewList({ onAdd, onEdit }) {
  const { reviews, loading, getAllReviews, deleteReview } = useReviewStore();
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    getAllReviews().catch(console.error);
  }, [getAllReviews]);

  const handleDelete = async (review) => {
    if (window.confirm(`Are you sure you want to delete the review from ${review.user_name || 'Unknown'}?`)) {
      try {
        await deleteReview(review.id);
        // Close modal if the deleted review was selected
        if (selectedReview?.id === review.id) {
          setSelectedReview(null);
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  if (loading) {
    return (
      <PageLayout title="Reviews | ProfMSE">
        <PageHeader title="Reviews" description="What people say about you" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading reviews...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Reviews | ProfMSE">
      <PageHeader title="Reviews" description="What people say about you" />
      <div className="col-span-12">
        <PageCard title="All Reviews">
          <div className="flex justify-end mb-4">
            <button
              onClick={onAdd}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              + Add Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              No reviews yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    {r.user_image && (
                      <img
                        src={typeof r.user_image === "string" ? r.user_image : URL.createObjectURL(r.user_image)}
                        alt={r.user_name || "Reviewer"}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{r.user_name || "Unnamed"}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{r.user_job || ""}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        title="View"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit?.(r)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="p-2 rounded-md border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-5">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </PageCard>
      </div>

      {/* Review Modal/Detail View */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Details</h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {selectedReview.user_image ? (
                  <img
                    src={typeof selectedReview.user_image === "string" ? selectedReview.user_image : URL.createObjectURL(selectedReview.user_image)}
                    alt={selectedReview.user_name || "Reviewer"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedReview.user_name || "Unnamed"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedReview.user_job || "No job title"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</h4>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedReview.review || "No review text"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Status</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedReview.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {selectedReview.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Created</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedReview.created_at ? new Date(selectedReview.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 mt-6">
                <button
                  onClick={() => handleDelete(selectedReview)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedReview(null);
                      onEdit?.(selectedReview);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
