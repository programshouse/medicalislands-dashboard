import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { EditButton } from "../../components/ui/IconButton";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewList({ onAdd, onEdit, onEditComplete }) {
  const { reviews, loading, getAllReviews, deleteReview } = useReviewStore();
  const [selectedReview, setSelectedReview] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getAllReviews().catch(console.error);
  }, [getAllReviews, refreshKey]);

  const handleEditComplete = () => {
    setRefreshKey(prev => prev + 1);
    onEditComplete?.();
  };

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
    <div
      key={r.id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Avatar + Actions */}
        <div className="flex items-center justify-between gap-3">
          {r.user_image ? (
            <img
              src={
                typeof r.user_image === "string"
                  ? r.user_image
                  : r.user_image instanceof File || r.user_image instanceof Blob
                  ? URL.createObjectURL(r.user_image)
                  : ""
              }
              alt={r.user_name || "Reviewer"}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-brand-400 dark:text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = `/reviews/${r.id}`)}
              className="flex items-center justify-center transition-colors w-8 h-8 border border-brand-300 bg-white hover:bg-gray-50 rounded-lg  "
              title="View Details"
            >
              <svg
                className="w-4 h-4 text-brand-300 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            <EditButton
              onClick={() => onEdit?.(r, handleEditComplete)}
            />

            <button
              onClick={() => handleDelete(r)}
              className="p-2 rounded-md border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Name (second line) */}
        <div className="font-semibold text-gray-900 dark:text-white leading-tight">
          {r.user_name || "Unnamed"}
        </div>
      </div>

      {/* <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-5">{r.review}</p> */}
    </div>
  ))}
</div>

          )}
        </PageCard>
      </div>

          </PageLayout>
  );
}
