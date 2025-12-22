// src/pages/SettingsForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminForm from "../../components/ui/AdminForm";
import { useSettingsStore } from "../../stors/useSettingsStore";

const emptyForm = {
  site_name: "",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  whatsapp: "",
};

export default function SettingsForm({ settingsId, onSuccess }) {
  const {
    settings,
    loading,
    error,
    getSettings,
    getSettingsById,
    createSettings,
    updateSettings,
    deleteSettings,
    clearSettings,
  } = useSettingsStore();

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // supports stored settings as: object OR array
  const settingsRecord = useMemo(() => {
    if (!settings) return null;
    if (Array.isArray(settings)) return settings[0] ?? null;
    return settings;
  }, [settings]);

  const effectiveId = useMemo(() => {
    if (settingsId) return String(settingsId);
    if (settingsRecord?.id) return String(settingsRecord.id);
    return null;
  }, [settingsId, settingsRecord]);

  useEffect(() => {
    const load = async () => {
      try {
        if (settingsId) {
          await getSettingsById(String(settingsId));
        } else {
          await getSettings();
        }
      } catch (e) {
        // store already sets error
        console.error("Error loading settings:", e);
      }
    };

    load();

    return () => {
      clearSettings();
    };
  }, [settingsId, getSettings, getSettingsById, clearSettings]);

  useEffect(() => {
    const s = settingsRecord;
    if (!s) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      site_name: s.site_name || "",
      email: s.email || "",
      phone: s.phone || "",
      address: s.address || "",
      facebook: s.facebook || "",
      instagram: s.instagram || "",
      linkedin: s.linkedin || "",
      twitter: s.twitter || "",
      whatsapp: s.whatsapp || "",
    });
  }, [settingsRecord]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (effectiveId) {
        await updateSettings(effectiveId, formData);
      } else {
        await createSettings(formData);
      }

      onSuccess?.();
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => onSuccess?.();

  const handleDelete = async () => {
    if (!effectiveId) return;
    
    if (!confirm("Are you sure you want to delete these settings? This action cannot be undone.")) {
      return;
    }

    try {
      setSaving(true);
      await deleteSettings(effectiveId);
      onSuccess?.();
    } catch (err) {
      console.error("Error deleting settings:", err);
    } finally {
      setSaving(false);
    }
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <AdminForm
        title={effectiveId ? "Edit Settings" : "Add New Settings"}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText={
          saving
            ? "Saving..."
            : effectiveId
            ? "Update Settings"
            : "Create Settings"
        }
        submitDisabled={saving}
      >
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {String(error)}
          </div>
        ) : null}

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
      
      {/* Delete button - only show when editing existing settings */}
      {effectiveId && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {saving ? "Deleting..." : "Delete Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
