import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import apiService from 'src/services/apiService';

const DropdownSearch = (props) => {
  const { onChange, endpoint, label, filter, valueKey = 'id' } = props;

  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutesDD(currentPage, endpoint, searchTerm, filter);
  }, [currentPage, endpoint, searchTerm, filter]);

  const fetchRoutesDD = async (page, endpoint, search, filter) => {
    const form = new FormData();
    if (search) form.append('search', search);
    form.append('apitype', 'dropdown');
    
    filter.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        form.append(key, value);
      });
    });

    setLoading(true);
    try {
      const response = await apiService('POST', `${endpoint}?page=${page}`, form);
      const data = response.data.data || [];
      const mappedOptions = data.map(route => ({
        value: route[valueKey],
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
  filter: PropTypes.array.isRequired,
  valueKey: PropTypes.string,
};

export default React.memo(DropdownSearch);
