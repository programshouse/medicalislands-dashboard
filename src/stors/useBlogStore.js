// src/stors/useBlogStore.js
import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL, AXIOS_CONFIG } from "../config/config";

const api = axios.create({
  ...AXIOS_CONFIG,
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const useBlogStore = create((set, get) => ({
  // State
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  createdBlog: null,
  updatedBlog: null,

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/blogs");
      const blogs = response.data?.data || response.data || [];
      set({ blogs, loading: false });
      return blogs;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to fetch blogs";
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
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to fetch blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  // Create a new blog
  createBlog: async (blogData) => {
    set({ loading: true, error: null, createdBlog: null });
    try {
      const isFormData = blogData instanceof FormData;

      const response = await api.post("/blogs", blogData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });

      const newBlog = response.data?.data || response.data;

      set((state) => ({
        blogs: [newBlog, ...(state.blogs || [])],
        createdBlog: newBlog,
        loading: false,
      }));

      return newBlog;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to create blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  /**
   * Update blog
   * - JSON: PATCH /blogs/:id
   * - FormData: (Laravel safe) POST /blogs/:id with _method=PATCH
   */
  updateBlog: async (idOrObj, maybeBody) => {
    const id =
      typeof idOrObj === "string" || typeof idOrObj === "number"
        ? idOrObj
        : idOrObj?.id;

    const body = maybeBody ?? (typeof idOrObj === "object" ? idOrObj : {});
    if (!id) throw new Error("updateBlog: missing id");

    set({ loading: true, error: null, updatedBlog: null });

    try {
      const isFormData = body instanceof FormData;

      let response;

      if (isFormData) {
        // Ensure Laravel gets PATCH
        if (!body.has("_method")) body.append("_method", "PATCH");

        response = await api.post(`/blogs/${id}`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.patch(`/blogs/${id}`, body, {
          headers: { "Content-Type": "application/json" },
        });
      }

      const updated = response.data?.data ?? response.data;

      set({ updatedBlog: updated, loading: false });

      // refresh list (optional but useful)
      await get().fetchBlogs();

      return updated;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to update Blog";
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
        blogs: (state.blogs || []).filter((blog) => blog.id !== id),
        selectedBlog: state.selectedBlog?.id === id ? null : state.selectedBlog,
        loading: false,
      }));

      return true;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to delete blog";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },

  clearSelectedBlog: () => set({ selectedBlog: null }),
  clearError: () => set({ error: null }),
  clearCreatedBlog: () => set({ createdBlog: null }),
  clearUpdatedBlog: () => set({ updatedBlog: null }),
}));
