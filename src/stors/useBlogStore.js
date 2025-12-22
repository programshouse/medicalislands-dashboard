import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "https://www.programshouse.com/dashboards/medical/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const useBlogStore = create((set) => ({
  // State
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  createdBlog: null,

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/blogs');
      const blogs = response.data?.data || response.data || [];
      set({ blogs, loading: false });
      return blogs;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to fetch blogs";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  // Fetch a single blog by ID
  fetchBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/blogs/${id}`);
      const blog = response.data?.data || response.data;
      set({ selectedBlog: blog, loading: false });
      return blog;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to fetch blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  // Create a new blog
  createBlog: async (blogData) => {
    set({ loading: true, error: null, createdBlog: null });
    try {
      console.log("Creating blog with data:", blogData);
      
      const isFormData = blogData instanceof FormData;
      const response = await api.post('/blogs', blogData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      
      console.log("Blog creation response:", response.data);
      const newBlog = response.data?.data || response.data;
      
      set((state) => ({
        blogs: [newBlog, ...(state.blogs || [])],
        createdBlog: newBlog,
        loading: false,
      }));

      return newBlog;
    } catch (err) {
      console.error("Blog creation error in store:", err);
      console.error("Error response:", err?.response);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to create blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  // Update an existing blog
  updateBlog: async (id, blogData) => {
    set({ loading: true, error: null });
    try {
      const isFormData = blogData instanceof FormData;
      const response = await api.put(`/blogs/${id}`, blogData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      const updatedBlog = response.data?.data || response.data;

      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? { ...blog, ...updatedBlog } : blog
        ),
        selectedBlog: state.selectedBlog?.id === id 
          ? { ...state.selectedBlog, ...updatedBlog } 
          : state.selectedBlog,
        loading: false,
      }));

      return updatedBlog;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to update blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
},

  // Delete a blog
  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/blogs/${id}`);

      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        selectedBlog: state.selectedBlog?.id === id ? null : state.selectedBlog,
        loading: false,
      }));

      return true;
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to delete blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  // Clear selected blog
  clearSelectedBlog: () => {
    set({ selectedBlog: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset created blog
  clearCreatedBlog: () => {
    set({ createdBlog: null });
  },
}));
