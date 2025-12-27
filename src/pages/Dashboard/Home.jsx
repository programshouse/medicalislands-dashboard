import React, { useEffect } from "react";
import PageHeader from "../../components/ui/PageHeader";
import UniversalCard from "../../components/ui/UniversalCard";
import { useBlogStore } from "../../stors/useBlogStore";
import { useServicesStore } from "../../stors/useServicesStore";
import { useWorkshopStore } from "../../stors/useWorkshopStore";
import { useReviewStore } from "../../stors/useReviewStore";

import {
  FileText,
  Briefcase,
  Mail,
  BadgeCheck,
} from "lucide-react";

const StatCard = ({ icon, iconBg, iconColor, label, value }) => (
  <UniversalCard className="p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {value}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            updated
          </span>
        </div>
      </div>

      <div className={`p-3 rounded-xl ${iconBg}`}>
        {React.createElement(icon, { className: `w-6 h-6 ${iconColor}` })}
      </div>
    </div>



    <div className="mt-4 flex items-center justify-between">
 
    </div>
  </UniversalCard>
);

const Avatar = ({ name }) => {
  const initial = (name || "N")[0]?.toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {initial}
      </span>
    </div>
  );
};

export default function Home() {
  const { blogs, fetchBlogs } = useBlogStore();
  const { services, getAllServices } = useServicesStore();
  const { workshops, getAllWorkshops } = useWorkshopStore();
  const { reviews, getAllReviews } = useReviewStore();

  useEffect(() => {
    fetchBlogs();
    getAllServices();
    getAllWorkshops();
    getAllReviews();
  }, [fetchBlogs, getAllServices, getAllWorkshops, getAllReviews]);

  return (
    <div title="Dashboard | Prof" className="space-y-6 p-5">
      <PageHeader
        title="Medical Dashboard"
        description=""
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Total Blogs"
          value={blogs?.length ?? 0}
        />
        <StatCard
            icon={Mail}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Total Services"
          value={services?.length ?? 0}
        />
        <StatCard
           icon={Briefcase}
          iconBg="bg-violet-50 dark:bg-violet-500/10"
          iconColor="text-violet-600 dark:text-violet-400"
          label="Total Workshops"
          value={workshops?.length ?? 0}
        />
      </div>

      {/* Latest Reviews */}
      <UniversalCard className="p-0">
        {/* Card Header */}
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-700/60">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Latest Reviews
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most recent reviews from clients
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <BadgeCheck className="w-4 h-4" />
              Updated
            </div>
            <button
              onClick={() => window.location.href = '/reviews'}
              className="px-3 py-1.5 text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Reviews
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3">Reviewer</th>
                <th className="px-6 py-3">Review</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {reviews && reviews.length > 0 ? (
                reviews.slice(0, 3).map((review, index) => {
                  const reviewerName = review.user_name || "Anonymous";
                  const reviewText = review.review || "No review text";
                  const status = review.is_active ? "active" : "inactive";
                  const isActive = status === "active";

                  return (
                    <tr
                      key={review?.id || index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.user_image ? (
                            <img
                              src={typeof review.user_image === "string" ? review.user_image : (review.user_image instanceof File || review.user_image instanceof Blob) ? URL.createObjectURL(review.user_image) : ''}
                              alt={reviewerName}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {reviewerName}
                            </div>
                            {review.user_job && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {review.user_job}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-xs text-gray-700 dark:text-gray-300">
                          <div className="truncate">
                            {reviewText}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
                          ].join(" ")}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white dark:bg-gray-800">
                  <td colSpan="3" className="px-6 py-10 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="h-12 w-12 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                      </div>
                      <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                        No reviews yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Once reviews are added, they'll appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer */}
        {reviews && reviews.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400">
            Showing {Math.min(reviews.length, 3)} of {reviews.length} reviews
          </div>
        )}
      </UniversalCard>

    </div>
  );
}
