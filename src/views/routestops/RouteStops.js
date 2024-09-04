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
  CButton,
  CForm,
  CFormInput,
  CAlert,
  CSpinner
} from '@coreui/react';
import apiService from 'src/services/apiService';
import DropdownSearch from '../../components/DropdownSearch';

const RouteStops = () => {
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    search: '',
    source_place_id: '',
    // other fields as needed
  });

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchRouteStops = async (payload) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `routeDetails`, payload);
      console.log("resp", data);
      if (!data.success) {
        showAlert(data.message.destination_place_id);
        return;
      }
      setRouteStops(data.data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const payload = new FormData();
    if (formData.search) payload.append('search', formData.search);
    if (formData.id) payload.append('id', formData.id);

    fetchRouteStops(payload);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSrcDropdownChange = (id) => {
    setFormData({ ...formData, id: id });
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
                      <CFormInput
                        id="specificSizeInputName"
                        name="search"
                        value={formData.search}
                        onChange={handleInputChange}
                        placeholder="Route name"
                      />
                    </CCol>
                    <CCol sm={3}>
                      <DropdownSearch
                        onChange={handleSrcDropdownChange}
                        endpoint="routes"
                        label="Routes"
                        filter={[{ with_stops: 0 }]}
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
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Serial No</CTableHeaderCell>
                    <CTableHeaderCell>Route No</CTableHeaderCell>
                    <CTableHeaderCell>Stop Name</CTableHeaderCell>
                    <CTableHeaderCell>Depart At</CTableHeaderCell>
                    <CTableHeaderCell>Arrived At</CTableHeaderCell>
                    <CTableHeaderCell>Delayed Time (min)</CTableHeaderCell>
                    <CTableHeaderCell>Distance (km)</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {routeStops?.route_stops?.map((stop, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{stop.serial_no || ""}</CTableDataCell>
                      <CTableDataCell>{stop.route_id || ""}</CTableDataCell>
                      <CTableDataCell>{stop.site?.name || ""}</CTableDataCell>
                      <CTableDataCell>{stop.dept_time || ""}</CTableDataCell>
                      <CTableDataCell>{stop.arr_time || ""}</CTableDataCell>
                      <CTableDataCell>{stop.delayed_time || ""}</CTableDataCell>
                      <CTableDataCell>{stop.distance || ""}</CTableDataCell>
                    </CTableRow>
                  ))}

                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RouteStops;
