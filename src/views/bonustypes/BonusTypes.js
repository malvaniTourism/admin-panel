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
import { cilPencil, cilTrash, cilDollar } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const emptyForm = {
  id: '',
  name: '',
  code: '',
  amount: '',
  description: '',
};

const BonusTypes = () => {
  const [bonusTypes, setBonusTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchBonusTypes(currentPage);
  }, [currentPage]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchBonusTypes = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `listBonusTypes?page=${page}`, {});
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setBonusTypes(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (err) {
      console.error('Error fetching bonus types:', err);
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

  const openEditModal = (bt) => {
    setFormData({
      id: bt.id,
      name: bt.name ?? '',
      code: bt.code ?? '',
      amount: bt.amount ?? '',
      description: bt.description ?? '',
    });
    setShowEditModal(true);
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
        showError(parseApiMessage(data.message));
        return;
      }
      setShowAddModal(false);
      showSuccess(data.message);
      fetchBonusTypes(currentPage);
    } catch (err) {
      showError(err.message);
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
        showError(parseApiMessage(data.message));
        return;
      }
      setShowEditModal(false);
      showSuccess(data.message);
      fetchBonusTypes(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBonusType = async (id) => {
    if (!window.confirm('Delete this bonus type?')) return;
    setLoading(true);
    try {
      const data = await apiService('POST', 'deleteBonusType', { id });
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      showSuccess(data.message);
      fetchBonusTypes(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bonusForm = (
    <CForm>
      <CRow className="g-3">
        <CCol md={6}>
          <CFormLabel>Name</CFormLabel>
          <CFormInput name="name" value={formData.name} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Code</CFormLabel>
          <CFormInput name="code" value={formData.code} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Amount</CFormLabel>
          <CFormInput name="amount" type="number" value={formData.amount} onChange={handleInputChange} />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Description</CFormLabel>
          <CFormInput name="description" value={formData.description} onChange={handleInputChange} />
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
            <strong>Bonus Types</strong>
            <CButton color="success" onClick={openAddModal}>+ Add Bonus Type</CButton>
          </CCardBody>
        </CCard>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : bonusTypes.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No bonus types found.</CCardBody></CCard>
        ) : (
          bonusTypes.map((bt) => (
            <CCard key={bt.id} className="mb-3">
              <CCardBody>
                <CRow className="align-items-center g-3">
                  {/* Icon + Code */}
                  <CCol xs={12} md={1} className="text-center">
                    <div style={{
                      width: 52, height: 52, borderRadius: 10,
                      backgroundColor: 'var(--cui-success-bg-subtle, rgba(46,184,92,.15))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                    }}>
                      <CIcon icon={cilDollar} size="xl" style={{ color: 'var(--cui-success)' }} />
                    </div>
                  </CCol>

                  {/* Info */}
                  <CCol xs={12} md={8}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <strong style={{ fontSize: 15 }}>{bt.name}</strong>
                      {bt.code && (
                        <CBadge color="dark" shape="rounded-pill" style={{ fontFamily: 'monospace' }}>
                          {bt.code}
                        </CBadge>
                      )}
                      {bt.amount != null && (
                        <CBadge color="success" shape="rounded-pill">
                          {bt.amount} coins
                        </CBadge>
                      )}
                    </div>
                    {bt.description && (
                      <p className="mb-0 text-body-secondary" style={{ fontSize: 13 }}>{bt.description}</p>
                    )}
                    <div className="mt-1" style={{ fontSize: 11, color: 'var(--cui-secondary-color)' }}>
                      {bt.created_at && <span>Created: {bt.created_at?.slice(0, 10)}</span>}
                    </div>
                  </CCol>

                  {/* Actions */}
                  <CCol xs={12} md={3} className="d-flex justify-content-end gap-2">
                    <CButton color="warning" size="sm" onClick={() => openEditModal(bt)}>
                      <CIcon icon={cilPencil} className="me-1" />Edit
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteBonusType(bt.id)}>
                      <CIcon icon={cilTrash} className="me-1" />Delete
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
        <CModalHeader><CModalTitle>Add Bonus Type</CModalTitle></CModalHeader>
        <CModalBody>{bonusForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddBonusType} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        <CModalHeader><CModalTitle>Edit — {formData.name}</CModalTitle></CModalHeader>
        <CModalBody>{bonusForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleEditBonusType} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default BonusTypes;
