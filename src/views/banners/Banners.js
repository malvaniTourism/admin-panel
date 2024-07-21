import React, { useEffect, useState } from 'react'
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
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import apiService from 'src/services/apiService';
import DropdownSearch from '../../components/DropdownSearch';

const Banners = () => {
  const [banners, setBanners] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchBanners(currentPage)
  }, [currentPage])

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchBanners = async (page) => {
    const token = localStorage.getItem('token')
    setLoading(true)

    try {
      const data = await apiService('POST', `listBanners?page=${page}`, {});

      if (data.success == false) {
        showAlert(data?.message || 'Something went wrong');
        return;
      }

      console.log('API response:', data)

      if (data && data.data) {
        setBanners(data.data.data || [])
        setTotalPages(data.data.last_page || 1)
      } else {
        throw new Error('Invalid data structure')
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBanners = async () => {
    const form = new FormData();
    if (formData.name) form.append('name', formData.name);
    if (formData.code) form.append('code', formData.code);
    if (formData.amount) form.append('amount', formData.amount);
    if (formData.description) form.append('description', formData.description);

    setLoading(true);
    try {
      const data = await apiService('POST', 'addBonusType', form);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setShowAddModal(false);
      fetchBonusTypes(currentPage);
    } catch (error) {
      console.error('Error adding bonus type:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      console.log(value);
      if (value == 2) {
        return { ...prevFormData, [name]: '' };

      }
      return { ...prevFormData, [name]: value };
    });
  };


  const handleSrcDropdownChange = (id) => {
    console.log(id);
    setFormData({ ...formData, parent_id: id });
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
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                        Preference
                      </CFormLabel>
                      <CFormSelect id="specificSizeSelect">
                        <option>Category...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </CFormSelect>
                    </CCol>

                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                        Preference
                      </CFormLabel>
                      <CFormSelect id="specificSizeSelect">
                        <option>City...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </CFormSelect>
                    </CCol>

                    <CCol xs="auto">
                      <CButton color="primary" type="submit">
                        Submit
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
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Level</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Image Orientation</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Banner Owner</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Banner Owner Category</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {banners.map((banner, index) => (
                      <CTableRow key={banner.id}>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{banner.name}</CTableDataCell>
                        <CTableDataCell>{banner.image}</CTableDataCell>
                        <CTableDataCell>{banner.start_date}</CTableDataCell>
                        <CTableDataCell>{banner.duration}</CTableDataCell>
                        <CTableDataCell>{banner.level}</CTableDataCell>
                        <CTableDataCell>{banner.image_orientation}</CTableDataCell>
                        <CTableDataCell>{banner.status ? 'true' : 'false'}</CTableDataCell>
                        <CTableDataCell>{banner.bannerable.name}</CTableDataCell>
                        <CTableDataCell>
                          {banner.bannerable.categories && banner.bannerable.categories.length > 0 ? (
                            banner.bannerable.categories.map((category) => (
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
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Add Bonus Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />
            <CFormLabel htmlFor="image">Image</CFormLabel>
            <CFormInput id="image" name="image" value={formData.image} onChange={handleInputChange} />
            <CFormLabel htmlFor="start_date">Start Date</CFormLabel>
            <CFormInput id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
            <CFormLabel htmlFor="banner_days">Banner Days</CFormLabel>
            <DropdownSearch onChange={handleSrcDropdownChange} endpoint="bannerDaysDD" label="Duration" filter={[{}]}/>
            <CFormLabel htmlFor="level">Level</CFormLabel>
            <CFormInput id="level" name="level" value={formData.level} onChange={handleInputChange} />
            <CFormLabel htmlFor="image_orientation">Image Orientation</CFormLabel>
            <CFormInput id="image_orientation" name="image_orientation" value={formData.image_orientation} onChange={handleInputChange} />
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormInput id="status" name="status" value={formData.status} onChange={handleInputChange} />
            <CFormLabel htmlFor="bannerable_type">Bannerable Type</CFormLabel>
            <CFormInput id="bannerable_type" name="bannerable_type" value={formData.bannerable_type} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleAddBanners}>Add</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Banners
