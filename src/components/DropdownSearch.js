import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import apiService from 'src/services/apiService';

const DropdownSearch = (props) => {
  const { onChange, endpoint, label } = props;

  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutesDD(currentPage, endpoint, searchTerm);
  }, [currentPage, endpoint, searchTerm]);

  const fetchRoutesDD = async (page, endpoint, search) => {
    const form = new FormData();
    if (search) form.append('search', search);
    form.append('apitype', 'dropdown');
    form.append('type', 'bus');

    setLoading(true);
    try {
      const response = await apiService('POST', `${endpoint}?page=${page}`, form);
      const data = response.data.data || [];
      const mappedOptions = data.map(route => ({
        value: route.id,
        label: route.name
      }));
      setOptions(mappedOptions);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (onChange) {
      onChange(selectedOption ? selectedOption.value : null);
    }
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleInputChange = debounce((value) => {
    if (value.length >= 2) {
      setSearchTerm(value);
      setCurrentPage(1);
    }
  }, 500);

  return (
    <div className="example">
      <Select
        value={selectedOption}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        isLoading={loading}
        placeholder={label}
        isClearable
      />
    </div>
  );
};

DropdownSearch.propTypes = {
  onChange: PropTypes.func,
  endpoint: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(DropdownSearch);
