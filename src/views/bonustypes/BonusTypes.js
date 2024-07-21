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

const BonusTypes = () => {
  const [categories, setBonusTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    amount: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState();

  useEffect(() => {
    fetchBonusTypes(currentPage);
  }, [currentPage]);

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchBonusTypes = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `listBonusTypes?page=${page}`, {});
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setBonusTypes(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBonusType = async () => {
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

  const handleEditBonusType = async () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.code) form.append('code', formData.code);
    if (formData.amount) form.append('amount', formData.amount);
    if (formData.description) form.append('description', formData.description);

    setLoading(true);
    try {
      const data = await apiService('POST', 'updateBonusType', form);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setShowEditModal(false);
      fetchBonusTypes(currentPage);
    } catch (error) {
      console.error('Error updating Bonus Type:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBonusType = async (id) => {
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteBonusType', { id });
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      fetchBonusTypes(currentPage);
    } catch (error) {
      console.error('Error deleting Bonus Type:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      code: category.code,
      amount: category.amount,
      description: category.description,
    });
    setShowEditModal(true);
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody>
                  <CCol xs="auto">
                    <CButton color="primary" onClick={() => setShowAddModal(true)}>
                      Add
                    </CButton>
                  </CCol>
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
                      <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Updated At</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categories.map((category, index) => (
                      <CTableRow key={category.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{category.name}</CTableDataCell>
                        <CTableDataCell>{category.code}</CTableDataCell>
                        <CTableDataCell>{category.amount}</CTableDataCell>
                        <CTableDataCell>{category.description}</CTableDataCell>
                        <CTableDataCell>{category.created_at}</CTableDataCell>
                        <CTableDataCell>{category.updated_at}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => openEditModal(category)}>Edit</CButton>{' '}
                          <CButton color="danger" size="sm" onClick={() => handleDeleteBonusType(category.id)}>Delete</CButton>
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
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Add Bonus Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />
            <CFormLabel htmlFor="code">Code</CFormLabel>
            <CFormInput id="code" name="code" value={formData.code} onChange={handleInputChange} />
            <CFormLabel htmlFor="amount">Amount</CFormLabel>
            <CFormInput id="amount" name="amount" value={formData.amount} onChange={handleInputChange} />
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleAddBonusType}>Add</CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader onClose={() => setShowEditModal(false)}>
          <CModalTitle>Edit Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
          <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />
            <CFormLabel htmlFor="code">Code</CFormLabel>
            <CFormInput id="code" name="code" value={formData.code} onChange={handleInputChange} />
            <CFormLabel htmlFor="amount">Amount</CFormLabel>
            <CFormInput id="amount" name="amount" value={formData.amount} onChange={handleInputChange} />
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleEditBonusType}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default BonusTypes;
