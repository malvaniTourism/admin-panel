import { API_BASE_URL, FTP_BASE_URL } from 'src/services/endpoints';

const API_URL = '/api';

// Public endpoint (no auth, /api/v2/ base instead of /admin/v2/)
const PUBLIC_BASE_URL = API_BASE_URL?.replace('/admin/v2', '/api/v2');

export const publicApiService = async (endpoint) => {
  const response = await fetch(`${PUBLIC_BASE_URL}/${endpoint}`);
  const data = await response.json();
  return data;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.hash = '#/login';
        throw new Error('Session expired. Please log in again.');
    }
    const data = await response.json();
    if (!response.ok) {
        if (data.message && data.message.status) {
            throw new Error(data.message.status[0]);
        } else if (typeof data.message === 'string') {
            throw new Error(data.message);
        } else {
            throw new Error('Network response was not ok');
        }
    }
    return data;
};

const apiService = async (method, endpoint, body = null) => {
    const token = localStorage.getItem('token');

    const config = {
        method: method.toUpperCase(),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
        if (body instanceof FormData) {
            delete config.headers['Content-Type'];
        }
    }

    const response = await fetch(`${API_URL}/${endpoint}`, config);
    return handleResponse(response);
};

export default apiService;
