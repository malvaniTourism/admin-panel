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
import { cilEnvelopeClosed, cilPencil, cilSend, cilTrash, cilUser } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';
import DropdownSearch from 'src/components/DropdownSearch';

const emptyForm = { user_id: '', subject: '', message: '' };

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [alert, setAlert] = useState(null);
  const [searchTrigger] = useState(0);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  useEffect(() => {
    fetchMessages(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const fetchMessages = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `listMessages?page=${page}`, { per_page: 15 });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setMessages(list);
      setLinks(Array.isArray(data.data) ? [] : (data.data.links || []));
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

  const handleSend = async () => {
    if (!formData.user_id || !formData.message.trim()) {
      showError('User and message are required.');
      return;
    }
    setModalLoading(true);
    try {
      const data = await apiService('POST', 'sendMessage', {
        user_id: formData.user_id,
        subject: formData.subject,
        message: formData.message,
      });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Message sent.');
      setShowModal(false);
      setFormData(emptyForm);
      fetchMessages(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const data = await apiService('POST', 'deleteMessage', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Message deleted.');
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      showError(err.message);
    }
  };

  const handlePaginationClick = (label) => {
    const clean = label.replace('&laquo;', '').replace('&raquo;', '').trim();
    if (clean === 'Previous') setCurrentPage((p) => Math.max(p - 1, 1));
    else if (clean === 'Next') setCurrentPage((p) => p + 1);
    else setCurrentPage(parseInt(clean));
  };

  return (
    <CRow>
      <CCol xs={12}>
        {/* Toolbar */}
        <CCard className="mb-3">
          <CCardBody className="d-flex justify-content-between align-items-center">
            <strong>Messages to Users</strong>
            <CButton color="primary" onClick={() => { setFormData(emptyForm); setShowModal(true); }}>
              <CIcon icon={cilSend} className="me-1" />Send Message
            </CButton>
          </CCardBody>
        </CCard>

        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : messages.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No messages sent yet.</CCardBody></CCard>
        ) : (
          messages.map((m) => (
            <CCard key={m.id} className="mb-3">
              <CCardBody>
                <CRow className="g-3 align-items-center">
                  <CCol xs={12} md={1} className="text-center">
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', margin: '0 auto',
                      backgroundColor: 'rgba(50,31,219,.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CIcon icon={cilEnvelopeClosed} style={{ color: 'var(--cui-primary)' }} />
                    </div>
                  </CCol>
                  <CCol xs={12} md={8}>
                    {m.subject && <strong style={{ fontSize: 15 }}>{m.subject}</strong>}
                    <p className="mb-1 text-body-secondary" style={{ fontSize: 13 }}>{m.message}</p>
                    <div className="d-flex flex-wrap gap-2" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                      {m.user && (
                        <span><CIcon icon={cilUser} size="sm" className="me-1" />{m.user.name} ({m.user.email})</span>
                      )}
                      {m.is_read !== undefined && (
                        <CBadge color={m.is_read ? 'success' : 'warning'} shape="rounded-pill">
                          {m.is_read ? 'Read' : 'Unread'}
                        </CBadge>
                      )}
                      {m.created_at && <span>{m.created_at?.slice(0, 10)}</span>}
                    </div>
                  </CCol>
                  <CCol xs={12} md={3} className="d-flex justify-content-end gap-2">
                    <CButton color="danger" size="sm" onClick={() => handleDelete(m.id)}>
                      <CIcon icon={cilTrash} className="me-1" />Delete
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

      {/* Send Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader><CModalTitle>Send Message to User</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="g-3">
              <CCol md={12}>
                <CFormLabel>User <span className="text-danger">*</span></CFormLabel>
                <DropdownSearch
                  endpoint="listUsers"
                  label="Select User"
                  filter={[]}
                  valueKey="id"
                  onChange={(id) => setFormData((p) => ({ ...p, user_id: id }))}
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Subject</CFormLabel>
                <CFormInput name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Optional subject..." />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Message <span className="text-danger">*</span></CFormLabel>
                <CFormTextarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Write your message..."
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSend} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilSend} className="me-1" />Send</>}
          </CButton>
        </CModalFooter>
      </CModal>

      <AlertModal alert={alert} onClose={clearAlert} />
    </CRow>
  );
};

export default Messages;
