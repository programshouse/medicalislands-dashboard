// src/stors/useSettingsStore.js
import { create } from "zustand";

const STORAGE_KEY = "medical_settings";

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// normalize: object OR array -> keep as-is but provide helpers
const normalize = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (typeof data === "object") return data;
  return null;
};

const findById = (data, id) => {
  const targetId = String(id);

  if (!data) return null;

  if (Array.isArray(data)) {
    return data.find((x) => x && String(x.id) === targetId) ?? null;
  }

  if (typeof data === "object") {
    return String(data.id) === targetId ? data : null;
  }

  return null;
};

export const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,
  error: null,

  // Get settings (default/first)
  getSettings: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 200));

      const stored = safeParse(localStorage.getItem(STORAGE_KEY));
      const settings = normalize(stored);

      // If no stored data, return default settings
      if (!settings) {
        const defaultSettings = {
          id: 1,
          site_name: "prof",
          email: "prof@com",
          phone: "012345678",
          address: "https://profmse.com/",
          facebook: "https://profmse.com/",
          instagram: "https://profmse.com/",
          linkedin: "https://profmse.com/",
          twitter: "https://profmse.com/",
          whatsapp: "014567899",
          created_at: "2025-10-29T13:27:50.000000Z",
          updated_at: "2025-10-29T13:27:50.000000Z"
        };
        set({ settings: defaultSettings, loading: false });
        return defaultSettings;
      }

      set({ settings, loading: false });
      return settings;
    } catch (error) {
      set({ error: error?.message || "Failed to load settings", loading: false });
      throw error;
    }
  },

  // Get settings by ID (works with object OR array)
  getSettingsById: async (id) => {
    set({ loading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 200));

      const stored = safeParse(localStorage.getItem(STORAGE_KEY));
      const settings = normalize(stored);

      const found = findById(settings, id);
      if (!found) throw new Error("Settings not found");

      // keep original structure in store (array/object)
      // but you can also set found only if you prefer:
      // set({ settings: found, loading: false });
      set({ settings, loading: false });

      return found;
    } catch (error) {
      set({ error: error?.message || "Failed to load settings", loading: false });
      throw error;
    }
  },

  // Create settings
  createSettings: async (settingsData) => {
    set({ loading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));

      const newSettings = {
        id: Date.now().toString(),
        ...settingsData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // store as OBJECT (single settings record)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      set({ settings: newSettings, loading: false });

      return newSettings;
    } catch (error) {
      set({ error: error?.message || "Failed to create settings", loading: false });
      throw error;
    }
  },

  // Update settings (supports stored object OR array)
  updateSettings: async (id, settingsData) => {
    set({ loading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));

      const stored = safeParse(localStorage.getItem(STORAGE_KEY));
      const settings = normalize(stored);

      const targetId = String(id);

      if (Array.isArray(settings)) {
        const idx = settings.findIndex((x) => x && String(x.id) === targetId);
        if (idx === -1) throw new Error("Settings not found");

        const updatedOne = {
          ...settings[idx],
          ...settingsData,
          updated_at: new Date().toISOString(),
        };

        const updatedArr = [...settings];
        updatedArr[idx] = updatedOne;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArr));
        set({ settings: updatedArr, loading: false });

        return updatedOne;
      }

      if (!settings || typeof settings !== "object" || String(settings.id) !== targetId) {
        throw new Error("Settings not found");
      }

      const updatedSettings = {
        ...settings,
        ...settingsData,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      set({ settings: updatedSettings, loading: false });

      return updatedSettings;
    } catch (error) {
      set({ error: error?.message || "Failed to update settings", loading: false });
      throw error;
    }
  },

  // Delete settings (supports stored object OR array)
  deleteSettings: async (id) => {
    set({ loading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 200));

      const stored = safeParse(localStorage.getItem(STORAGE_KEY));
      const settings = normalize(stored);
      const targetId = String(id);

      if (Array.isArray(settings)) {
        const filtered = settings.filter((x) => x && String(x.id) !== targetId);
        if (filtered.length === settings.length) throw new Error("Settings not found");

        if (filtered.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          set({ settings: null, loading: false });
          return true;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        set({ settings: filtered, loading: false });
        return true;
      }

      if (!settings || typeof settings !== "object" || String(settings.id) !== targetId) {
        throw new Error("Settings not found");
      }

      localStorage.removeItem(STORAGE_KEY);
      set({ settings: null, loading: false });
      return true;
    } catch (error) {
      set({ error: error?.message || "Failed to delete settings", loading: false });
      throw error;
    }
  },

  // Clear
  clearSettings: () => set({ settings: null, error: null }),
}));
