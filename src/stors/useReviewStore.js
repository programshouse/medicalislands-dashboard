// src/stors/useReviewStore.js
import { create } from "zustand";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/config";

const getToken = () => localStorage.getItem("access_token");

const pickFile = (img) => {
  if (!img) return null;
  if (img instanceof File) return img;
  if (img instanceof FileList) return img[0] ?? null;
  if (Array.isArray(img)) return img[0] ?? null;
  if (img?.file instanceof File) return img.file;
  // if FileUpload sends {target:{value:file}}
  if (img?.target?.value instanceof File) return img.target.value;
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

  getAllReviews: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/reviews`, {
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

  getReviewById: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
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

  // ✅ Create
  createReview: async (reviewData) => {
    try {
      set({ loading: true, error: null });

      const file = pickFile(reviewData?.user_image);
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("review", reviewData?.review ?? "");
        formData.append("user_name", reviewData?.user_name ?? "");
        formData.append("user_job", reviewData?.user_job ?? "");
        formData.append("user_image", file); // ✅ correct key
        formData.append("is_active", String(reviewData?.is_active ?? 1));

        response = await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/reviews`, {
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

// ✅ Update review (force refresh image)
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
      formData.append("is_active", String(reviewData?.is_active ?? 1));

      // PATCH multipart like Postman
      response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      // fallback
      if (!response.ok) {
        formData.append("_method", "PATCH");
        response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
      }
    } else {
      response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
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
      throw new Error(`Failed to update review: ${response.status} ${errorText}`);
    }

    const json = await response.json();
    let updatedReview = extractData(json);

    // ✅ if backend returns null/old image, refetch show endpoint once
    // (this is the safest way when API response is not updated)
    if (file && (!updatedReview?.user_image || updatedReview?.user_image === null)) {
      const showRes = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (showRes.ok) {
        const showJson = await showRes.json();
        updatedReview = extractData(showJson) || updatedReview;
      }
    }

    // ✅ cache bust image url so browser shows the new file immediately
    if (updatedReview?.user_image && typeof updatedReview.user_image === "string") {
      const ts = Date.now();
      const sep = updatedReview.user_image.includes("?") ? "&" : "?";
      updatedReview = {
        ...updatedReview,
        user_image: `${updatedReview.user_image}${sep}t=${ts}`,
      };
    }

    set((state) => ({
      reviews: (state.reviews || []).map((r) =>
        String(r.id) === String(id) ? updatedReview : r
      ),
      review: String(state.review?.id) === String(id) ? updatedReview : state.review,
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


  deleteReview: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error("Failed to delete review");

      set((state) => ({
        reviews: (state.reviews || []).filter((r) => String(r.id) !== String(id)),
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

  clearReview: () => set({ review: null }),
  clearError: () => set({ error: null }),
}));
