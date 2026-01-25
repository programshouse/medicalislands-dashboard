// src/config/api.js
// Centralized API configuration for the medical dashboard

// Base API URL - can be overridden by environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.programshouse.com/dashboards/medical/api';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    PROFILE: '/profile',
  },
  
  // Blogs
  BLOGS: '/blogs',
  
  // Services
  SERVICES: '/services',
  
  // Workshops
  WORKSHOPS: '/workshops',
  
  // Reviews
  REVIEWS: '/reviews',
  
  // Settings
  SETTINGS: '/settings',
  
  // Contacts
  CONTACTS: '/contacts',
  
  // Images
  IMAGES: '/images',
  
  // Data/Sliders
  DATA: '/data',
  SLIDERS: '/sliders',
};

// Helper function to get full API URL for an endpoint
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Default axios configuration
export const AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
};
