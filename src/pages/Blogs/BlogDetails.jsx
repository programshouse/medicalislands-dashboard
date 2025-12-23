import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import PageCard from "../../components/ui/PageCard";
import { useBlogStore } from "../../stors/useBlogStore";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBlog, loading, fetchBlogById, deleteBlog } = useBlogStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
    }
  }, [id, fetchBlogById]);

  const handleDelete = async () => {
    if (!selectedBlog) return;
    
    if (window.confirm(`Are you sure you want to delete "${selectedBlog.title}"?`)) {
      try {
        setIsDeleting(true);
        await deleteBlog(selectedBlog.id);
        navigate('/blogs');
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Error deleting blog. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (selectedBlog) {
      navigate(`/blogs/form?id=${selectedBlog.id}`);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Blog Details | ProfMSE">
        <PageHeader title="Blog Details" description="View blog post details" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading blog details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!selectedBlog) {
    return (
      <PageLayout title="Blog Details | ProfMSE">
        <PageHeader title="Blog Details" description="View blog post details" />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">Blog not found.</p>
            <button 
              onClick={() => navigate('/blogs')}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Blog Details | ProfMSE">
      <PageHeader 
        title={selectedBlog.title} 
        description="View blog post details" 
      />
      <div className="col-span-12">
        <PageCard title="Blog Post Details">
          <div className="space-y-6">
            {/* Blog Image */}
            {selectedBlog.image && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h3>
                <img
                  src={typeof selectedBlog.image === 'string' ? selectedBlog.image : URL.createObjectURL(selectedBlog.image)}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Blog Title */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedBlog.title}</p>
            </div>

            {/* Blog Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content</h3>
              <div 
                className="text-gray-900 dark:text-white whitespace-pre-wrap max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content || 'No content' }}
              />
            </div>

            {/* Blog Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-full ${
                  selectedBlog.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {selectedBlog.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Created Date</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedBlog.created_at ? new Date(selectedBlog.created_at).toLocaleDateString() : 'N/A'}
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
                  onClick={() => navigate('/blogs')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Back to Blogs
                </button>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </PageLayout>
  );
}
