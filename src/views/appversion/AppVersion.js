import React, { useEffect, useState } from 'react';
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
import { cilMobile, cilPencil, cilTrash, cilCalendar, cilLink } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const selectStyle = { color: '#212631', backgroundColor: '#fff' };

const emptyForm = {
  id: '',
  platform: 'android',
  version_number: '',
  release_date: '',
  release_notes: '',
  update_url: '',
  meta_data: '',
};

const normalizeDate = (val) => {
  if (!val) return '';
  const s = val.replace('T', ' ');
  return s.length === 16 ? s + ':00' : s;
};

const AppVersion = () => {
  const [versions, setVersions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchVersions(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchVersions = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `listAppVersions?page=${page}`, {});
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      setVersions(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
      setTotal(data.data.total || 0);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (v) => {
    setFormData({
      id: v.id,
      platform: v.platform ?? 'android',
      version_number: v.version_number ?? '',
      release_date: v.release_date?.replace(' ', 'T').slice(0, 16) ?? '',
      release_notes: v.release_notes ?? '',
      update_url: v.update_url ?? '',
      meta_data: v.meta_data ? JSON.stringify(v.meta_data) : '',
    });
    setShowEditModal(true);
  };

  const buildForm = () => {
    const form = new FormData();
    if (formData.id) form.append('id', formData.id);
    if (formData.platform) form.append('platform', formData.platform);
    if (formData.version_number) form.append('version_number', formData.version_number);
    if (formData.release_date) form.append('release_date', normalizeDate(formData.release_date));
    if (formData.release_notes) form.append('release_notes', formData.release_notes);
    if (formData.update_url) form.append('update_url', formData.update_url);
    if (formData.meta_data) form.append('meta_data', formData.meta_data);
    return form;
  };

  const handleAdd = async () => {
    setModalLoading(true);
    try {
      const data = await apiService('POST', 'addAppVersion', buildForm());
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      setShowAddModal(false);
      showSuccess(data.message);
      fetchVersions(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async () => {
    setModalLoading(true);
    try {
      const data = await apiService('POST', 'updateAppVersion', buildForm());
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      setShowEditModal(false);
      showSuccess(data.message);
      fetchVersions(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this version?')) return;
    try {
      const data = await apiService('POST', 'deleteAppVersion', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setVersions((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      showError(err.message);
    }
  };

  const platformColor = (p) => p === 'android' ? 'success' : p === 'ios' ? 'info' : 'secondary';

  const versionForm = (
    <CForm>
      <CRow className="g-3">
        <CCol md={6}>
          <CFormLabel>Platform <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="platform" value={formData.platform} onChange={handleInputChange} style={selectStyle}>
            <option value="android" style={selectStyle}>Android</option>
            <option value="ios" style={selectStyle}>iOS</option>
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormLabel>Version Number <span className="text-danger">*</span></CFormLabel>
          <CFormInput name="version_number" value={formData.version_number} onChange={handleInputChange} placeholder="e.g. 1.0.12" />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Release Date <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            type="datetime-local"
            name="release_date"
            value={formData.release_date}
            onChange={handleInputChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Update URL</CFormLabel>
          <CFormInput name="update_url" value={formData.update_url} onChange={handleInputChange} placeholder="https://..." />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Release Notes</CFormLabel>
          <CFormInput name="release_notes" value={formData.release_notes} onChange={handleInputChange} placeholder="What changed in this version..." />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Meta Data <span className="text-body-secondary" style={{ fontSize: 12 }}>(JSON, optional)</span></CFormLabel>
          <CFormInput name="meta_data" value={formData.meta_data} onChange={handleInputChange} placeholder='{"key": "value"}' />
        </CCol>
      </CRow>
    </CForm>
  );

  return (
    <CRow>
      <CCol xs={12}>
        {/* Toolbar */}
        <CCard className="mb-3">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <div>
              <strong>App Versions</strong>
              {total > 0 && <span className="ms-2 text-body-secondary" style={{ fontSize: 13 }}>{total} total</span>}
            </div>
            <CButton color="success" onClick={openAddModal}>+ Add Version</CButton>
          </CCardBody>
        </CCard>

        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : versions.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No versions found.</CCardBody></CCard>
        ) : (
          versions.map((v) => (
            <CCard key={v.id} className="mb-3">
              <CCardBody>
                <CRow className="align-items-center g-3">
                  {/* Icon */}
                  <CCol xs={12} md={1} className="text-center">
                    <div style={{
                      width: 52, height: 52, borderRadius: 10, margin: '0 auto',
                      backgroundColor: v.platform === 'android'
                        ? 'rgba(46,184,92,.15)' : 'rgba(50,31,219,.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CIcon icon={cilMobile} size="xl"
                        style={{ color: v.platform === 'android' ? 'var(--cui-success)' : 'var(--cui-primary)' }} />
                    </div>
                  </CCol>

                  {/* Info */}
                  <CCol xs={12} md={8}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <strong style={{ fontSize: 16 }}>v{v.version_number}</strong>
                      <CBadge color={platformColor(v.platform)} shape="rounded-pill" style={{ textTransform: 'capitalize' }}>
                        {v.platform}
                      </CBadge>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mb-1" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                      {v.release_date && (
                        <span>
                          <CIcon icon={cilCalendar} size="sm" className="me-1" />
                          {v.release_date.slice(0, 10)}
                        </span>
                      )}
                      {v.update_url && (
                        <span>
                          <CIcon icon={cilLink} size="sm" className="me-1" />
                          <a href={v.update_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                            {v.update_url}
                          </a>
                        </span>
                      )}
                    </div>
                    {v.release_notes && (
                      <p className="mb-0 text-body-secondary" style={{ fontSize: 13 }}>{v.release_notes}</p>
                    )}
                  </CCol>

                  {/* Actions */}
                  <CCol xs={12} md={3} className="d-flex justify-content-end gap-2">
                    <CButton color="warning" size="sm" onClick={() => openEditModal(v)}>
                      <CIcon icon={cilPencil} className="me-1" />Edit
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(v.id)}>
                      <CIcon icon={cilTrash} className="me-1" />Delete
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <CPagination className="mt-2">
            <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</CPaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</CPaginationItem>
          </CPagination>
        )}
      </CCol>

      {/* Add Modal */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg" scrollable>
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Add App Version</CModalTitle>
        </CModalHeader>
        <CModalBody>{versionForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAdd} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : 'Add Version'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg" scrollable>
        <CModalHeader onClose={() => setShowEditModal(false)}>
          <CModalTitle>Edit — v{formData.version_number}</CModalTitle>
        </CModalHeader>
        <CModalBody>{versionForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUpdate} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default AppVersion;
