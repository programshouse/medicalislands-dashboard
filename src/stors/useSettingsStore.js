// src/stors/useSettingsStore.js
import { create } from "zustand";
import api from "../services/api";

const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,
  error: null,

  // Get all settings
  getSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/settings");
      set({ settings: response.data?.data ?? response.data, loading: false });
      return response.data?.data ?? response.data;
    } catch (error) {
      set({ error: error?.message || "Failed to load settings", loading: false });
      throw error;
    }
  },

  // Get settings by ID
  getSettingsById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/settings/${id}`);
      set({ settings: response.data?.data ?? response.data, loading: false });
      return response.data?.data ?? response.data;
    } catch (error) {
      set({ error: error?.message || "Failed to load settings", loading: false });
      throw error;
    }
  },

  // Create new settings
  createSettings: async (settingsData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/settings/save", settingsData);
      set({ settings: response.data?.data ?? response.data, loading: false });
      return response.data?.data ?? response.data;
    } catch (error) {
      set({ error: error?.message || "Failed to create settings", loading: false });
      throw error;
    }
  },

  // Update settings
  updateSettings: async (id, settingsData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/settings/${id}`, settingsData);
      set({ settings: response.data?.data ?? response.data, loading: false });
      return response.data?.data ?? response.data;
    } catch (error) {
      set({ error: error?.message || "Failed to update settings", loading: false });
      throw error;
    }
  },

  // Delete settings
  deleteSettings: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/settings/${id}`);
      set({ settings: null, loading: false });
      return true;
    } catch (error) {
      set({ error: error?.message || "Failed to delete settings", loading: false });
      throw error;
    }
  },

  // Clear settings
  clearSettings: () => set({ settings: null, error: null }),
}));

export { useSettingsStore };
