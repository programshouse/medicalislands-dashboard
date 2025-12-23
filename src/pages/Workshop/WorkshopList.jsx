// src/pages/Workshops/WorkshopList.jsx
import React, { useEffect, useCallback } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminTable from "../../components/ui/AdminTable";
import { useWorkshopStore } from "../../stors/useWorkshopStore";

export default function WorkshopList({ onEdit, onAdd, onShow }) {
  const { workshops, loading, getAllWorkshops, deleteWorkshop } = useWorkshopStore();

  // ✅ avoid effect re-run loops if store returns new function refs
  const fetchWorkshops = useCallback(() => {
    getAllWorkshops();
  }, [getAllWorkshops]);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleDelete = async (index) => {
    const workshop = workshops[index];
    if (!workshop) return;

    if (window.confirm(`Are you sure you want to delete "${workshop.title}"?`)) {
      try {
        await deleteWorkshop(workshop.id);
      } catch (error) {
        console.error("Error deleting workshop:", error);
      }
    }
  };

  const handleEdit = (item, index) => {
    const workshop = workshops[index];
    if (workshop && onEdit) {
      onEdit(workshop);
    }
  };

  // ✅ NEW: handleShow to ensure icon appears and action works
  const handleShow = (item, index) => {
    const workshop = workshops[index];
    if (workshop && onShow) {
      onShow(workshop);
    }
  };

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "features",
      header: "Features",
      render: (workshop) => (
        <div className="max-w-xs">
          {workshop.features && workshop.features.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {workshop.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {feature}
                </span>
              ))}
              {workshop.features.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{workshop.features.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">No features</span>
          )}
        </div>
      ),
    },
    {
      key: "media",
      header: "Media",
      render: (workshop) => (
        <div className="flex gap-2">
          {workshop.video && (
            <button
              onClick={() => window.open(workshop.video, '_blank')}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition-colors"
            >
              Video
            </button>
          )}
          {workshop.image && (
            <button
              onClick={() => {
                const imageUrl = typeof workshop.image === 'string' ? workshop.image : URL.createObjectURL(workshop.image);
                window.open(imageUrl, '_blank');
              }}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer transition-colors"
            >
              Image
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <PageLayout title="Workshop Management | ProfMSE">
        <PageHeader
          title="Workshop Management"
          description="Manage workshops that appear on the website"
        />
        <div className="col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading workshops...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Workshop Management | ProfMSE">
      <PageHeader
        title="Workshop Management"
        description="Manage workshops that appear on the website"
      />
      <div className="col-span-12">
        <AdminTable
          title="Workshops"
          data={workshops}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={handleShow}   // ✅ use handler
          onAdd={onAdd}
          addText="Add New Workshop"
        />
      </div>
    </PageLayout>
  );
}
