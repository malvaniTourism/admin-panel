import { API_BASE_URL, FTP_BASE_URL } from 'src/services/endpoints';

const API_URL = '/api';

const handleResponse = async (response) => {
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        if (data.message && data.message.status) {
            throw new Error(data.message.status[0]);
        } else {
            throw new Error('Network response was not ok');
        }
    }
    return data;
};

const apiService = async (method, endpoint, body = null) => {
    const token = localStorage.getItem('token'); // Retrieve token dynamically

    const config = {
        method: method.toUpperCase(),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
        // Remove Content-Type header for FormData as it needs to be set automatically by the browser
        if (body instanceof FormData) {
            delete config.headers['Content-Type'];
        }
    }

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, config);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Network error occurred');
    }
};

export default apiService;
