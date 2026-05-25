import React, { useEffect, useRef, useState } from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
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
import { cilCheckCircle, cilPeople, cilXCircle } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const STATUS_COLORS = { pending: 'warning', approved: 'success', rejected: 'danger' };

const selectStyle = { color: '#212631', backgroundColor: '#fff' };

const UserRoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const activeStatus = useRef('pending');

  const [rejectModal, setRejectModal] = useState({ visible: false, id: null });
  const [adminNote, setAdminNote] = useState('');

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  useEffect(() => {
    fetchRequests(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const fetchRequests = async (page) => {
    setLoading(true);
    try {
      const body = {};
      if (activeStatus.current) body.status = activeStatus.current;
      const data = await apiService('POST', `userRoleRequests?page=${page}`, body);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setRequests(list);
      setLastPage(Array.isArray(data.data) ? 1 : (data.data.last_page || 1));
      setTotal(Array.isArray(data.data) ? list.length : (data.data.total || list.length));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    activeStatus.current = statusFilter;
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('Approve this role request?')) return;
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'approveRoleRequest', { id: requestId });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Role request approved.');
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'approved' } : r));
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id) => {
    setAdminNote('');
    setRejectModal({ visible: true, id });
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const payload = { request_id: rejectModal.id };
      if (adminNote.trim()) payload.admin_note = adminNote.trim();
      const data = await apiService('POST', 'rejectRoleRequest', payload);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Role request rejected.');
      setRequests((prev) => prev.map((r) => r.id === rejectModal.id ? { ...r, status: 'rejected', admin_note: adminNote } : r));
      setRejectModal({ visible: false, id: null });
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        {/* Filter bar */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleFilter(); }}>
              <CCol md={3}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                  <option value="" style={selectStyle}>All</option>
                  <option value="pending" style={selectStyle}>Pending</option>
                  <option value="approved" style={selectStyle}>Approved</option>
                  <option value="rejected" style={selectStyle}>Rejected</option>
                </CFormSelect>
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Filter</CButton>
              </CCol>
              {total > 0 && !loading && (
                <CCol md="auto" className="ms-auto">
                  <span className="text-body-secondary" style={{ fontSize: 13 }}>{total} request{total !== 1 ? 's' : ''}</span>
                </CCol>
              )}
            </CForm>
          </CCardBody>
        </CCard>

        {/* List */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : requests.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No role requests found.</CCardBody></CCard>
        ) : (
          requests.map((req) => (
            <CCard key={req.id} className="mb-3">
              <CCardBody>
                <CRow className="g-2 align-items-start">
                  <CCol xs={12} md={7}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <CIcon icon={cilPeople} size="sm" />
                      <strong style={{ fontSize: 15 }}>{req.user?.name ?? `User #${req.user_id}`}</strong>
                      {req.user?.email && (
                        <span className="text-body-secondary" style={{ fontSize: 12 }}>{req.user.email}</span>
                      )}
                      <CBadge color={STATUS_COLORS[req.status] || 'secondary'} shape="rounded-pill">
                        {req.status}
                      </CBadge>
                      {req.role && (
                        <CBadge color="info" shape="rounded-pill">{req.role.name}</CBadge>
                      )}
                    </div>

                    {req.reason && (
                      <p className="mb-1 text-body-secondary" style={{ fontSize: 13 }}>
                        Reason: {req.reason}
                      </p>
                    )}
                    {req.admin_note && (
                      <p className="mb-0" style={{ fontSize: 12, color: 'var(--cui-danger)' }}>
                        Admin note: {req.admin_note}
                      </p>
                    )}
                    {req.reviewed_at && (
                      <p className="mb-0 text-body-secondary" style={{ fontSize: 11 }}>
                        Reviewed: {req.reviewed_at.slice(0, 10)}
                      </p>
                    )}
                  </CCol>

                  <CCol xs={12} md={5} className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <span className="text-body-secondary" style={{ fontSize: 11 }}>
                      {req.created_at?.slice(0, 10)}
                    </span>
                    {req.status === 'pending' && (
                      <>
                        <CButton
                          color="success"
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={actionLoading}
                        >
                          <CIcon icon={cilCheckCircle} className="me-1" />Approve
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => openRejectModal(req.id)}
                          disabled={actionLoading}
                        >
                          <CIcon icon={cilXCircle} className="me-1" />Reject
                        </CButton>
                      </>
                    )}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <CPagination className="mt-2">
            <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</CPaginationItem>
            {Array.from({ length: lastPage }, (_, i) => (
              <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage >= lastPage} onClick={() => setCurrentPage((p) => p + 1)}>Next</CPaginationItem>
          </CPagination>
        )}
      </CCol>

      {/* Reject Modal */}
      <CModal visible={rejectModal.visible} onClose={() => setRejectModal({ visible: false, id: null })}>
        <CModalHeader><CModalTitle>Reject Role Request</CModalTitle></CModalHeader>
        <CModalBody>
          <CFormLabel>Admin Note <span className="text-body-secondary" style={{ fontSize: 12 }}>(optional — shown to user)</span></CFormLabel>
          <CFormTextarea
            rows={3}
            placeholder="Reason for rejection..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRejectModal({ visible: false, id: null })}>Cancel</CButton>
          <CButton color="danger" onClick={handleReject} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilXCircle} className="me-1" />Reject</>}
          </CButton>
        </CModalFooter>
      </CModal>

      <AlertModal alert={alert} onClose={clearAlert} />
    </CRow>
  );
};

export default UserRoleRequests;
