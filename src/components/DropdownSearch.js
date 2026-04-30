import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import apiService from 'src/services/apiService';

const getSelectStyles = () => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#998fed' : '#b1b7c1',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(50,31,219,.25)' : 'none',
    color: '#212631',
    '&:hover': { borderColor: '#998fed' },
    minHeight: '36px',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,21,.15)',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#321fdb' : state.isFocused ? 'rgba(0,0,21,.05)' : '#fff',
    color: state.isSelected ? '#fff' : '#212631',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#212631',
  }),
  input: (base) => ({
    ...base,
    color: '#212631',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9da5b1',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: '#b1b7c1',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#9da5b1',
    '&:hover': { color: '#212631' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#9da5b1',
    '&:hover': { color: '#212631' },
  }),
});

const DropdownSearch = ({ onChange, endpoint, label, filter, valueKey = 'id' }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const filterKey = JSON.stringify(filter);
  const debounceTimer = useRef(null);

  useEffect(() => {
    fetchOptions(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, endpoint, searchTerm, filterKey]);

  const fetchOptions = async (page, search) => {
    const form = new FormData();
    if (search) form.append('search', search);
    form.append('apitype', 'dropdown');

    filter.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        form.append(key, value);
      });
    });

    setLoading(true);
    try {
      const response = await apiService('POST', `${endpoint}?page=${page}`, form);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setOptions(
        data.map((item) => ({ value: item[valueKey], label: item.name }))
      );
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) onChange(option ? option.value : null);
  };

  const handleInputChange = (value) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (value.length >= 2 || value.length === 0) {
        setSearchTerm(value);
        setCurrentPage(1);
      }
    }, 500);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      isLoading={loading}
      placeholder={label}
      isClearable
      styles={getSelectStyles()}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
      maxMenuHeight={200}
    />
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
