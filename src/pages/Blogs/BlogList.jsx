import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { EditButton } from "../../components/ui/IconButton";
import { useBlogStore } from "../../stors/useBlogStore";

export default function BlogList({ onEdit, onAdd }) {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore();
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await deleteBlog(blog.id);
        if (selectedBlog?.id === blog.id) {
          setSelectedBlog(null);
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <PageLayout title="Blogs Management | ProfMSE">
        <PageHeader title="Blogs Management" description="Manage blog posts that appear on the website" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading blogs...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Blogs Management | ProfMSE">
        <PageHeader title="Blogs Management" description="Manage blog posts that appear on the website" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            <button 
              onClick={fetchBlogs}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Blogs Management | ProfMSE">
      <PageHeader title="Blogs Management" description="Manage blog posts that appear on the website" />
      <div className="col-span-12">
        <PageCard title="Blog Posts">
          <div className="flex justify-end mb-4">
            <button
              onClick={onAdd}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              + Add Blog Post
            </button>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              No blog posts yet.
            </div>
          ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {blogs.map((blog) => (
    <div
      key={blog.id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Image + Actions */}
        <div className="flex items-center justify-between gap-3">
          {blog.image ? (
            <img
              src={typeof blog.image === "string" ? blog.image : URL.createObjectURL(blog.image)}
              alt={blog.title}
              className="w-12 h-12 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-brand-400 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = `/blogs/${blog.id}`)}
              className="flex items-center justify-center transition-colors w-8 h-8 border border-brand-300 bg-white hover:bg-gray-50 rounded-lg  "
              title="View Details"
            >
              <svg className="w-4 h-4 text-brand-300 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <EditButton
              onClick={() => onEdit?.(blog)}
            />

            <button
              onClick={() => handleDelete(blog)}
              className="p-2 rounded-md border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Title (second line) */}
        <div className="font-semibold text-gray-900 dark:text-white leading-tight break-words">
          {blog.title || "Untitled"}
        </div>
      </div>

      {/* <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {(blog.content || '').replace(/<[^>]*>/g, '').substring(0, 150)}...
      </p> */}
    </div>
  ))}
</div>

          )}
        </PageCard>
      </div>

          </PageLayout>
  );
}
