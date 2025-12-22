// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Utils */
const isFormData = (v) => typeof FormData !== 'undefined' && v instanceof FormData;

/** Convert a plain object to FormData (skips null/undefined). Supports files. */
const toFormData = (obj = {}) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    // Allow arrays/objects via JSON if they aren't File/Blob
    if (Array.isArray(v) || (typeof v === 'object' && !(v instanceof File) && !(v instanceof Blob))) {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, v);
    }
  });
  return fd;
};

/** Post/Put helper that accepts either plain object or FormData */
const sendMultipart = (method, url, data) => {
  const body = isFormData(data) ? data : toFormData(data);
  return api.request({
    method,
    url,
    data: body,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If caller passed FormData directly and forgot headers, fix it
    if (config.data && isFormData(config.data)) {
      config.headers['Content-Type'] = 'multipart/form-data';
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

/* ======================
   Profile API
   - Accepts FormData or plain object for update
   ====================== */
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => {
    // Your UI sends FormData already; we still support object input
    return isFormData(data)
      ? api.put('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      : sendMultipart('put', '/profile', data);
  },
};

/* ======================
   Workshops API
   ====================== */
export const workshopsAPI = {
  getAll: () => api.get('/workshops'),
  getById: (id) => api.get(`/workshops/${id}`),
  create: (data) =>
    sendMultipart('post', '/workshops', {
      title: data.title,
      description: data.description,
      duration: data.duration,
      video: data.video || undefined,
      image: data.image || undefined,
    }),
  update: (id, data) =>
    sendMultipart('put', `/workshops/${id}`, {
      title: data.title,
      description: data.description,
      duration: data.duration,
      video: data.video || undefined,
      image: data.image || undefined,
    }),
  delete: (id) => api.delete(`/workshops/${id}`),
};

/* ======================
   Services API
   ====================== */
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) =>
    sendMultipart('post', '/services', {
      title: data.title,
      description: data.description,
      image: data.image || undefined,
    }),
  update: (id, data) =>
    sendMultipart('put', `/services/${id}`, {
      title: data.title,
      description: data.description,
      image: data.image || undefined,
    }),
  delete: (id) => api.delete(`/services/${id}`),
};

/* ======================
   Blogs API
   ====================== */
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => {
    // works with TinyMCE form: title, description(HTML), category, image(optional)
    // Accept either object or FormData
    if (isFormData(data)) {
      return api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return sendMultipart('post', '/blogs', {
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image || undefined,
    });
  },
  update: (id, data) => {
    if (isFormData(data)) {
      return api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return sendMultipart('put', `/blogs/${id}`, {
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image || undefined,
    });
  },
  delete: (id) => api.delete(`/blogs/${id}`),
};

/* ======================
   Reviews API  (NEW)
   name, description, image (optional)
   ====================== */
export const reviewsAPI = {
  list: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => {
    if (isFormData(data)) {
      return api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return sendMultipart('post', '/reviews', {
      name: data.name,
      description: data.description,
      image: data.image || undefined,
    });
  },
  update: (id, data) => {
    if (isFormData(data)) {
      return api.post(`/reviews/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      // ^ if your backend expects PUT directly, swap to:
      // return api.put(`/reviews/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    // If your backend needs method override, keep POST+_method=PUT; otherwise change to PUT
    return sendMultipart('post', `/reviews/${id}?<_method=PUT>`.replace('<', ''), {
      name: data.name,
      description: data.description,
      image: data.image || undefined,
    });
  },
  delete: (id) => api.delete(`/reviews/${id}`),
};

/* ======================
   Contact API (JSON)
   ====================== */
export const contactAPI = {
  getAll: () => api.get('/contacts'),
  create: (data) => api.post('/contacts', data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

export default api;
