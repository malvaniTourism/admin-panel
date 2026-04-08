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
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilPhone, cilUser, cilCommentBubble } from '@coreui/icons';
import apiService from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ name: '', status: '' });
  const activeFilters = useRef(searchFilters);

  useEffect(() => {
    fetchQueries(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchQueries = async (page) => {
    const filters = activeFilters.current;
    const form = new FormData();
    if (filters.name) form.append('search', filters.name);
    if (filters.status) form.append('status', filters.status);

    setLoading(true);
    try {
      const data = await apiService('POST', `getQueries?page=${page}`, form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setQueries(list);
      setLinks(Array.isArray(data.data) ? [] : (data.data.links || []));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeFilters.current = { ...searchFilters };
    if (currentPage === 1) {
      setSearchTrigger((t) => t + 1);
    } else {
      setCurrentPage(1);
    }
  };

  const handleSwitchChange = async (id, newStatus) => {
    const form = new FormData();
    form.append('id', id);
    form.append('status', newStatus);
    try {
      const data = await apiService('POST', 'updateQuery', form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      showSuccess(data.message);
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
    } catch (err) {
      showError(err.message);
    }
  };

  const renderPaginationLabel = (label) =>
    label.replace('&laquo;', '').replace('&raquo;', '').trim();

  const handlePaginationClick = (label) => {
    const clean = renderPaginationLabel(label);
    if (clean === 'Previous') setCurrentPage((p) => Math.max(p - 1, 1));
    else if (clean === 'Next') setCurrentPage((p) => p + 1);
    else setCurrentPage(parseInt(clean));
  };

  const statusColor = (status) => {
    if (status === 'read') return 'success';
    if (status === 'unread') return 'warning';
    return 'secondary';
  };

  return (
    <CRow>
      <CCol xs={12}>
        {/* Search Bar */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={4}>
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  placeholder="Search by name..."
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters((p) => ({ ...p, name: e.target.value }))}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </CFormSelect>
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Query Cards */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : queries.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No queries found.</CCardBody></CCard>
        ) : (
          queries.map((query) => (
            <CCard key={query.id} className="mb-3">
              <CCardBody>
                <CRow className="align-items-start g-3">
                  {/* Contact Info */}
                  <CCol xs={12} md={4}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        backgroundColor: 'var(--cui-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CIcon icon={cilUser} style={{ color: '#fff' }} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong>{query.name}</strong>
                          <CBadge color={statusColor(query.status)} shape="rounded-pill">
                            {query.status || 'unread'}
                          </CBadge>
                        </div>
                        {query.email && (
                          <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                            <CIcon icon={cilEnvelopeClosed} size="sm" className="me-1" />{query.email}
                          </div>
                        )}
                        {query.phone && (
                          <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                            <CIcon icon={cilPhone} size="sm" className="me-1" />{query.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CCol>

                  {/* Message */}
                  <CCol xs={12} md={5}>
                    {query.message && (
                      <div
                        style={{
                          backgroundColor: 'var(--cui-secondary-bg)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          fontSize: 13,
                          position: 'relative',
                        }}
                      >
                        <CIcon icon={cilCommentBubble} size="sm" className="me-1" style={{ color: 'var(--cui-secondary-color)' }} />
                        {query.message}
                      </div>
                    )}
                    {query.contactable && (
                      <div className="mt-2 d-flex gap-2 align-items-center flex-wrap" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                        <span>Query on: <strong>{query.contactable.name}</strong></span>
                        {query.contactable.category?.name && (
                          <CBadge color="primary" shape="rounded-pill">{query.contactable.category.name}</CBadge>
                        )}
                      </div>
                    )}
                  </CCol>

                  {/* Status Toggle */}
                  <CCol xs={12} md={3} className="d-flex flex-column align-items-end gap-2">
                    <CFormSwitch
                      id={`switch-${query.id}`}
                      checked={query.status === 'read'}
                      disabled={query.status === 'read'}
                      onChange={() => handleSwitchChange(query.id, query.status === 'read' ? 'unread' : 'read')}
                      label="Mark as Read"
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        {links.length > 0 && (
          <CPagination className="mt-2">
            {links.map((link, index) => (
              <CPaginationItem
                key={index}
                active={link.active}
                disabled={!link.url}
                onClick={() => link.url && handlePaginationClick(link.label)}
              >
                {renderPaginationLabel(link.label)}
              </CPaginationItem>
            ))}
          </CPagination>
        )}
      </CCol>
      <AlertModal alert={alert} onClose={clearAlert} />

    </CRow>
  );
};

export default Queries;
