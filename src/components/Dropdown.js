import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { CFormSelect } from '@coreui/react';
import apiService from 'src/services/apiService'; // Import your API service

const DropdownSearch = (props) => {
  const { onChange, endpoint,label } = props; // Destructure props to get onChange function, endpoint, and queryParams

  const [routes, setRoutes] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    search: ''
  });

  useEffect(() => {
    fetchRoutesDD(currentPage, endpoint);
  }, [currentPage, endpoint]);

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchRoutesDD = async (page, endpoint) => {
    const form = new FormData();
    if (formData.search) form.append('search', formData.search);
    form.append('apitype', 'dropdown');
    form.append('type', 'bus');

    setLoading(true);
    try {
      const data = await apiService('POST', `${endpoint}?page=${page}`, form);
      setRoutes(data.data.data || []);
      setLinks(data.data.links || []);
      setTotalPages(data.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching routes:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    // Handle any onChange logic here if needed
    if (onChange) {
      onChange(value); // Call parent component's onChange function if provided
    }
  };

  return (
    <div className="example">
      {loading ? (
        <p>Loading routes...</p>
      ) : (
        <CFormSelect id="specificSizeSelectRoute" name="route" onChange={handleSelectChange}>
          <option value="">{label}</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </CFormSelect>
      )}
    </div>
  );
};

DropdownSearch.propTypes = {
  onChange: PropTypes.func, // PropType for onChange function, if needed
  endpoint: PropTypes.string.isRequired, // PropType for API endpoint (required)
  label: PropTypes.string.isRequired,
};

export default React.memo(DropdownSearch);
