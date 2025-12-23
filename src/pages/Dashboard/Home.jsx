import React, { useEffect } from "react";
import PageHeader from "../../components/ui/PageHeader";
import UniversalCard from "../../components/ui/UniversalCard";
import { useBlogStore } from "../../stors/useBlogStore";
import { useServicesStore } from "../../stors/useServicesStore";

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

  useEffect(() => {
    fetchBlogs();
    getAllServices();
  }, [fetchBlogs, getAllServices]);

  return (
    <div title="Dashboard | Prof" className="space-y-6 p-5">
      <PageHeader
        title="ProfMSE Dashboard"
        description="Medical Research & Biostatistics Dashboard - Dr. Mohammed Said ElSharkawy"
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
          icon={Briefcase}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Total Services"
          value={services?.length ?? 0}
        />
        <StatCard
          icon={Mail}
          iconBg="bg-violet-50 dark:bg-violet-500/10"
          iconColor="text-violet-600 dark:text-violet-400"
          label="Total Workshops"
          value={0}
        />
      </div>


    </div>
  );
}
