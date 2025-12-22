import React, { useState, useEffect } from "react";
import PageLayout from "../../components/ui/PageLayout";
import PageHeader from "../../components/ui/PageHeader";
import AdminForm from "../../components/ui/AdminForm";
import FileUpload from "../../components/ui/FileUpload";
import { useWorkshopStore } from "../../stors/useWorkshopStore";

export default function WorkshopForm({ workshopId, onSuccess }) {
  const { workshop, loading, getWorkshopById, createWorkshop, updateWorkshop, clearWorkshop } = useWorkshopStore();
  const [formData, setFormData] = useState({
    title: "",
    features: "",
    video: null,
    image: null
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workshopId) {
      getWorkshopById(workshopId);
    }
    return () => clearWorkshop();
  }, [workshopId, getWorkshopById, clearWorkshop]);

  useEffect(() => {
    if (workshop && workshopId) {
      setFormData({
        title: workshop.title || "",
        features: workshop.features ? workshop.features.join(', ') : "",
        video: null,
        image: null
      });
    }
  }, [workshop, workshopId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (workshopId) {
        await updateWorkshop(workshopId, formData);
      } else {
        await createWorkshop(formData);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving workshop:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading workshop...</p>
      </div>
    );
  }

  return (
    <AdminForm
      title={workshopId ? "Edit Workshop" : "Add New Workshop"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitText={saving ? "Saving..." : (workshopId ? "Update Workshop" : "Create Workshop")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workshop Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Features *
        </label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          rows={4}
          placeholder="Enter workshop features separated by commas (e.g., Hands-on training, Expert guidance, Certificate provided)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Separate multiple features with commas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="Workshop Video"
          name="video"
          value={formData.video}
          onChange={handleFileChange}
          accept="video/*"
        />

        <FileUpload
          label="Workshop Image"
          name="image"
          value={formData.image}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </AdminForm>
  );
}
