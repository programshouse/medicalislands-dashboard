import { create } from "zustand";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/config";
import { saveMultipart } from "./multipartRequest";

export const useWorkshopStore = create((set) => ({
  workshops: [],
  workshop: null,
  loading: false,
  error: null,

  // Get all workshops
  getAllWorkshops: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      console.log('Making request to:', `${API_BASE_URL}/workshops`);
      
      const response = await fetch(`${API_BASE_URL}/workshops`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch workshops");
      
      const data = await response.json();
      set({ workshops: data.data || [], loading: false });
      return data.data || [];
    } catch (err) {
      set({ 
        error: err.message || "Failed to fetch workshops", 
        loading: false 
      });
      toast.error("Failed to load workshops");
      throw err;
    }
  },

  // Get workshop by ID
  getWorkshopById: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch workshop");
      
      const data = await response.json();
      set({ workshop: data.data, loading: false });
      return data.data;
    } catch (err) {
      set({ 
        error: err.message || "Failed to fetch workshop", 
        loading: false 
      });
      toast.error("Failed to load workshop");
      throw err;
    }
  },

  createWorkshop: async (workshopData) => {
    set({ loading: true, error: null });
    try {
      const created = await saveMultipart("workshops", workshopData);
      set(state => ({ workshops: [created, ...state.workshops], workshop: created, loading: false }));
      toast.success("Workshop created successfully!");
      return created;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
      throw err;
    }
  },

  updateWorkshop: async (id, workshopData) => {
    set({ loading: true, error: null });
    try {
      const updated = await saveMultipart("workshops", workshopData, id);
      set(state => ({
        workshops: state.workshops.map(w => String(w.id) === String(id) ? updated : w),
        workshop: updated,
        loading: false,
      }));
      toast.success("Workshop updated successfully!");
      return updated;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
      throw err;
    }
  },

  // Delete workshop
  deleteWorkshop: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete workshop");
      
      set(state => ({
        workshops: state.workshops.filter(w => w.id !== id),
        workshop: state.workshop?.id === id ? null : state.workshop,
        loading: false
      }));
      
      toast.success("Workshop deleted successfully!");
    } catch (err) {
      set({ 
        error: err.message || "Failed to delete workshop", 
        loading: false 
      });
      toast.error("Failed to delete workshop");
      throw err;
    }
  },

  // Clear current workshop
  clearWorkshop: () => set({ workshop: null }),
  
  // Clear error
  clearError: () => set({ error: null }),
}));
