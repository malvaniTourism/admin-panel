import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CImage
} from '@coreui/react';
import apiService from 'src/services/apiService';
import DropdownSearch from '../../components/DropdownSearch';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    parent_id: '',
    category: '',
    categories: '',
    user_id: '',
    bus_stop_type: '',
    tag_line: '',
    description: '',
    domain_name: '',
    logo: '',
    icon: '',
    image: '',
    status: '',
    latitude: '',
    longitude: '',
    pin_code: '',
    speciality: '{}',
    rules: '{}',
    social_media: '{}',
    meta_data: '{}',
  });

  useEffect(() => {
    if (showEditModal) {
      // Set initial form data when the modal opens
      setInitialFormData({ ...formData });
    }
    fetchSites(currentPage);
  }, [currentPage, showEditModal]);

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchSites = async (page) => {
    const token = localStorage.getItem('token');
    const dataToSubmit = new FormData();
    dataToSubmit.append('apitype', 'list');
    dataToSubmit.append('global', 1);
    if (formData.category) dataToSubmit.append('category', formData.category);
    if (formData.parent_id) dataToSubmit.append('parent_id', formData.parent_id);

    setLoading(true);
    try {
      const data = await apiService('POST', `sites?page=${page}`, dataToSubmit);

      if (data.success === false) {
        showAlert(data?.message || 'Something went wrong');
        return;
      }

      if (data && data.data) {
        setSites(data.data.data || []);
        setLinks(data.data.links || []);
        setTotalPages(data.data.last_page || 1);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (id) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      parent_id: id,
      category: '',
    }));
  };

  const handleCategoryDropdownChange = (id) => {
    setFormData({ ...formData, category: id });
  };

  const handleSearch = () => {
    if (!formData.parent_id && !formData.category) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        category: 'city',
      }));
    }
    setCurrentPage(1);
    fetchSites(1);
  };

  const handlePaginationClick = (label) => {
    if (label === '&laquo; Previous') {
      setCurrentPage(currentPage - 1);
    } else if (label === 'Next &raquo;') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(parseInt(label));
    }
  };

  const renderPaginationLabel = (label) => {
    return label.replace('&laquo;', '').replace('&raquo;', '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleAddSite = async () => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      // form.append(key, formData[key]);
      console.log(key, formData[key]);
    });
    if (formData.id) form.append('id', formData.id)
    if (formData.name) form.append('name', formData.name)
    if (formData.parent_id) form.append('parent_id', formData.parent_id)
    if (formData.user_id) form.append('user_id', formData.user_id)
    if (formData.categories && formData.categories.length > 0)
      form.append('categories', JSON.stringify(formData.categories))
    if (formData.bus_stop_type) form.append('bus_stop_type', formData.bus_stop_type)
    if (formData.tag_line) form.append('tag_line', formData.tag_line)
    if (formData.description) form.append('description', formData.description)
    if (formData.domain_name) form.append('domain_name', formData.domain_name)
    if (formData.logo) form.append('logo', formData.logo)
    if (formData.icon) form.append('icon', formData.icon)
    if (formData.image) form.append('image', formData.image)
    form.append('status', formData.status ? '1' : '0')
    if (formData.latitude) form.append('latitude', formData.latitude)
    if (formData.longitude) form.append('longitude', formData.longitude)
    if (formData.pin_code) form.append('pin_code', formData.pin_code)
    if (formData.speciality) form.append('speciality', formData.speciality)
    if (formData.rules) form.append('rules', formData.rules)
    if (formData.social_media) form.append('social_media', formData.social_media)
    if (formData.meta_data) form.append('meta_data', formData.meta_data)

    setLoading(true);
    try {
      const data = await apiService('POST', 'addSite', form);

      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setShowAddModal(false);
      fetchSites(currentPage);
    } catch (error) {
      console.error('Error adding site:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityDropdownChange = (id) => {
    setFormData({ ...formData, parent_id: id });
  };

  const handleCategoryChange = (selectedCategories) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: selectedCategories,
    }));
  };

  const handleDeleteSite = async (id) => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      // form.append(key, formData[key]);
      console.log(key, formData[key]);
    });
    if (formData.id) form.append('id', formData.id)
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteSite', { id });
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setFormData(formData); // Reset formData before fetching sites

      fetchSites(currentPage);
    } catch (error) {
      console.error('Error deleting site:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: null,
      meta_data: category.meta_data,
    });
    setShowEditModal(true);
  };


  const handleEditSite = async () => {
    const form = new FormData();
    const changedData = getChangedFormData();
    if (formData.id) form.append('id', formData.id);

    Object.keys(changedData).forEach((key) => {
      if (key === 'categories' && Array.isArray(changedData[key])) {
        form.append('categories', JSON.stringify(changedData[key]));
      } else if (key === 'status') {
        form.append(key, changedData[key] ? '1' : '0');
      } else {
        form.append(key, changedData[key]);
      }
    });

    setLoading(true);
    try {
      const data = await apiService('POST', 'updateSite', form);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setShowEditModal(false);
      fetchSites(currentPage);
    } catch (error) {
      console.error('Error updating site:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getChangedFormData = () => {
    const changedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialFormData[key]) {
        changedData[key] = formData[key];
      }
    });
    return changedData;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody>
                  <CForm className="row gx-3 gy-2 align-items-center" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeInputName">
                        Name
                      </CFormLabel>
                      <CFormInput
                        id="specificSizeInputName"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </CCol>
                    <CCol sm={3}>
                      <DropdownSearch
                        onChange={handleDropdownChange}
                        endpoint="sites"
                        label="Cities"
                        filter={[{ category: 'city' }]}
                      />
                    </CCol>
                    <CCol sm={3}>
                      <DropdownSearch
                        onChange={handleCategoryDropdownChange}
                        endpoint="listcategories"
                        label="Categories"
                        filter={[{ global: 1 }]}
                        valueKey="code"
                      />
                    </CCol>
                    <CCol xs="auto">
                      <CButton color="primary" type="submit">
                        Search
                      </CButton>
                    </CCol>
                    <CCol xs="auto">
                      <CButton color="primary" onClick={() => setShowAddModal(true)}>
                        Add
                      </CButton>
                    </CCol>
                  </CForm>
                </CCardBody>
              </CCard>
              {error && <CAlert color="danger" onClose={clearAlert} dismissible>{error}</CAlert>}
            </CCol>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <CSpinner color="primary" />
            ) : (
              <>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Stop Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Tag Line</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Icon</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Logo</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Domain Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Is Hot Place</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Latitude</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Longitude</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sites.map((site, index) => (
                      <CTableRow key={site.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{site.name}</CTableDataCell>
                        <CTableDataCell>
                          {site.categories && site.categories.length > 0 ? (
                            site.categories.map((category) => (
                              <span
                                key={category.id}
                                style={{
                                  marginRight: '5px',
                                  display: 'inline-block',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {' #' + category.name}
                              </span>
                            ))
                          ) : (
                            <span>No Categories</span>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>{site.bus_stop_type}</CTableDataCell>
                        <CTableDataCell>{site.tag_line}</CTableDataCell>
                        <CTableDataCell>{site.description}</CTableDataCell>
                        <CTableDataCell>
                          {site.icon ? <CImage src={"https://ftp.dev.tourkokan.com/" + site.icon} alt={site.icon} width="50" /> : 'No Image'}
                        </CTableDataCell> <CTableDataCell>
                          {site.logo ? <CImage src={"https://ftp.dev.tourkokan.com/" + site.logo} alt={site.logo} width="50" /> : 'No Image'}
                        </CTableDataCell> <CTableDataCell>
                          {site.image ? <CImage src={"https://ftp.dev.tourkokan.com/" + site.image} alt={site.image} width="50" /> : 'No Image'}
                        </CTableDataCell>
                        <CTableDataCell>{site.domain_name}</CTableDataCell>
                        <CTableDataCell>{site.status}</CTableDataCell>
                        <CTableDataCell>{site.is_hot_place}</CTableDataCell>
                        <CTableDataCell>{site.latitude}</CTableDataCell>
                        <CTableDataCell>{site.longitude}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => openEditModal(site)}>Edit</CButton>{' '}
                          <CButton color="danger" size="sm" onClick={() => handleDeleteSite(site.id)}>Delete</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination>
                  {links.map((link, index) => (
                    <CPaginationItem
                      key={index}
                      active={link.active}
                      onClick={() => handlePaginationClick(link.label)}
                      disabled={!link.url} // Assuming link.url being null means it's disabled
                    >
                      {renderPaginationLabel(link.label)}
                    </CPaginationItem>
                  ))}
                </CPagination>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Add Site</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />

            <CFormLabel htmlFor="name">Site</CFormLabel>
            <DropdownSearch onChange={handleCityDropdownChange} endpoint="sites" label="Cities" filter={[{}]} />

            <CFormLabel htmlFor="name">Categories</CFormLabel>
            <MultiSelectDropdown onChange={handleCategoryChange} endpoint="listcategories" label="Categories" filter={[{ global: 1 }]} />

            <CFormLabel htmlFor="bus_stop_type">Bus Stop Type</CFormLabel>
            <CFormInput id="bus_stop_type" name="bus_stop_type" value={formData.bus_stop_type} onChange={handleInputChange} />

            <CFormLabel htmlFor="tag_line">Tag Line</CFormLabel>
            <CFormInput id="tag_line" name="tag_line" value={formData.tag_line} onChange={handleInputChange} />

            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />

            <CFormLabel htmlFor="domain_name">Domain Name</CFormLabel>
            <CFormInput id="domain_name" name="domain_name" value={formData.domain_name} onChange={handleInputChange} />

            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>

            <CFormLabel htmlFor="is_hot_place">Is Hot Place</CFormLabel>
            <CFormInput id="is_hot_place" name="is_hot_place" value={formData.is_hot_place} onChange={handleInputChange} />

            <CFormLabel htmlFor="latitude">Latitude</CFormLabel>
            <CFormInput id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} />

            <CFormLabel htmlFor="longitude">Longitude</CFormLabel>
            <CFormInput id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} />

            <CFormLabel htmlFor="pin_code">Pin Code</CFormLabel>
            <CFormInput id="pin_code" name="pin_code" value={formData.pin_code} onChange={handleInputChange} />

            <CFormLabel htmlFor="speciality">Speciality</CFormLabel>
            <CFormInput id="speciality" name="speciality" value={formData.speciality} onChange={handleInputChange} />

            <CFormLabel htmlFor="rules">Rules</CFormLabel>
            <CFormInput id="rules" name="rules" value={formData.rules} onChange={handleInputChange} />

            <CFormLabel htmlFor="social_media">Social Media</CFormLabel>
            <CFormInput id="social_media" name="social_media" value={formData.social_media} onChange={handleInputChange} />

            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />

            <CFormLabel htmlFor="logo">Logo</CFormLabel>
            <CFormInput type="file" id="logo" name="logo" onChange={handleFileChange} />

            <CFormLabel htmlFor="icon">Icon</CFormLabel>
            <CFormInput type="file" id="icon" name="icon" onChange={handleFileChange} />

            <CFormLabel htmlFor="image">Image</CFormLabel>
            <CFormInput type="file" id="image" name="image" onChange={handleFileChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddSite}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader onClose={() => setShowEditModal(false)}>
          <CModalTitle>Add Site</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />

            <CFormLabel htmlFor="site">Site</CFormLabel>
            <DropdownSearch onChange={handleCityDropdownChange} endpoint="sites" label="Cities" filter={[{}]} />

            <CFormLabel htmlFor="categories">Categories</CFormLabel>
            <MultiSelectDropdown onChange={handleCategoryChange} endpoint="listcategories" label="Categories" filter={[{ global: 1 }]} />

            <CFormLabel htmlFor="bus_stop_type">Bus Stop Type</CFormLabel>
            <CFormInput id="bus_stop_type" name="bus_stop_type" value={formData.bus_stop_type} onChange={handleInputChange} />

            <CFormLabel htmlFor="tag_line">Tag Line</CFormLabel>
            <CFormInput id="tag_line" name="tag_line" value={formData.tag_line} onChange={handleInputChange} />

            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />

            <CFormLabel htmlFor="domain_name">Domain Name</CFormLabel>
            <CFormInput id="domain_name" name="domain_name" value={formData.domain_name} onChange={handleInputChange} />

            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>

            <CFormLabel htmlFor="is_hot_place">Is Hot Place</CFormLabel>
            <CFormInput id="is_hot_place" name="is_hot_place" value={formData.is_hot_place} onChange={handleInputChange} />

            <CFormLabel htmlFor="latitude">Latitude</CFormLabel>
            <CFormInput id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} />

            <CFormLabel htmlFor="longitude">Longitude</CFormLabel>
            <CFormInput id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} />

            <CFormLabel htmlFor="pin_code">Pin Code</CFormLabel>
            <CFormInput id="pin_code" name="pin_code" value={formData.pin_code} onChange={handleInputChange} />

            <CFormLabel htmlFor="speciality">Speciality</CFormLabel>
            <CFormInput id="speciality" name="speciality" value={formData.speciality} onChange={handleInputChange} />

            <CFormLabel htmlFor="rules">Rules</CFormLabel>
            <CFormInput id="rules" name="rules" value={formData.rules} onChange={handleInputChange} />

            <CFormLabel htmlFor="social_media">Social Media</CFormLabel>
            <CFormInput id="social_media" name="social_media" value={formData.social_media} onChange={handleInputChange} />

            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />

            <CFormLabel htmlFor="logo">Logo</CFormLabel>
            <CFormInput type="file" id="logo" name="logo" onChange={handleFileChange} />

            <CFormLabel htmlFor="icon">Icon</CFormLabel>
            <CFormInput type="file" id="icon" name="icon" onChange={handleFileChange} />

            <CFormLabel htmlFor="image">Image</CFormLabel>
            <CFormInput type="file" id="image" name="image" onChange={handleFileChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleEditSite}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Sites;
