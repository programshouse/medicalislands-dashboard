import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useReviewStore } from "../../stors/useReviewStore";

export default function ReviewForm({ reviewId, onSuccess }) {
  const { loading, getReviewById, createReview, updateReview } = useReviewStore();

  const [user_name, setUserName] = useState("");
  const [user_job, setUserJob] = useState("");
  const [review_text, setReviewText] = useState("");
  const [user_image, setUserImage] = useState(null);

  useEffect(() => {
    if (!reviewId) return;
    (async () => {
      try {
        const data = await getReviewById(reviewId);
        setUserName(data?.user_name || "");
        setUserJob(data?.user_job || "");
        setReviewText(data?.review || "");
        setUserImage(data?.user_image || null);
      } catch (error) {
        console.error("Error loading review:", error);
      }
    })();
  }, [reviewId, getReviewById]);

  const onFile = (e) => {
    const { value } = e.target;
    setUserImage(value);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user_name.trim() || !review_text.trim()) return;
    try {
      const reviewData = {
        user_name: user_name.trim(),
        user_job: user_job.trim(),
        review: review_text.trim(),
        user_image,
        is_active: 1,
      };
      
      if (reviewId) {
        await updateReview(reviewId, reviewData);
      } else {
        await createReview(reviewData);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const cancel = () => onSuccess && onSuccess();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading review…</p>
      </div>
    );
  }

  return (
    <AdminForm
      title={reviewId ? "Edit Review" : "Add New Review"}
      onSubmit={submit}
      onCancel={cancel}
      submitText={loading ? "Saving..." : reviewId ? "Update Review" : "Create Review"}
      submitDisabled={loading || !user_name.trim() || !review_text.trim()}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Name *</label>
          <input
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={120}
            placeholder="Reviewer name…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{user_name.length}/120</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Job</label>
          <input
            value={user_job}
            onChange={(e) => setUserJob(e.target.value)}
            maxLength={120}
            placeholder="Job title…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="text-xs text-gray-500 mt-1">{user_job.length}/120</p>
        </div>

        <div>
          <FileUpload
            label="User Image (optional)"
            name="user_image"
            value={user_image}
            onChange={onFile}
            accept="image/*"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Review Text *
        </label>
        <textarea
          value={review_text}
          onChange={(e) => setReviewText(e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="What did they say?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{review_text.length}/1000</p>
      </div>
    </AdminForm>
  );
}
