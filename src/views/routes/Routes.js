import React, { useEffect, useRef, useState } from 'react';
import {

  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowRight,
  cilBus,
  cilClock,
  cilLocationPin,
  cilPencil,
  cilSpeedometer,
  cilTrash,
} from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import DropdownSearch from '../../components/DropdownSearch';
import { parseApiMessage } from 'src/utils/apiMessages';

const emptyForm = {
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
};

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStopsModal, setShowStopsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchFilters, setSearchFilters] = useState({ search: '', source_place_id: '', destination_place_id: '' });
  const activeFilters = useRef(searchFilters);

  useEffect(() => {
    fetchRoutes(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchRoutes = async (page) => {
    const form = new FormData();
    const filters = activeFilters.current;
    if (filters.source_place_id) form.append('source_place_id', filters.source_place_id);
    if (filters.destination_place_id) form.append('destination_place_id', filters.destination_place_id);
    if (filters.search) form.append('search', filters.search);
    form.append('apitype', 'list');
    form.append('with_stops', 1);

    setLoading(true);
    try {
      const data = await apiService('POST', `routes?page=${page}`, form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setRoutes(list);
      setLinks(Array.isArray(data.data) ? [] : (data.data.links || []));
    } catch (err) {
      console.error('Error fetching routes:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeFilters.current = { ...searchFilters };
    if (currentPage === 1) {
      setSearchTrigger((t) => t + 1);
    } else {
      setCurrentPage(1);
    }
  };

  const handlePaginationClick = (label) => {
    const clean = label.replace('&laquo;', '').replace('&raquo;', '').trim();
    if (clean === 'Previous') setCurrentPage((p) => Math.max(p - 1, 1));
    else if (clean === 'Next') setCurrentPage((p) => p + 1);
    else setCurrentPage(parseInt(clean));
  };

  const renderPaginationLabel = (label) =>
    label.replace('&laquo;', '').replace('&raquo;', '').trim();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, icon: e.target.files[0] }));
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (route) => {
    setFormData({
      ...emptyForm,
      id: route.id,
      name: route.name ?? '',
      description: route.description ?? '',
      source_place_id: route.source_place_id ?? '',
      destination_place_id: route.destination_place_id ?? '',
      bus_type_id: route.bus_type_id ?? '',
      distance: route.distance ?? '',
      status: route.status ?? false,
      start_time: route.start_time ?? '',
      end_time: route.end_time ?? '',
      total_time: route.total_time ?? '',
      delayed_time: route.delayed_time ?? '',
      working_days: route.working_days ?? '',
      meta_data: route.meta_data ?? '',
    });
    setShowEditModal(true);
  };

  const openStopsModal = (route) => {
    setSelectedRoute(route);
    setShowStopsModal(true);
  };

  const handleAddRoute = async () => {
    const form = new FormData();
    if (formData.name) form.append('name', formData.name);
    if (formData.description) form.append('description', formData.description);
    if (formData.source_place_id) form.append('source_place_id', formData.source_place_id);
    if (formData.destination_place_id) form.append('destination_place_id', formData.destination_place_id);
    if (formData.bus_type_id) form.append('bus_type_id', formData.bus_type_id);
    if (formData.distance) form.append('distance', formData.distance);
    if (formData.start_time) form.append('start_time', formData.start_time);
    if (formData.end_time) form.append('end_time', formData.end_time);
    if (formData.total_time) form.append('total_time', formData.total_time);
    if (formData.delayed_time) form.append('delayed_time', formData.delayed_time);
    if (formData.working_days) form.append('working_days', formData.working_days);
    form.append('status', formData.status ? '1' : '0');

    setLoading(true);
    try {
      const data = await apiService('POST', 'addRoute', form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowAddModal(false);
      showSuccess(data.message);
      fetchRoutes(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoute = async () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.description) form.append('description', formData.description);
    if (formData.source_place_id) form.append('source_place_id', formData.source_place_id);
    if (formData.destination_place_id) form.append('destination_place_id', formData.destination_place_id);
    if (formData.bus_type_id) form.append('bus_type_id', formData.bus_type_id);
    if (formData.distance) form.append('distance', formData.distance);
    if (formData.start_time) form.append('start_time', formData.start_time);
    if (formData.end_time) form.append('end_time', formData.end_time);
    if (formData.total_time) form.append('total_time', formData.total_time);
    if (formData.delayed_time) form.append('delayed_time', formData.delayed_time);
    if (formData.working_days) form.append('working_days', JSON.stringify(formData.working_days));
    if (formData.meta_data) form.append('meta_data', JSON.stringify(formData.meta_data));
    form.append('status', formData.status ? '1' : '0');

    setLoading(true);
    try {
      const data = await apiService('POST', 'routesUpdate', form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowEditModal(false);
      showSuccess(data.message);
      fetchRoutes(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteRoute', { id });
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      showSuccess(data.message);
      fetchRoutes(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const routeForm = (
    <CForm>
      <CRow className="g-3">
        <CCol md={12}>
          <CFormLabel>Route Name</CFormLabel>
          <CFormInput name="name" value={formData.name} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Source</CFormLabel>
          <DropdownSearch
            onChange={(id) => setFormData((p) => ({ ...p, source_place_id: id }))}
            endpoint="sites"
            label="Source Place"
            filter={[{ type: 'bus' }]}
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Destination</CFormLabel>
          <DropdownSearch
            onChange={(id) => setFormData((p) => ({ ...p, destination_place_id: id }))}
            endpoint="sites"
            label="Destination Place"
            filter={[{ type: 'bus' }]}
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Bus Type ID</CFormLabel>
          <CFormInput name="bus_type_id" value={formData.bus_type_id} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Distance (km)</CFormLabel>
          <CFormInput name="distance" value={formData.distance} onChange={handleInputChange} />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Start Time</CFormLabel>
          <CFormInput name="start_time" value={formData.start_time} onChange={handleInputChange} placeholder="HH:MM" />
        </CCol>
        <CCol md={4}>
          <CFormLabel>End Time</CFormLabel>
          <CFormInput name="end_time" value={formData.end_time} onChange={handleInputChange} placeholder="HH:MM" />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Total Time (min)</CFormLabel>
          <CFormInput name="total_time" value={formData.total_time} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Delayed Time (min)</CFormLabel>
          <CFormInput name="delayed_time" value={formData.delayed_time} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Working Days</CFormLabel>
          <CFormInput name="working_days" value={formData.working_days} onChange={handleInputChange} placeholder="e.g. Mon,Tue,Wed" />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Status</CFormLabel>
          <CFormSelect
            value={formData.status ? '1' : '0'}
            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value === '1' }))}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </CFormSelect>
        </CCol>
        <CCol md={12}>
          <CFormLabel>Description</CFormLabel>
          <CFormInput name="description" value={formData.description} onChange={handleInputChange} />
        </CCol>
      </CRow>
    </CForm>
  );

  return (
    <CRow>
      <CCol xs={12}>
        {/* Search */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={3}>
                <CFormLabel>Route Name</CFormLabel>
                <CFormInput
                  placeholder="Search..."
                  value={searchFilters.search}
                  onChange={(e) => setSearchFilters((p) => ({ ...p, search: e.target.value }))}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel>Source</CFormLabel>
                <DropdownSearch
                  onChange={(id) => setSearchFilters((p) => ({ ...p, source_place_id: id }))}
                  endpoint="sites"
                  label="Source Place"
                  filter={[{ type: 'bus' }]}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel>Destination</CFormLabel>
                <DropdownSearch
                  onChange={(id) => setSearchFilters((p) => ({ ...p, destination_place_id: id }))}
                  endpoint="sites"
                  label="Destination Place"
                  filter={[{ type: 'bus' }]}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
              <CCol md="auto">
                <CButton color="success" onClick={openAddModal}>+ Add Route</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Route Cards */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : routes.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No routes found.</CCardBody></CCard>
        ) : (
          routes.map((route) => (
            <CCard key={route.id} className="mb-3">
              <CCardBody>
                <CRow className="g-3">
                  {/* Route header */}
                  <CCol xs={12}>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <strong style={{ fontSize: 16 }}>{route.name}</strong>
                      <CBadge color={route.status ? 'success' : 'secondary'} shape="rounded-pill">
                        {route.status ? 'Active' : 'Inactive'}
                      </CBadge>
                      {route.bus_type?.type && (
                        <CBadge color="info" shape="rounded-pill">
                          <CIcon icon={cilBus} size="sm" className="me-1" />{route.bus_type.type}
                        </CBadge>
                      )}
                    </div>
                  </CCol>

                  {/* Source → Destination */}
                  <CCol xs={12} md={4}>
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--cui-secondary-color)', textTransform: 'uppercase' }}>From</div>
                        <div className="d-flex align-items-center gap-1">
                          <CIcon icon={cilLocationPin} size="sm" style={{ color: 'var(--cui-success)' }} />
                          <strong>{route.source_place?.name}</strong>
                        </div>
                      </div>
                      <CIcon icon={cilArrowRight} size="lg" style={{ color: 'var(--cui-secondary-color)', margin: '0 8px' }} />
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--cui-secondary-color)', textTransform: 'uppercase' }}>To</div>
                        <div className="d-flex align-items-center gap-1">
                          <CIcon icon={cilLocationPin} size="sm" style={{ color: 'var(--cui-danger)' }} />
                          <strong>{route.destination_place?.name}</strong>
                        </div>
                      </div>
                    </div>
                  </CCol>

                  {/* Timings */}
                  <CCol xs={12} md={5}>
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 13, color: 'var(--cui-secondary-color)' }}>
                      {route.start_time && (
                        <span><CIcon icon={cilClock} size="sm" className="me-1" />{route.start_time} – {route.end_time}</span>
                      )}
                      {route.total_time && (
                        <span><CIcon icon={cilSpeedometer} size="sm" className="me-1" />{route.total_time} min</span>
                      )}
                      {route.distance && (
                        <span>{route.distance} km</span>
                      )}
                      {route.delayed_time && (
                        <span style={{ color: 'var(--cui-warning)' }}>Delay: {route.delayed_time} min</span>
                      )}
                      {route.working_days && (
                        <span>Days: {route.working_days}</span>
                      )}
                    </div>
                    {route.description && (
                      <p className="mb-0 mt-1 text-body-secondary" style={{ fontSize: 13 }}>{route.description}</p>
                    )}
                  </CCol>

                  {/* Actions */}
                  <CCol xs={12} md={3} className="d-flex justify-content-end align-items-start gap-2 flex-wrap">
                    {route.route_stops && route.route_stops.length > 0 && (
                      <CButton color="primary" size="sm" onClick={() => openStopsModal(route)}>
                        Stops ({route.route_stops.length})
                      </CButton>
                    )}
                    <CButton color="warning" size="sm" onClick={() => openEditModal(route)}>
                      <CIcon icon={cilPencil} className="me-1" />Edit
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                      <CIcon icon={cilTrash} className="me-1" />Delete
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        {links.length > 0 && (
          <CPagination className="mt-2">
            {links.map((link, index) => (
              <CPaginationItem
                key={index}
                active={link.active}
                disabled={!link.url}
                onClick={() => link.url && handlePaginationClick(link.label)}
              >
                {renderPaginationLabel(link.label)}
              </CPaginationItem>
            ))}
          </CPagination>
        )}
      </CCol>

      {/* Stops Modal */}
      <CModal visible={showStopsModal} onClose={() => setShowStopsModal(false)} fullscreen>
        <CModalHeader onClose={() => setShowStopsModal(false)}>
          <CModalTitle>Route Stops — {selectedRoute?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable striped bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Serial No</CTableHeaderCell>
                <CTableHeaderCell>Route No</CTableHeaderCell>
                <CTableHeaderCell>Stop Name</CTableHeaderCell>
                <CTableHeaderCell>Depart At</CTableHeaderCell>
                <CTableHeaderCell>Arrive At</CTableHeaderCell>
                <CTableHeaderCell>Delay (min)</CTableHeaderCell>
                <CTableHeaderCell>Distance (km)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {(selectedRoute?.route_stops || []).map((stop, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{stop.serial_no}</CTableDataCell>
                  <CTableDataCell>{stop.route_id}</CTableDataCell>
                  <CTableDataCell>{stop.site?.name}</CTableDataCell>
                  <CTableDataCell>{stop.dept_time}</CTableDataCell>
                  <CTableDataCell>{stop.arr_time}</CTableDataCell>
                  <CTableDataCell>{stop.delayed_time}</CTableDataCell>
                  <CTableDataCell>{stop.distance}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>

      {/* Add Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg" scrollable>
        <CModalHeader><CModalTitle>Add Route</CModalTitle></CModalHeader>
        <CModalBody>{routeForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddRoute} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Add Route'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg" scrollable>
        <CModalHeader><CModalTitle>Edit — {formData.name}</CModalTitle></CModalHeader>
        <CModalBody>{routeForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditRoute} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default Routes;
