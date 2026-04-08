import React, { useState } from 'react';
import {

  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
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
import { cilClock, cilLocationPin, cilSpeedometer, cilTrash } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import DropdownSearch from '../../components/DropdownSearch';
import { parseApiMessage } from 'src/utils/apiMessages';

const RouteStops = () => {
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ search: '', id: '' });
  const [editableCell, setEditableCell] = useState({ rowIndex: null, colIndex: null });
  const [updatedData, setUpdatedData] = useState([]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchRouteStops = async (payload) => {
    setLoading(true);
    try {
      const data = await apiService('POST', 'routeDetails', payload);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setRouteStops(data.data || []);
      setUpdatedData([]);
    } catch (err) {
      console.error('Error fetching route stops:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const payload = new FormData();
    if (searchFilters.search) payload.append('search', searchFilters.search);
    if (searchFilters.id) payload.append('id', searchFilters.id);
    fetchRouteStops(payload);
  };

  const handleCellChange = (e, rowIndex, field) => {
    const value = e.target.value;
    const updatedRows = [...routeStops.route_stops];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };

    const sanitized = updatedRows.map(({ site, ...rest }) => rest);
    setRouteStops((prev) => ({ ...prev, route_stops: updatedRows }));
    setUpdatedData(sanitized);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    setEditableCell({ rowIndex, colIndex });
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const lastCol = 5;
      if (colIndex >= lastCol) {
        const nextRow = rowIndex + 1;
        if (nextRow < routeStops.route_stops.length) {
          setEditableCell({ rowIndex: nextRow, colIndex: 4 });
        }
      } else {
        setEditableCell({ rowIndex, colIndex: colIndex + 1 });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiService('POST', 'massRouteStopsUpdate', { route_stops: updatedData });
      if (response.success) {
        setEditableCell({ rowIndex: null, colIndex: null });
        showSuccess(response.message);
      } else {
        showError(parseApiMessage(response.message));
      }
    } catch (err) {
      console.error('Error saving route stops:', err);
      showError(err.message);
    }
  };

  const handleDeleteRouteStop = async (id) => {
    if (!window.confirm('Delete this stop?')) return;
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteRouteStop', { id });
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      showSuccess(data.message);
      handleSearch();
    } catch (err) {
      console.error('Error deleting route stop:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stops = routeStops?.route_stops || [];

  const editableInput = (value, rowIndex, colIndex, field) => (
    editableCell.rowIndex === rowIndex && editableCell.colIndex === colIndex ? (
      <CFormInput
        value={value || ''}
        onChange={(e) => handleCellChange(e, rowIndex, field)}
        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
        size="sm"
        autoFocus
      />
    ) : (
      <span
        onClick={() => handleCellClick(rowIndex, colIndex)}
        style={{ cursor: 'pointer', display: 'block', minWidth: 60, padding: '2px 4px', borderRadius: 4 }}
        className="editable-cell"
        title="Click to edit"
      >
        {value || <span style={{ color: 'var(--cui-secondary-color)', fontSize: 11 }}>—</span>}
      </span>
    )
  );

  return (
    <CRow>
      <CCol xs={12}>
        {/* Search */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={4}>
                <CFormLabel>Route Name</CFormLabel>
                <CFormInput
                  placeholder="Search by route name..."
                  value={searchFilters.search}
                  onChange={(e) => setSearchFilters((p) => ({ ...p, search: e.target.value }))}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Route</CFormLabel>
                <DropdownSearch
                  onChange={(id) => setSearchFilters((p) => ({ ...p, id: id ?? '' }))}
                  endpoint="routes"
                  label="Select Route"
                  filter={[{ with_stops: 0 }]}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Route Info Header */}
        {routeStops?.name && (
          <CCard className="mb-3">
            <CCardBody>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <strong style={{ fontSize: 16 }}>{routeStops.name}</strong>
                {routeStops.source_place && (
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                    <CIcon icon={cilLocationPin} size="sm" style={{ color: 'var(--cui-success)' }} />
                    {routeStops.source_place.name}
                    <span className="mx-2">→</span>
                    <CIcon icon={cilLocationPin} size="sm" style={{ color: 'var(--cui-danger)' }} />
                    {routeStops.destination_place?.name}
                  </div>
                )}
                {routeStops.distance && (
                  <CBadge color="info" shape="rounded-pill">
                    <CIcon icon={cilSpeedometer} size="sm" className="me-1" />{routeStops.distance} km
                  </CBadge>
                )}
                {routeStops.start_time && (
                  <CBadge color="secondary" shape="rounded-pill">
                    <CIcon icon={cilClock} size="sm" className="me-1" />
                    {routeStops.start_time} – {routeStops.end_time}
                  </CBadge>
                )}
              </div>
            </CCardBody>
          </CCard>
        )}

        {/* Stops Table */}
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Route Stops</strong>
            {stops.length > 0 && (
              <CButton color="primary" size="sm" onClick={handleSubmit}>
                Save Changes
              </CButton>
            )}
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center py-5"><CSpinner color="primary" /></div>
            ) : stops.length === 0 ? (
              <p className="text-center text-body-secondary py-4">
                {routeStops?.route_stops === undefined
                  ? 'Search for a route to view its stops.'
                  : 'No stops found for this route.'}
              </p>
            ) : (
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Seq</CTableHeaderCell>
                    <CTableHeaderCell>Stop Name</CTableHeaderCell>
                    <CTableHeaderCell>Depart At</CTableHeaderCell>
                    <CTableHeaderCell>Arrive At</CTableHeaderCell>
                    <CTableHeaderCell>Delay (min)</CTableHeaderCell>
                    <CTableHeaderCell>Distance (km)</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stops.map((stop, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell>{rowIndex + 1}</CTableDataCell>
                      <CTableDataCell>{stop.serial_no}</CTableDataCell>
                      <CTableDataCell><strong>{stop.site?.name}</strong></CTableDataCell>
                      <CTableDataCell tabIndex={0}>
                        {editableInput(stop.dept_time, rowIndex, 4, 'dept_time')}
                      </CTableDataCell>
                      <CTableDataCell tabIndex={0}>
                        {editableInput(stop.arr_time, rowIndex, 5, 'arr_time')}
                      </CTableDataCell>
                      <CTableDataCell>{stop.delayed_time || '—'}</CTableDataCell>
                      <CTableDataCell>{stop.distance || '—'}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteRouteStop(stop.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default RouteStops;
