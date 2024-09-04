import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { CFormSelect } from '@coreui/react';
import apiService from 'src/services/apiService'; // Import your API service

const DropdownStatic = ({ onChange, endpoint, label }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions(endpoint);
  }, [endpoint]);

  const fetchOptions = async (endpoint) => {
    setLoading(true);
    try {
      const response = await apiService('POST', endpoint);
      setOptions(response.data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    if (onChange) {
      onChange(value); // Call parent component's onChange function if provided
    }
  };

  return (
    <div className="example">
      {loading ? (
        <p>Loading options...</p>
      ) : (
        <CFormSelect id="specificSizeSelect" name="select" onChange={handleSelectChange}>
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </CFormSelect>
      )}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

DropdownStatic.propTypes = {
  onChange: PropTypes.func,
  endpoint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(DropdownStatic);
