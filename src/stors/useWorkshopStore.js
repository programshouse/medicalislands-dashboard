import { create } from "zustand";
import { toast } from "react-toastify";

const API_URL = "https://www.programshouse.com/dashboards/medical/api";

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
      
      const response = await fetch(`${API_URL}/workshops`, {
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
      
      const response = await fetch(`${API_URL}/workshops/${id}`, {
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

  // Create new workshop
  createWorkshop: async (workshopData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/workshops`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...workshopData,
          features: Array.isArray(workshopData.features) 
            ? workshopData.features 
            : workshopData.features.split(',').map(f => f.trim()).filter(f => f)
        }),
      });

      if (!response.ok) throw new Error("Failed to create workshop");
      
      const data = await response.json();
      const newWorkshop = data.data;
      
      set(state => ({ 
        workshops: [...state.workshops, newWorkshop],
        loading: false 
      }));
      
      toast.success("Workshop created successfully!");
      return newWorkshop;
    } catch (err) {
      set({ 
        error: err.message || "Failed to create workshop", 
        loading: false 
      });
      toast.error("Failed to create workshop");
      throw err;
    }
  },

  // Update workshop
  updateWorkshop: async (id, workshopData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/workshops/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...workshopData,
          features: Array.isArray(workshopData.features) 
            ? workshopData.features 
            : workshopData.features.split(',').map(f => f.trim()).filter(f => f)
        }),
      });

      if (!response.ok) throw new Error("Failed to update workshop");
      
      const data = await response.json();
      const updatedWorkshop = data.data;
      
      set(state => ({
        workshops: state.workshops.map(w => w.id === id ? updatedWorkshop : w),
        workshop: state.workshop?.id === id ? updatedWorkshop : state.workshop,
        loading: false
      }));
      
      toast.success("Workshop updated successfully!");
      return updatedWorkshop;
    } catch (err) {
      set({ 
        error: err.message || "Failed to update workshop", 
        loading: false 
      });
      toast.error("Failed to update workshop");
      throw err;
    }
  },

  // Delete workshop
  deleteWorkshop: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("access_token");
      
      const response = await fetch(`${API_URL}/workshops/${id}`, {
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
