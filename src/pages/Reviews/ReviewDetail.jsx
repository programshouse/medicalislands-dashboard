import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getReviewById, deleteReview } = useReviewStore();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadReview = async () => {
      try {
        setLoading(true);
        const data = await getReviewById(id);
        setReview(data);
      } catch (error) {
        console.error("Error loading review:", error);
        navigate("/reviews");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadReview();
  }, [id, navigate, getReviewById]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      setDeleting(true);
      await deleteReview(id);
      navigate("/reviews");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review. Please try again.");
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/reviews/${id}/edit`);
  };

  if (loading) {
    return (
      <PageLayout title="Review Detail | ProfMSE">
        <PageHeader title="Review Detail" description="Loading review information..." />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading review...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!review) {
    return (
      <PageLayout title="Review Not Found | ProfMSE">
        <PageHeader title="Review Not Found" description="The requested review could not be found." />
        <div className="col-span-12">
          <PageCard title="Error">
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Review not found.</p>
              <button
                onClick={() => navigate("/reviews")}
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Back to Reviews
              </button>
            </div>
          </PageCard>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${review.name} - Review | ProfMSE`}>
      <PageHeader title="Review Detail" description="View and manage review information" />
      <div className="col-span-12">
        <PageCard title={review.name || "Review Details"}>
          <div className="flex justify-end mb-6 space-x-3">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Edit Review
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg"
            >
              {deleting ? "Deleting..." : "Delete Review"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {review.image && (
                <div className="mb-6">
                  <img
                    src={typeof review.image === "string" ? review.image : URL.createObjectURL(review.image)}
                    alt={review.name || "Reviewer"}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Reviewer Info</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{review.name || "Unnamed"}</p>
                  </div>
                  {review.user_job && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Job Title:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{review.user_job}</p>
                    </div>
                  )}
                  {review.is_active !== undefined && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                      <p className="font-medium">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          review.is_active 
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}>
                          {review.is_active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Review Content</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {review.description || review.review || "No review content available."}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.created_at ? new Date(review.created_at).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.updated_at ? new Date(review.updated_at).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/reviews")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Back to Reviews
            </button>
          </div>
        </PageCard>
      </div>
    </PageLayout>
  );
}
