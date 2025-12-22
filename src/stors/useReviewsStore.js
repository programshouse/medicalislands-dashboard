import { create } from 'zustand';
import { reviewsAPI } from '../services/api';

const useReviewsStore = create((set) => ({
  reviews: [],
  currentReview: null,
  loading: false,
  error: null,

  // Fetch all reviews
  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await reviewsAPI.list();
      set({ reviews: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Fetch single review by ID
  fetchReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await reviewsAPI.getById(id);
      set({ currentReview: data, loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching review:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create new review
  createReview: async (reviewData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await reviewsAPI.create(reviewData);
      set(state => ({ 
        reviews: [...state.reviews, data],
        loading: false 
      }));
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update existing review
  updateReview: async (id, reviewData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await reviewsAPI.update(id, reviewData);
      set(state => ({
        reviews: state.reviews.map(review => 
          review.id === id ? { ...review, ...data } : review
        ),
        currentReview: state.currentReview?.id === id ? { ...state.currentReview, ...data } : state.currentReview,
        loading: false
      }));
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete review
  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      await reviewsAPI.delete(id);
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== id),
        currentReview: state.currentReview?.id === id ? null : state.currentReview,
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Clear current review
  clearCurrentReview: () => set({ currentReview: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    reviews: [],
    currentReview: null,
    loading: false,
    error: null
  })
}));

export default useReviewsStore;
