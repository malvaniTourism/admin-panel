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
  CFormSelect,
  CButton,
  CImage,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert
} from '@coreui/react';
import apiService from 'src/services/apiService';
import Dropdown from '../../components/Dropdown';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: null,
    status: false,
    meta_data: '',
    source_place_id: '',
    destination_place_id: '',
    bus_type_id: '',
    distance: '',
    start_time: '',
    end_time: '',
    total_time: '',
    delayed_time: '',
    working_days: '',
    search: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes(currentPage);
  }, [currentPage]);

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchRoutes = async (page) => {
    const form = new FormData();
    if (formData.source_place_id) form.append('source_place_id', formData.source_place_id);
    if (formData.destination_place_id) form.append('destination_place_id', formData.destination_place_id);
    if (formData.search) form.append('search', formData.search);
    if (formData.per_page) form.append('per_page', formData.per_page);

    form.append('apitype', 'list');

    setLoading(true);
    try {
      const data = await apiService('POST', `routes?page=${page}`, form);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, icon: e.target.files[0] });
  };

  const handleAddRoute = async () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.description) form.append('description', formData.description);
    if (formData.icon) form.append('icon', formData.icon);
    form.append('status', formData.status ? '1' : '0');
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setLoading(true);
    try {
      await apiService('POST', 'addCategory', form);
      setShowAddModal(false);
      fetchRoutes(currentPage);
    } catch (error) {
      console.error('Error adding category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.description) form.append('description', formData.description);
    if (formData.icon) form.append('icon', formData.icon);
    form.append('status', formData.status ? '1' : '0');
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setLoading(true);
    try {
      await apiService('POST', 'updateRoute', form);
      setShowEditModal(false);
      fetchRoutes(currentPage);
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    setLoading(true);
    try {
      await apiService('POST', 'deleteRoute', { id });
      fetchRoutes(currentPage);
    } catch (error) {
      console.error('Error deleting category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (route) => {
    setFormData({
      id: route.id,
      name: route.name,
      description: route.description,
      source_place_id: route.source_place_id,
      destination_place_id: route.destination_place_id,
      bus_type_id: route.bus_type_id,
      distance: route.distance,
      // status: route.status,
      start_time: route.start_time,
      end_time: route.end_time,
      total_time: route.total_time,
      delayed_time: route.delayed_time,
      working_days: route.working_days,
      meta_data: route.meta_data,
    });
    setShowEditModal(true);
  };

  const handlePaginationClick = (label) => {
    if (label === '&laquo; Previous') {
      setCurrentPage(currentPage - 1);
    } else if (label === 'Next &raquo;') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(parseInt(label)); // Assuming the label is numeric page number
    }
  };

  const renderPaginationLabel = (label) => {
    // Remove "&laquo;" and "&raquo;" from labels
    return label.replace('&laquo;', '').replace('&raquo;', '');
  };

  const handleSearch = () => {
    // Reset pagination to first page when searching
    setCurrentPage(1);
    fetchRoutes(1); // Fetch routes with the updated search criteria
  };

  const handleSrcDropdownChange = (id) => {
    console.log(id);
    setFormData({ ...formData, category: id });
    // You can add additional logic here if needed
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
                      <CFormLabel htmlFor="specificSizeInputName">Name</CFormLabel>
                      <CFormInput id="specificSizeInputName" name="search" value={formData.search} onChange={handleInputChange} placeholder="Route name" />
                    </CCol>
                    <CCol sm={3}>
                      <CFormLabel htmlFor="specificSizeSelectRoutes">Source Place</CFormLabel>
                      <Dropdown
                        onChange={handleSrcDropdownChange}
                        endpoint="sites"
                      />
                    </CCol>
                    <CCol sm={3}>
                      <CFormLabel htmlFor="specificSizeSelectCity">City</CFormLabel>
                      <CFormSelect id="specificSizeSelectCity" name="city" value={formData.city} onChange={handleInputChange}>
                        <option value="">City...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </CFormSelect>
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
                      <CTableHeaderCell scope="col">Source Place</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Destination Place</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Bus Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Distance</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delayed Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Working Days</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {routes.map((route, index) => (
                      <CTableRow key={route.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{route.name}</CTableDataCell>
                        <CTableDataCell>{route.source_place.name + ' (' + route.source_place.category.name + ')'}</CTableDataCell>
                        <CTableDataCell>{route.destination_place.name + ' (' + route.destination_place.category.name + ')'}</CTableDataCell>
                        <CTableDataCell>{route.bus_type.type}</CTableDataCell>
                        <CTableDataCell>{route.description}</CTableDataCell>
                        <CTableDataCell>{route.distance + ' KM'}</CTableDataCell>
                        <CTableDataCell>{route.start_time}</CTableDataCell>
                        <CTableDataCell>{route.end_time}</CTableDataCell>
                        <CTableDataCell>{route.total_time}</CTableDataCell>
                        <CTableDataCell>{route.delayed_time}</CTableDataCell>
                        <CTableDataCell>{route.working_days}</CTableDataCell>
                        <CTableDataCell>{!route.status ? 'Active' : 'Inactive'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => openEditModal(route)}>Edit</CButton>{' '}
                          <CButton color="danger" size="sm" onClick={() => handleDeleteRoute(route.id)}>Delete</CButton>
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
          <CModalTitle>Add Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />

            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />

            <CFormLabel htmlFor="source_place_id">Destination Place</CFormLabel>
            <CFormInput id="source_place_id" name="source_place_id" value={formData.source_place_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="destination_place_id">Destination Place</CFormLabel>
            <CFormInput id="destination_place_id" name="destination_place_id" value={formData.destination_place_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="bus_type_id">Bus Type</CFormLabel>
            <CFormInput id="bus_type_id" name="bus_type_id" value={formData.bus_type_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="distance">Distance</CFormLabel>
            <CFormInput id="distance" name="distance" value={formData.distance} onChange={handleInputChange} />

            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>

            <CFormLabel htmlFor="start_time">start_time</CFormLabel>
            <CFormInput id="start_time" name="start_time" value={formData.start_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="end_time">end_time</CFormLabel>
            <CFormInput id="end_time" name="end_time" value={formData.end_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="total_time">total_time</CFormLabel>
            <CFormInput id="total_time" name="total_time" value={formData.total_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="delayed_time">delayed_time</CFormLabel>
            <CFormInput id="delayed_time" name="delayed_time" value={formData.delayed_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="working_days">working_days</CFormLabel>
            <CFormInput id="working_days" name="working_days" value={formData.working_days} onChange={handleInputChange} />

            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleAddRoute}>Add</CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader onClose={() => setShowEditModal(false)}>
          <CModalTitle>Edit Routes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />

            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />

            <CFormLabel htmlFor="source_place_id">Destination Place</CFormLabel>
            <CFormInput id="source_place_id" name="source_place_id" value={formData.source_place_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="destination_place_id">Destination Place</CFormLabel>
            <CFormInput id="destination_place_id" name="destination_place_id" value={formData.destination_place_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="bus_type_id">Bus Type</CFormLabel>
            <CFormInput id="bus_type_id" name="bus_type_id" value={formData.bus_type_id} onChange={handleInputChange} />

            <CFormLabel htmlFor="distance">Distance</CFormLabel>
            <CFormInput id="distance" name="distance" value={formData.distance} onChange={handleInputChange} />

            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>

            <CFormLabel htmlFor="start_time">start_time</CFormLabel>
            <CFormInput id="start_time" name="start_time" value={formData.start_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="end_time">end_time</CFormLabel>
            <CFormInput id="end_time" name="end_time" value={formData.end_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="total_time">total_time</CFormLabel>
            <CFormInput id="total_time" name="total_time" value={formData.total_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="delayed_time">delayed_time</CFormLabel>
            <CFormInput id="delayed_time" name="delayed_time" value={formData.delayed_time} onChange={handleInputChange} />

            <CFormLabel htmlFor="working_days">working_days</CFormLabel>
            <CFormInput id="working_days" name="working_days" value={formData.working_days} onChange={handleInputChange} />

            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleEditCategory}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
      {error && <CAlert color="danger" onClose={clearAlert} dismissible>{error}</CAlert>}
    </CRow>
  );
};

export default Routes;
