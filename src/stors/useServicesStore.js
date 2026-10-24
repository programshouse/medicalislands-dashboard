// src/stors/useServicesStore.js
import { create } from "zustand";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/config";
import { saveMultipart } from "./multipartRequest";

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

export const useServicesStore = create((set) => ({
  services: [],
  service: null,
  loading: false,
  error: null,

  // Get all services
  getAllServices: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/services`, {
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

      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
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

  createService: async (serviceData) => {
    set({ loading: true, error: null });
    try {
      const createdService = await saveMultipart("services", serviceData);
      set(state => ({ services: [createdService, ...state.services], service: createdService, loading: false }));
      toast.success("Service created successfully!");
      return createdService;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
      throw err;
    }
  },

  updateService: async (id, serviceData) => {
    set({ loading: true, error: null });
    try {
      const updatedService = await saveMultipart("services", serviceData, id);
      set(state => ({
        services: state.services.map(s => String(s.id) === String(id) ? updatedService : s),
        service: updatedService,
        loading: false,
      }));
      toast.success("Service updated successfully!");
      return updatedService;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
      throw err;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
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
