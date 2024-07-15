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

const Queries = () => {
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
      const data = await apiService('POST', `getQueries?page=${page}`, {});
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
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                        Preference
                      </CFormLabel>
                      <CFormSelect id="specificSizeSelect">
                        <option>Status...</option>
                        <option value="read">Read</option>
                        <option value="unread">Unread</option>
                      </CFormSelect>
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
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                      <CTableHeaderCell scope="col">message</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Query On</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Catgeory</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {queries.map((queries, index) => (
                      <CTableRow key={queries.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{queries.name}</CTableDataCell>
                        <CTableDataCell>{queries.email}</CTableDataCell>
                        <CTableDataCell>{queries.phone}</CTableDataCell>
                        <CTableDataCell>{queries.message}</CTableDataCell>
                        <CTableDataCell>{queries.status}</CTableDataCell>
                        <CTableDataCell>{queries.contactable ? queries.contactable.name : ''}</CTableDataCell>
                        <CTableDataCell>{queries.contactable ? queries.contactable.category.name : ''}</CTableDataCell>
                        <CTableDataCell>
                          <CFormSwitch
                            id={`formSwitchCheckChecked-${queries.id}`}
                            defaultChecked
                            disabled={queries.status === 'read'}
                            onChange={() => handleSwitchChange(queries.id, queries.status == 'read' ? 'unread' : 'read')}
                          />
                        </CTableDataCell>
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

export default Queries;
