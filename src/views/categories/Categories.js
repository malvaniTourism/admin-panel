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

const Categories = () => {
  const [categories, setCategories] = useState([]);
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
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const showAlert = (errorMessage) => {
    setError(errorMessage);
  };

  const clearAlert = () => {
    setError(null);
  };

  const fetchCategories = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `listcategories?page=${page}`, {});
      setCategories(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleAddCategory = async () => {
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
      fetchCategories(currentPage);
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
      await apiService('POST', 'updateCategory', form);
      setShowEditModal(false);
      fetchCategories(currentPage);
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      await apiService('POST', 'deleteCategory', { id });
      fetchCategories(currentPage);
    } catch (error) {
      console.error('Error deleting category:', error);
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
      status: category.status,
      meta_data: category.meta_data,
    });
    setShowEditModal(true);
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
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Icon</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categories.map((category, index) => (
                      <CTableRow key={category.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{category.name}</CTableDataCell>
                        <CTableDataCell>{category.description}</CTableDataCell>
                        <CTableDataCell>
                          {category.icon ? <CImage src={"https://ftp.dev.tourkokan.com/" + category.icon} alt={category.name} width="50" /> : 'No Image'}
                        </CTableDataCell>
                        <CTableDataCell>{category.status ? 'Active' : 'Inactive'}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => openEditModal(category)}>Edit</CButton>{' '}
                          <CButton color="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>Delete</CButton>
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
          <CModalTitle>Add Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleInputChange} />
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />
            <CFormLabel htmlFor="icon">Icon</CFormLabel>
            <CFormInput type="file" id="icon" name="icon" onChange={handleFileChange} />
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>
            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleAddCategory}>Add</CButton>
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
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleInputChange} />
            <CFormLabel htmlFor="icon">Icon</CFormLabel>
            <CFormInput type="file" id="icon" name="icon" onChange={handleFileChange} />
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </CFormSelect>
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

export default Categories;
