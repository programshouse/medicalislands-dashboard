import { create } from "zustand";

const API_URL = "https://www.programshouse.com/dashboards/medical/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
});

const jsonHeaders = () => ({
  ...authHeaders(),
  Accept: "application/json",
});

const mapApiToFormLike = (data) => {
  if (!data) return null;

  return {
    ...data, // keep API keys: site_name, facebook, etc
    siteName: data.siteName || data.site_name || "",
    socials: {
      facebook: data.facebook || "",
      whatsapp: data.whatsapp || "",
      instagram: data.instagram || "",
      twitter: data.twitter || "",
      linkedin: data.linkedin || "",
    },
  };
};

const buildFormDataFromForm = (form) => {
  const fd = new FormData();

  fd.append("site_name", form?.siteName ?? "");
  fd.append("email", form?.email ?? "");
  fd.append("phone", form?.phone ?? "");
  fd.append("address", form?.address ?? "");

  fd.append("facebook", form?.socials?.facebook ?? "");
  fd.append("instagram", form?.socials?.instagram ?? "");
  fd.append("linkedin", form?.socials?.linkedin ?? "");
  fd.append("twitter", form?.socials?.twitter ?? "");
  fd.append("whatsapp", form?.socials?.whatsapp ?? "");

  return fd;
};

export const useSettingsStore = create((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  // GET /settings (returns object)
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "GET",
        headers: jsonHeaders(),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to fetch settings");
      }

      const data = await res.json();
      const normalized = mapApiToFormLike(data);

      set({ settings: normalized, loading: false });
      return normalized;
    } catch (e) {
      set({ error: e?.message || "Failed to fetch settings", loading: false });
      throw e;
    }
  },

  // If API doesn't support /settings/{id}, we still can just fetch.
  getSettingsById: async (id) => {
    // If later you add an endpoint like /settings/show?id=, update here.
    return get().fetchSettings();
  },

  // POST /settings/save (form-data)
  updateSettings: async (form) => {
    set({ loading: true, error: null });
    try {
      const fd = buildFormDataFromForm(form);

      const res = await fetch(`${API_URL}/settings/save`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          Accept: "application/json",
          // DO NOT set Content-Type with FormData
        },
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to save settings");
      }

      const json = await res.json();
      const saved = mapApiToFormLike(json?.data || json);

      set({ settings: saved, loading: false });
      return saved;
    } catch (e) {
      set({ error: e?.message || "Failed to save settings", loading: false });
      throw e;
    }
  },

  // DELETE /settings/delete
  deleteSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/settings/delete`, {
        method: "DELETE",
        headers: jsonHeaders(),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to delete settings");
      }

      set({ settings: null, loading: false });
      return true;
    } catch (e) {
      set({ error: e?.message || "Failed to delete settings", loading: false });
      throw e;
    }
  },

  clearSettings: () => set({ settings: null, error: null }),
}));
