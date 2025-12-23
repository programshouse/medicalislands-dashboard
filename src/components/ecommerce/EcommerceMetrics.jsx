// src/components/dashboard/EcommerceMetrics.jsx
import React, { useEffect, useMemo } from "react";
import { useApiStore } from "../../stors/useApiStore";
import { useWorkshopStore } from "../../stors/useWorkshopStore";
import { useBlogStore } from "../../stors/useBlogStore";
import { useReviewStore } from "../../stors/useReviewStore";
import { BoxIconLine, GroupIcon } from "../../icons";

function MetricCard({ icon, title, value, loading }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          {loading ? (
            <div className="mt-2 h-6 w-16 rounded bg-gray-200 animate-pulse" />
          ) : (
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {value}
            </h4>
          )}
        </div>
        {/* Arrow/Badge removed */}
      </div>
    </div>
  );
}

// Safely pick a number from possible keys
function pick(obj, keys, fallback = 0) {
  for (const k of keys) {
    const v = k.split(".").reduce((o, part) => (o && o[part] != null ? o[part] : undefined), obj);
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  }
  return fallback;
}

export default function EcommerceMetrics() {
  const { fetchHome, contacts, loading } = useApiStore();
  const { workshops, fetchWorkshops } = useWorkshopStore();
  const { blogs, fetchBlogs } = useBlogStore();
  const { reviews, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchHome?.();
    fetchWorkshops?.();
    fetchBlogs?.();
    fetchReviews?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const src = useMemo(() => {
    if (!contacts) return {};
    return typeof contacts === "object" && contacts?.data ? contacts.data : contacts;
  }, [contacts]);

  const workshopCount = useMemo(
    () => workshops?.length || pick(src, ["workshops", "workshops_count", "stats.workshops", "counts.workshops"], 0),
    [workshops, src]
  );
  const blogCount = useMemo(
    () => blogs?.length || 0,
    [blogs]
  );
  const reviewCount = useMemo(
    () => reviews?.length || 0,
    [reviews]
  );
  const users = useMemo(
    () => pick(src, ["users", "users_count", "stats.users", "counts.users", "total_users"], 0),
    [src]
  );

  const nf = (n) => new Intl.NumberFormat().format(n);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        title="Workshops"
        value={nf(workshopCount)}
        loading={loading && workshopCount === 0}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        title="Blogs"
        value={nf(blogCount)}
        loading={!blogs}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        title="Reviews"
        value={nf(reviewCount)}
        loading={!reviews}
      />
      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        title="Users"
        value={nf(users)}
        loading={loading && users === 0}
      />
    </div>
  );
}
