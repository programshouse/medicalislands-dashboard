// src/stors/useReviewStore.js
import { create } from "zustand";
import { toast } from "react-toastify";

const API_URL = "https://www.programshouse.com/dashboards/medical/api";

const getToken = () => localStorage.getItem("access_token");

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

export const useReviewStore = create((set) => ({
  reviews: [],
  review: null,
  loading: false,
  error: null,

  // Get all reviews
  getAllReviews: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const json = await response.json();
      const reviews = extractList(json);

      set({ reviews, loading: false });
      return reviews;
    } catch (err) {
      set({ error: err.message || "Failed to fetch reviews", loading: false });
      toast.error("Failed to load reviews");
      throw err;
    }
  },

  // Get review by ID
  getReviewById: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch review");

      const json = await response.json();
      const review = extractData(json);

      set({ review, loading: false });
      return review;
    } catch (err) {
      set({ error: err.message || "Failed to fetch review", loading: false });
      toast.error("Failed to load review");
      throw err;
    }
  },

  // Create review (FormData like Postman: review, user_name, user_job, user_image, is_active)
  createReview: async (reviewData) => {
    try {
      set({ loading: true, error: null });

      const file = pickFile(reviewData?.user_image);
      console.log("reviewData:", reviewData);
      console.log("picked file:", file);
      console.log("image type:", typeof reviewData?.user_image, reviewData?.user_image?.constructor?.name);
      
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("review", reviewData?.review ?? "");
        formData.append("user_name", reviewData?.user_name ?? "");
        formData.append("user_job", reviewData?.user_job ?? "");
        formData.append("image", file); // Backend expects 'image' not 'user_image'
        formData.append("is_active", reviewData?.is_active ?? 1);

        response = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review: reviewData?.review ?? "",
            user_name: reviewData?.user_name ?? "",
            user_job: reviewData?.user_job ?? "",
            user_image: null,
            is_active: reviewData?.is_active ?? 1,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create review: ${response.status} ${errorText}`);
      }

      const json = await response.json();
      const createdReview = extractData(json);

      set((state) => ({
        reviews: [createdReview, ...(state.reviews || [])],
        review: createdReview,
        loading: false,
      }));

      toast.success("Review created successfully!");
      return createdReview;
    } catch (err) {
      set({ error: err.message || "Failed to create review", loading: false });
      toast.error(err.message || "Failed to create review");
      throw err;
    }
  },

  // Update review
  updateReview: async (id, reviewData) => {
    try {
      set({ loading: true, error: null });

      const file = pickFile(reviewData?.user_image);
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("review", reviewData?.review ?? "");
        formData.append("user_name", reviewData?.user_name ?? "");
        formData.append("user_job", reviewData?.user_job ?? "");
        formData.append("user_image", file);
        formData.append("is_active", reviewData?.is_active ?? 1);
        formData.append("_method", "PUT");

        response = await fetch(`${API_URL}/reviews/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });

        if (!response.ok) {
          response = await fetch(`${API_URL}/reviews/${id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
          });
        }
      } else {
        response = await fetch(`${API_URL}/reviews/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review: reviewData?.review ?? "",
            user_name: reviewData?.user_name ?? "",
            user_job: reviewData?.user_job ?? "",
            is_active: reviewData?.is_active ?? 1,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update review: ${response.status} ${errorText}`
        );
      }

      const json = await response.json();
      const updatedReview = extractData(json);

      set((state) => ({
        reviews: (state.reviews || []).map((r) =>
          r.id === id ? updatedReview : r
        ),
        review: state.review?.id === id ? updatedReview : state.review,
        loading: false,
      }));

      toast.success("Review updated successfully!");
      return updatedReview;
    } catch (err) {
      set({ error: err.message || "Failed to update review", loading: false });
      toast.error(err.message || "Failed to update review");
      throw err;
    }
  },

  // Delete review
  deleteReview: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete review");

      set((state) => ({
        reviews: (state.reviews || []).filter((r) => r.id !== id),
        loading: false,
      }));

      toast.success("Review deleted successfully!");
      return true;
    } catch (err) {
      set({ error: err.message || "Failed to delete review", loading: false });
      toast.error(err.message || "Failed to delete review");
      throw err;
    }
  },

  // Clear current review
  clearReview: () => set({ review: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));
