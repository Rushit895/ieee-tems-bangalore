import axios from 'axios';
import { BACKEND_BASE } from '../config';

// Targets the backend directly via BACKEND_BASE (Render in prod, localhost in dev).
// Empty BACKEND_BASE falls back to a relative '/api' (same-origin / Vite proxy).
const API_BASE_URL = `${BACKEND_BASE}/api`;

async function apiCall(method, url, data = null, config = {}) {
  try {
    // Do NOT manually set Content-Type for FormData — let axios/browser set it
    // automatically so the multipart boundary is included correctly.
    const token = localStorage.getItem('adminToken');
    const headers = { ...(config.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      ...config,
      headers,
      // Increase timeout to 5 minutes for large video uploads
      timeout: 300000,
    });

    console.log(`[API] ${method.toUpperCase()} ${url} → ${response.status}`, JSON.stringify(response.data).slice(0, 200));

    if (response.status >= 400) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.data;

  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "An unknown network error occurred.";
    console.error(`[API ERROR] ${method.toUpperCase()} ${url}:`, errorMessage);
    throw new Error(errorMessage);
  }
}

export const fetchEvents = () => apiCall('get', '/events');
export const createEvent = (data) => apiCall('post', '/events', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEvent = (id, data) => apiCall('put', `/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteEvent = (id) => apiCall('delete', `/events/${id}`);

export const fetchTeam = () => apiCall('get', '/team');
export const createTeamMember = (data) => apiCall('post', '/team', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateTeamMember = (id, data) => apiCall('put', `/team/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteTeamMember = (id) => apiCall('delete', `/team/${id}`);

export const fetchBlogs = () => apiCall('get', '/blogs');
export const createBlog = (data) => apiCall('post', '/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, data) => apiCall('put', `/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => apiCall('delete', `/blogs/${id}`);

export const fetchBranches = () => apiCall('get', '/branches');
export const createBranch = (data) => apiCall('post', '/branches', data);
export const updateBranch = (id, data) => apiCall('put', `/branches/${id}`, data);
export const deleteBranch = (id) => apiCall('delete', `/branches/${id}`);

export const fetchGallery = () => apiCall('get', '/gallery');
export const uploadGalleryImage = (formData) => apiCall('post', '/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteGalleryImage = (id) => apiCall('delete', `/gallery/${id}`);

export const fetchMessages = () => apiCall('get', '/messages');
export const updateMessageStatus = (id, status) => apiCall('put', `/messages/${id}`, { status });
export const deleteMessage = (id) => apiCall('delete', `/messages/${id}`);

export const fetchResources = () => apiCall('get', '/resources');
export const createResource = (data) => apiCall('post', '/resources', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateResource = (id, data) => apiCall('put', `/resources/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteResource = (id) => apiCall('delete', `/resources/${id}`);

export const fetchExams = (params) => apiCall('get', '/exams', null, { params });
export const createExam = (data) => apiCall('post', '/exams', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateExam = (id, data) => apiCall('put', `/exams/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteExam = (id) => apiCall('delete', `/exams/${id}`);

export const fetchHomeSection = (section) => apiCall('get', `/home/${section}`);
export const createHomeEntry = (section, data) => apiCall('post', `/home/${section}`, data);
export const updateHomeEntry = (section, id, data) => apiCall('put', `/home/${section}/${id}`, data);
export const deleteHomeEntry = (section, id) => apiCall('delete', `/home/${section}/${id}`);

export const fetchPastExeCom = () => apiCall('get', '/past-execom');
export const createPastExeComMember = (data) => apiCall('post', '/past-execom', data);
export const updatePastExeComMember = (id, data) => apiCall('put', `/past-execom/${id}`, data);
export const deletePastExeComMember = (id) => apiCall('delete', `/past-execom/${id}`);

