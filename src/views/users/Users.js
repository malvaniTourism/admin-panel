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
  CAlert,
  CFormSwitch
} from '@coreui/react';
import apiService from 'src/services/apiService';
import DropdownSearch from '../../components/DropdownSearch';

const Users = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    status: false,
  });
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState();

  useEffect(() => {
    fetchQueries(currentPage);
  }, [currentPage]);

  const fetchQueries = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `allUsers?page=${page}`, {});
      setQueries(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching queries:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = async (id, status) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);
    setIsChecked(!isChecked);

    setLoading(true);
    try {
      await apiService('POST', 'updateQuery', formData);
      fetchQueries(currentPage);
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDestDropdownChange = (id) => {
    console.log(id);
    // setFormData({ ...formData, destination_place_id: id });
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
                  <CForm className="row gx-3 gy-2 align-items-center">
                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeInputName">
                        Name
                      </CFormLabel>
                      <CFormInput id="specificSizeInputName" placeholder="Jane Doe" />
                    </CCol>
                    <CCol sm={3}>
                      <DropdownSearch
                        onChange={handleDestDropdownChange}
                        endpoint="roleDD"
                        label="Roles"
                      />
                    </CCol>
                    <CCol xs="auto">
                      <CButton color="primary" type="submit">
                        Search
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
                      <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Language</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Is Verified</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Refferal Code</CTableHeaderCell>
                      <CTableHeaderCell scope="col">OTP</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DOB</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Profile Picture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Updated At</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {queries.map((queries, index) => (
                      <CTableRow key={queries.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{queries.name}</CTableDataCell>
                        <CTableDataCell>{queries.roles.name}</CTableDataCell>
                        <CTableDataCell>{queries.email}</CTableDataCell>
                        <CTableDataCell>{queries.email_verified_at}</CTableDataCell>
                        <CTableDataCell>{queries.mobile}</CTableDataCell>
                        <CTableDataCell>{queries.language}</CTableDataCell>
                        <CTableDataCell>{queries.isVerified}</CTableDataCell>
                        <CTableDataCell>{queries.uid}</CTableDataCell>
                        <CTableDataCell>{queries.otp}</CTableDataCell>
                        <CTableDataCell>{queries.gender}</CTableDataCell>
                        <CTableDataCell>{queries.dob}</CTableDataCell>
                        <CTableDataCell>
                          {queries.profile_picture ? <CImage src={"https://ftp.dev.tourkokan.com/" + queries.profile_picture} alt={queries.name} width="50" /> : 'No Image'}
                        </CTableDataCell>
                        <CTableDataCell>{queries.created_at}</CTableDataCell>
                        <CTableDataCell>{queries.updated_at}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => openEditModal(category)}>Edit</CButton>{' '}
                          <CButton color="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>Delete</CButton>
                        </CTableDataCell>
                        {/* <CTableDataCell>
                          <CFormSwitch
                            id={`formSwitchCheckChecked-${queries.id}`}
                            defaultChecked
                            disabled={queries.status === 'read'}
                            onChange={() => handleSwitchChange(queries.id, queries.status == 'read' ? 'unread' : 'read')}
                          />
                        </CTableDataCell> */}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination>
                  <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </CPaginationItem>
                </CPagination>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow >
  );
};

export default Users;
