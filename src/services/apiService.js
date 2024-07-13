const API_URL = 'https://dev.tourkokan.com/admin/v2';

const getToken = () => {
  return localStorage.getItem('token');
};

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
  const config = {
    method: method.toUpperCase(),
    headers: {
      'Authorization': `Bearer ${getToken()}`,
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

  const response = await fetch(`${API_URL}/${endpoint}`, config);
  return handleResponse(response);
};

export default apiService;
