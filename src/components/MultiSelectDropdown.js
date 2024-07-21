import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import apiService from 'src/services/apiService';

const MultiSelectDropdown = ({ onChange, endpoint, label, filter, valueKey = 'id' }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOptions(currentPage, endpoint, searchTerm, filter);
    }, [currentPage, endpoint, searchTerm, filter]);

    const fetchOptions = async (page, endpoint, search, filter) => {
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
            const mappedOptions = data.map(option => ({
                value: option[valueKey],
                label: option.name
            }));
            setOptions(mappedOptions);
            setTotalPages(response.data.last_page || 1);
        } catch (error) {
            console.error('Error fetching options:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        if (onChange) {
            onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
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
                value={selectedOptions}
                onChange={handleChange}
                onInputChange={handleInputChange}
                options={options}
                isLoading={loading}
                placeholder={label}
                isMulti
                isClearable
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

MultiSelectDropdown.propTypes = {
    onChange: PropTypes.func,
    endpoint: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filter: PropTypes.array.isRequired,
    valueKey: PropTypes.string,
};

export default React.memo(MultiSelectDropdown);
