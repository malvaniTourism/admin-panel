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
    parent_id: '',
    description: '',
    icon: null,
    status: false,
    meta_data: '',
  });
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState();

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
    const form = new FormData();
    form.append('apitype', 'list');
    if (formData.parent_id) form.append('parent_id', formData.parent_id);
    if (formData.status) form.append('status', formData.status);

    setLoading(true);
    try {
      const data = await apiService('POST', `listcategories?page=${page}`, form);
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
    setFormData((prevFormData) => {
      console.log(value);
      if (value == 2) {
        return { ...prevFormData, [name]: '' };

      }
      return { ...prevFormData, [name]: value };
    });
  };


  const handleFileChange = (e) => {
    setFormData({ ...formData, icon: e.target.files[0] });
  };

  const handleAddCategory = async () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.parent_id) form.append('parent_id', formData.parent_id);
    if (formData.description) form.append('description', formData.description);
    if (formData.icon) form.append('icon', formData.icon);
    form.append('status', formData.status ? '1' : '0');
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setLoading(true);
    try {
      const data = await apiService('POST', 'addCategory', form);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

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
    if (formData.parent_id) form.append('parent_id', formData.parent_id);
    if (formData.description) form.append('description', formData.description);
    if (formData.icon) form.append('icon', formData.icon);
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setLoading(true);
    try {
      const data = await apiService('POST', 'updateCategory', form);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

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
      const data = await apiService('POST', 'deleteCategory', { id });
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

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
      meta_data: category.meta_data,
    });
    setShowEditModal(true);
  };

  const handleSwitchChange = async (id, status) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);
    setIsChecked(!isChecked);

    setLoading(true);
    try {
      const data = await apiService('POST', 'updateCategory', formData);
      if (!data.success) {
        // Format the error messages from backend
        const errorMessages = Object.values(data.message).flat().join(', ');
        showAlert(errorMessages);  // Display all validation errors
        return;
      }

      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === id ? { ...category, status: status } : category
        )
      );
    } catch (error) {
      console.error('Error updating category:', error);
      showAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSrcDropdownChange = (id) => {
    console.log(id);
    setFormData({ ...formData, parent_id: id });
    // You can add additional logic here if needed
  };

  const handleSearch = () => {
    // Reset pagination to first page when searching
    setCurrentPage(1);
    fetchCategories(currentPage);
    // Fetch routes with the updated search criteria
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
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeInputName">
                        Name
                      </CFormLabel>
                      <CFormInput id="specificSizeInputName" placeholder="Jane Doe" />
                    </CCol>
                    <CCol sm={3}>
                      <DropdownSearch
                        onChange={handleSrcDropdownChange}
                        endpoint="listcategories"
                        label="Categories"
                        filter={[{}]}
                      />
                    </CCol>
                    <CCol sm={3}>
                      <CFormSelect id="status" name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="2">All...</option>
                        <option value="1">Enable</option>
                        <option value="0">Disable</option>
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
                          {category.icon ? <CImage src={category.icon} alt={category.name} width="50" /> : 'No Image'}
                        </CTableDataCell>
                        {/* <CTableDataCell>{category.status ? 'Active' : 'Inactive'}</CTableDataCell> */}
                        <CTableDataCell>
                          <CFormSwitch
                            id={`formSwitchCheckChecked-${category.id}`}
                            defaultChecked={category.status == 1 ? 1 : 0}
                            onChange={() => handleSwitchChange(category.id, category.status == 1 ? 0 : 1)}
                          />
                        </CTableDataCell>
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
            <CFormLabel htmlFor="parent_id">Parent Catgeory</CFormLabel>
            <DropdownSearch onChange={handleSrcDropdownChange} endpoint="listcategories" label="Parent Catgeory" filter={[{}]} />
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
            <CFormLabel htmlFor="meta_data">Meta Data</CFormLabel>
            <CFormInput id="meta_data" name="meta_data" value={formData.meta_data} onChange={handleInputChange} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleEditCategory}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Categories;
