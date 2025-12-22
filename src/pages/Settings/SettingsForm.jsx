import React, { useEffect, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import { useSettingsStore } from "../../stors/useSettingsStore";

export default function SettingsForm({ settingsId, onSuccess }) {
  const [formData, setFormData] = useState({
    site_name: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    whatsapp: "",
  });

  const {
    settings,
    loading,
    getSettingsById,
    createSettings,
    updateSettings,
    clearSettings,
  } = useSettingsStore();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await getSettingsById(settingsId);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    if (settingsId) load();

    return () => {
      clearSettings();
    };
  }, [settingsId, getSettingsById, clearSettings]);

  useEffect(() => {
    if (settingsId && settings) {
      setFormData({
        site_name: settings.site_name || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        whatsapp: settings.whatsapp || "",
      });
    }
  }, [settingsId, settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (settingsId) {
        await updateSettings(settingsId, formData);
      } else {
        await createSettings(formData);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving settings:", error);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <AdminForm
      title={settingsId ? "Edit Settings" : "Add New Settings"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitText={
        saving ? "Saving..." : settingsId ? "Update Settings" : "Create Settings"
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name *
          </label>
          <input
            type="text"
            name="site_name"
            value={formData.site_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address URL
          </label>
          <input
            type="url"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/yourprofile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/yourhandle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
