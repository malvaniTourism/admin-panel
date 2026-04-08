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
  CFormSwitch,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilTag } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import DropdownSearch from '../../components/DropdownSearch';
import { FTP_BASE_URL } from 'src/services/endpoints';
import { parseApiMessage } from 'src/utils/apiMessages';

const resolveImageUrl = (path) => {
  if (!path) return null;
  return /^https?:\/\//i.test(path) ? path : `${FTP_BASE_URL}${path}`;
};

const emptyForm = {
  id: '',
  name: '',
  parent_id: '',
  description: '',
  icon: null,
  status: false,
  meta_data: '',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [currentIconUrl, setCurrentIconUrl] = useState('');
  const [alert, setAlert] = useState(null); // { type: 'success'|'danger', message }

  // Filter: parent_id — committed to ref only on Search click
  const [filterParentId, setFilterParentId] = useState(null);
  const activeParentId = useRef(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    fetchCategories(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchCategories = async (page) => {
    const body = { apitype: 'list', per_page: 15 };
    if (activeParentId.current) body.parent_id = activeParentId.current;
    setLoading(true);
    try {
      const data = await apiService('POST', `listcategories?page=${page}`, body);
      setCategories(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (err) {
      console.error('Error fetching categories:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeParentId.current = filterParentId;
    if (currentPage !== 1) {
      setCurrentPage(1); // useEffect will fire
    } else {
      setSearchTrigger((t) => t + 1); // force re-fetch on same page
    }
  };

  const handleClearFilter = () => {
    setFilterParentId(null);
    activeParentId.current = null;
    setCurrentPage(1);
    setSearchTrigger((t) => t + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, icon: file }));
    if (file) setCurrentIconUrl(URL.createObjectURL(file));
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setCurrentIconUrl('');
    setShowAddModal(true);
  };

  const openEditModal = (category) => {
    setFormData({
      id: category.id,
      name: category.name ?? '',
      parent_id: category.parent_id ?? '',
      description: category.description ?? '',
      icon: null,           // null = no new file selected; only sent if user picks a file
      status: category.status ?? false,
      meta_data: category.meta_data ?? '',
    });
    setCurrentIconUrl(resolveImageUrl(category.icon) ?? '');
    setShowEditModal(true);
  };

  const handleAddCategory = async () => {
    // Use multipart only when an icon file is selected; otherwise plain JSON
    let payload;
    if (formData.icon instanceof File) {
      const form = new FormData();
      if (formData.name) form.append('name', formData.name);
      if (formData.parent_id) form.append('parent_id', formData.parent_id);
      if (formData.description) form.append('description', formData.description);
      form.append('icon', formData.icon);
      form.append('status', formData.status ? '1' : '0');
      if (formData.meta_data) form.append('meta_data', formData.meta_data);
      payload = form;
    } else {
      payload = {
        ...(formData.name && { name: formData.name }),
        ...(formData.parent_id && { parent_id: formData.parent_id }),
        ...(formData.description && { description: formData.description }),
        status: !!formData.status,
        ...(formData.meta_data && { meta_data: formData.meta_data }),
      };
    }

    setLoading(true);
    try {
      const data = await apiService('POST', 'addCategory', payload);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowAddModal(false);
      showSuccess(data.message);
      fetchCategories(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    // Use multipart only when a new icon file is selected; otherwise plain JSON
    let payload;
    if (formData.icon instanceof File) {
      const form = new FormData();
      form.append('id', formData.id);
      if (formData.name) form.append('name', formData.name);
      if (formData.parent_id) form.append('parent_id', formData.parent_id);
      if (formData.description) form.append('description', formData.description);
      form.append('icon', formData.icon);
      form.append('status', formData.status ? '1' : '0');
      if (formData.meta_data) form.append('meta_data', formData.meta_data);
      payload = form;
    } else {
      payload = {
        id: formData.id,
        ...(formData.name && { name: formData.name }),
        ...(formData.parent_id && { parent_id: formData.parent_id }),
        ...(formData.description && { description: formData.description }),
        status: !!formData.status,
        ...(formData.meta_data && { meta_data: formData.meta_data }),
      };
    }

    setLoading(true);
    try {
      const data = await apiService('POST', 'updateCategory', payload);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowEditModal(false);
      showSuccess(data.message);
      fetchCategories(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteCategory', { id });
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      showSuccess(data.message);
      fetchCategories(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = async (id, newStatus) => {
    try {
      const data = await apiService('POST', 'updateCategory', { id, status: !!newStatus });
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      showError(err.message);
    }
  };

  const categoryForm = (
    <CForm>
      <CRow className="g-3">
        <CCol md={12}>
          <CFormLabel>Name</CFormLabel>
          <CFormInput name="name" value={formData.name} onChange={handleInputChange} />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Parent Category</CFormLabel>
          <DropdownSearch
            onChange={(id) => setFormData((p) => ({ ...p, parent_id: id }))}
            endpoint="listcategories"
            label="Parent Category"
            filter={[{ apitype: 'dropdown' }]}
          />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Description</CFormLabel>
          <CFormInput name="description" value={formData.description} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Status</CFormLabel>
          <CFormSelect name="status" value={formData.status} onChange={handleInputChange}>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormLabel>Icon {currentIconUrl && <span className="text-body-secondary ms-1" style={{ fontSize: 12 }}>(leave empty to keep current)</span>}</CFormLabel>
          <CFormInput type="file" name="icon" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={handleFileChange} />
          {currentIconUrl && (
            <CImage
              src={currentIconUrl}
              alt="current icon"
              style={{ marginTop: 8, width: 48, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--cui-border-color)' }}
            />
          )}
        </CCol>
        <CCol md={12}>
          <CFormLabel>Meta Data (JSON)</CFormLabel>
          <CFormInput name="meta_data" value={formData.meta_data} onChange={handleInputChange} />
        </CCol>
      </CRow>
    </CForm>
  );

  return (
    <CRow>
      <CCol xs={12}>
        {/* Toolbar + Filter */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={5}>
                <CFormLabel className="fw-semibold mb-1">Filter by Parent Category</CFormLabel>
                <DropdownSearch
                  onChange={(id) => setFilterParentId(id)}
                  endpoint="listcategories"
                  label="Select parent category..."
                  filter={[{ apitype: 'dropdown' }]}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
              {activeParentId.current && (
                <CCol md="auto">
                  <CButton color="secondary" variant="outline" onClick={handleClearFilter}>Clear</CButton>
                </CCol>
              )}
              <CCol className="ms-auto" md="auto">
                <CButton color="success" onClick={openAddModal}>+ Add Category</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : categories.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No categories found.</CCardBody></CCard>
        ) : (
          categories.map((category) => (
            <CCard key={category.id} className="mb-3">
              <CCardBody>
                <CRow className="align-items-center g-3">
                  {/* Icon */}
                  <CCol xs={12} md={1} className="text-center">
                    {category.icon ? (
                      <CImage
                        src={resolveImageUrl(category.icon)}
                        alt={category.name}
                        style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8 }}
                      />
                    ) : (
                      <div style={{
                        width: 56, height: 56, borderRadius: 8,
                        backgroundColor: 'var(--cui-secondary-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CIcon icon={cilTag} size="xl" style={{ color: 'var(--cui-secondary-color)' }} />
                      </div>
                    )}
                  </CCol>

                  {/* Info */}
                  <CCol xs={12} md={8}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong style={{ fontSize: 15 }}>{category.name}</strong>
                      <CBadge color={category.status == 1 ? 'success' : 'secondary'} shape="rounded-pill">
                        {category.status == 1 ? 'Active' : 'Inactive'}
                      </CBadge>
                    </div>
                    {category.description && (
                      <p className="mb-0 text-body-secondary" style={{ fontSize: 13 }}>{category.description}</p>
                    )}
                  </CCol>

                  {/* Actions */}
                  <CCol xs={12} md={3} className="d-flex justify-content-end align-items-center gap-3">
                    <CFormSwitch
                      id={`switch-${category.id}`}
                      checked={category.status == 1}
                      onChange={() => handleSwitchChange(category.id, category.status == 1 ? 0 : 1)}
                      label="Active"
                    />
                    <CButton color="warning" size="sm" onClick={() => openEditModal(category)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        <CPagination className="mt-2">
          <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</CPaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</CPaginationItem>
          ))}
          <CPaginationItem disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</CPaginationItem>
        </CPagination>
      </CCol>

      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg">
        <CModalHeader><CModalTitle>Add Category</CModalTitle></CModalHeader>
        <CModalBody>{categoryForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddCategory} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        <CModalHeader><CModalTitle>Edit — {formData.name}</CModalTitle></CModalHeader>
        <CModalBody>{categoryForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditCategory} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default Categories;
