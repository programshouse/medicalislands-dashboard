// src/stors/useServicesStore.js
import { create } from "zustand";
import { toast } from "react-toastify";

const API_URL = "https://www.programshouse.com/dashboards/medical/api";

const getToken = () => localStorage.getItem("access_token");

// ✅ accepts File | FileList | File[] | null
const pickFile = (img) => {
  if (!img) return null;
  if (img instanceof File) return img;
  if (img instanceof FileList) return img[0] ?? null;
  if (Array.isArray(img)) return img[0] ?? null;
  return null;
};

const extractData = (json) => json?.data ?? json;

const extractList = (json) => {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  return [];
};

export const useServicesStore = create((set, get) => ({
  services: [],
  service: null,
  loading: false,
  error: null,

  // Get all services
  getAllServices: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error("Failed to fetch services");

      const json = await response.json();
      const services = extractList(json);

      set({ services, loading: false });
      return services;
    } catch (err) {
      set({ error: err.message || "Failed to fetch services", loading: false });
      toast.error("Failed to load services");
      throw err;
    }
  },

  // Get service by ID
  getServiceById: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch service");

      const json = await response.json();
      const service = extractData(json);

      set({ service, loading: false });
      return service;
    } catch (err) {
      set({ error: err.message || "Failed to fetch service", loading: false });
      toast.error("Failed to load service");
      throw err;
    }
  },

  // ✅ Create service (FormData like Postman: title, description, image)
  createService: async (serviceData) => {
    try {
      set({ loading: true, error: null });

      const file = pickFile(serviceData?.image);
      console.log("serviceData:", serviceData);
      console.log("picked file:", file);
      console.log("image type:", typeof serviceData?.image, serviceData?.image?.constructor?.name);
      
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("title", serviceData?.title ?? "");
        formData.append("description", serviceData?.description ?? "");
        formData.append("image", file);

        response = await fetch(`${API_URL}/services`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            // ✅ DO NOT set Content-Type with FormData
          },
          body: formData,
        });
      } else {
        // fallback JSON (no file)
        response = await fetch(`${API_URL}/services`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: serviceData?.title ?? "",
            description: serviceData?.description ?? "",
            image: null,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create service: ${response.status} ${errorText}`
        );
      }

      const json = await response.json();
      const createdService = extractData(json);

      set((state) => ({
        services: [createdService, ...(state.services || [])],
        service: createdService,
        loading: false,
      }));

      toast.success("Service created successfully!");
      return createdService;
    } catch (err) {
      set({ error: err.message || "Failed to create service", loading: false });
      toast.error(err.message || "Failed to create service");
      throw err;
    }
  },

  // ✅ Update service
  updateService: async (id, serviceData) => {
    try {
      set({ loading: true, error: null });

      const file = pickFile(serviceData?.image);
      let response;

      if (file) {
        // FormData (file upload)
        const formData = new FormData();
        formData.append("title", serviceData?.title ?? "");
        formData.append("description", serviceData?.description ?? "");
        formData.append("image", file);
        formData.append("_method", "PUT"); // your backend expects this (like Postman update)

        response = await fetch(`${API_URL}/services/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });

        // If POST fails, try PATCH
        if (!response.ok) {
          response = await fetch(`${API_URL}/services/${id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
          });
        }
      } else {
        // JSON (text-only)
        response = await fetch(`${API_URL}/services/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: serviceData?.title ?? "",
            description: serviceData?.description ?? "",
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update service: ${response.status} ${errorText}`
        );
      }

      const json = await response.json();
      const updatedService = extractData(json);

      set((state) => ({
        services: (state.services || []).map((s) =>
          s.id === id ? updatedService : s
        ),
        service: state.service?.id === id ? updatedService : state.service,
        loading: false,
      }));

      toast.success("Service updated successfully!");
      return updatedService;
    } catch (err) {
      set({ error: err.message || "Failed to update service", loading: false });
      toast.error(err.message || "Failed to update service");
      throw err;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete service");

      set((state) => ({
        services: (state.services || []).filter((s) => s.id !== id),
        loading: false,
      }));

      toast.success("Service deleted successfully!");
      return true;
    } catch (err) {
      set({ error: err.message || "Failed to delete service", loading: false });
      toast.error(err.message || "Failed to delete service");
      throw err;
    }
  },

  // Clear current service
  clearService: () => set({ service: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));
