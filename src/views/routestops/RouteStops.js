import React, { useState } from 'react';
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
  });
  const [editableCell, setEditableCell] = useState({ rowIndex: null, colIndex: null });
  const [updatedData, setUpdatedData] = useState([]); // To track changes in route stops

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

  const handleInputChange = (e, rowIndex, colIndex) => {
    const value = e.target.value;
    const updatedRows = [...routeStops.route_stops];

    updatedRows[rowIndex][colIndex] = value;

    const sanitizedUpdatedRows = updatedRows.map((row) => {
      const { site, ...rest } = row;
      return rest; 
    });

    setRouteStops((prevState) => ({ ...prevState, route_stops: updatedRows }));

    setUpdatedData(sanitizedUpdatedRows); // Keep track of the changes excluding the "site" key
  };


  const handleCellClick = (rowIndex, colIndex) => {
    setEditableCell({ rowIndex, colIndex }); // Set the cell that is being edited
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    // Handle tab key press to move to next column or row
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior (focus moving outside the table)

      const lastColumnIndex = 6; // Index of last column you want (Arrive At)
      const nextColIndex = colIndex + 1;
      const nextRowIndex = rowIndex + 1;

      // If we are at the last column of the current row
      if (nextColIndex > lastColumnIndex) {
        if (nextRowIndex < routeStops.route_stops.length) {
          // Move to the first editable cell (Depart At) of the next row
          setEditableCell({ rowIndex: nextRowIndex, colIndex: 4 });
        }
      } else {
        // Otherwise, move to the next column in the same row
        setEditableCell({ rowIndex, colIndex: nextColIndex });
      }
    }
  };

  const handleSubmit = async () => {
    // Send updated data to the API
    const payload = {};  // Initialize the payload object
    payload['route_stops'] = updatedData;
    try {
      const response = await apiService('POST', `massRouteStopsUpdate`, payload);
      if (response.success) {
        setEditableCell({ rowIndex: null, colIndex: null });

        showAlert('Data updated successfully!');
      } else {
        showAlert(response.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      showAlert(error.message);
    }
  };

  const handleDeleteRouteStop = async (id) => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      console.log(key, formData[key]);
    });
    if (formData.id) form.append('id', formData.id)
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteRouteStop', { id });
      if (!data.success) {
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);
        return;
      }

      setFormData(formData);
      fetchRouteStops(formData);
    } catch (error) {
      console.error('Error deleting site:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
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
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {routeStops?.route_stops?.map((stop, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell>{rowIndex + 1}</CTableDataCell>
                      <CTableDataCell>{stop.serial_no || ""}</CTableDataCell>
                      <CTableDataCell>{stop.route_id || ""}</CTableDataCell>
                      <CTableDataCell>{stop.site?.name || ""}</CTableDataCell>
                      <CTableDataCell
                        onClick={() => handleCellClick(rowIndex, 4)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 4)}
                        tabIndex={0}
                      >
                        {editableCell.rowIndex === rowIndex && editableCell.colIndex === 4 ? (
                          <CFormInput
                            value={stop.dept_time || ''}
                            onChange={(e) => handleInputChange(e, rowIndex, "dept_time")}
                          />
                        ) : (
                          stop.dept_time
                        )}
                      </CTableDataCell>
                      <CTableDataCell
                        onClick={() => handleCellClick(rowIndex, 5)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 5)}
                        tabIndex={0}
                      >
                        {editableCell.rowIndex === rowIndex && editableCell.colIndex === 5 ? (
                          <CFormInput
                            value={stop.arr_time || ''}
                            onChange={(e) => handleInputChange(e, rowIndex, "arr_time")}
                          />
                        ) : (
                          stop.arr_time
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{stop.delayed_time || ""}</CTableDataCell>
                      <CTableDataCell>{stop.distance || ""}</CTableDataCell>
                      <CTableDataCell>
                        {/* <CButton color="warning" size="sm" onClick={() => openEditModal(site)}>Edit</CButton>{' '} */}
                        <CButton color="danger" size="sm" onClick={() => handleDeleteRouteStop(site.id)}>Delete</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
            <CButton color="primary" onClick={handleSubmit}>
              Save Changes
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RouteStops;
