import React, { useEffect, useRef, useState } from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CForm,
  CFormLabel,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilUser, cilXCircle } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const selectStyle = { color: '#212631', backgroundColor: '#fff' };

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const activeStatus = useRef('pending');
  const [actionLoading, setActionLoading] = useState(false);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  useEffect(() => {
    fetchComments(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const fetchComments = async (page) => {
    setLoading(true);
    try {
      const endpoint = activeStatus.current === 'pending' ? 'pendingComments' : 'listComments';
      const payload = { per_page: 15 };
      if (activeStatus.current === 'approved') payload.status = true;
      if (activeStatus.current === 'rejected') payload.status = false;
      const data = await apiService('POST', `${endpoint}?page=${page}`, payload);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setComments(list);
      setLinks(Array.isArray(data.data) ? [] : (data.data.links || []));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeStatus.current = statusFilter;
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'approveComment', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Comment approved.');
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'rejectComment', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Comment removed.');
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      showError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaginationClick = (label) => {
    const clean = label.replace('&laquo;', '').replace('&raquo;', '').trim();
    if (clean === 'Previous') setCurrentPage((p) => Math.max(p - 1, 1));
    else if (clean === 'Next') setCurrentPage((p) => p + 1);
    else setCurrentPage(parseInt(clean));
  };

  const modelLabel = (type) => type?.split('\\').pop() || type;

  return (
    <CRow>
      <CCol xs={12}>
        {/* Filters */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={3}>
                <CFormLabel>Filter</CFormLabel>
                <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                  <option value="pending" style={selectStyle}>Pending</option>
                  <option value="approved" style={selectStyle}>Approved</option>
                  <option value="all" style={selectStyle}>All</option>
                </CFormSelect>
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Apply</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : comments.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No comments found.</CCardBody></CCard>
        ) : (
          comments.map((c) => (
            <CCard key={c.id} className="mb-3">
              <CCardBody>
                <CRow className="g-3 align-items-center">
                  <CCol xs={12} md={8}>
                    {/* Comment bubble */}
                    <div style={{
                      backgroundColor: 'rgba(0,0,21,.05)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      marginBottom: 8,
                      fontSize: 14,
                      borderLeft: '3px solid var(--cui-primary)',
                    }}>
                      {c.comment}
                    </div>
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                      {c.users && (
                        <span><CIcon icon={cilUser} size="sm" className="me-1" />{c.users.name}</span>
                      )}
                      {c.commentable_type && (
                        <CBadge color="info" shape="rounded-pill">{modelLabel(c.commentable_type)} #{c.commentable_id}</CBadge>
                      )}
                      <CBadge color={c.status ? 'success' : 'warning'} shape="rounded-pill">
                        {c.status ? 'Approved' : 'Pending'}
                      </CBadge>
                      {c.created_at && <span>{c.created_at?.slice(0, 10)}</span>}
                    </div>
                  </CCol>
                  <CCol xs={12} md={4} className="d-flex justify-content-end gap-2">
                    {!c.status && (
                      <CButton color="success" size="sm" onClick={() => handleApprove(c.id)} disabled={actionLoading}>
                        <CIcon icon={cilCheckCircle} className="me-1" />Approve
                      </CButton>
                    )}
                    <CButton color="danger" size="sm" onClick={() => handleReject(c.id)} disabled={actionLoading}>
                      <CIcon icon={cilXCircle} className="me-1" />Reject
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {links.length > 0 && (
          <CPagination className="mt-2">
            {links.map((link, i) => (
              <CPaginationItem key={i} active={link.active} disabled={!link.url}
                onClick={() => link.url && handlePaginationClick(link.label)}>
                {link.label.replace('&laquo;', '').replace('&raquo;', '').trim()}
              </CPaginationItem>
            ))}
          </CPagination>
        )}
      </CCol>

      <AlertModal alert={alert} onClose={clearAlert} />
    </CRow>
  );
};

export default Comments;
