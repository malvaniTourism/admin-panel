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
  CImage,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBadge, cilEnvelopeClosed, cilLockLocked, cilPhone, cilUser } from '@coreui/icons';
import apiService from 'src/services/apiService';
import { awsUrl } from 'src/services/endpoints';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const activeSearch = useRef('');

  useEffect(() => {
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const clearAlert = () => setAlert(null);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const body = { apitype: 'list' };
      if (activeSearch.current) body.search = activeSearch.current;
      const data = await apiService('POST', `listUsers?page=${page}`, body);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setUsers(list);
      setTotalPages(Array.isArray(data.data) ? 1 : (data.data.last_page || 1));
      setTotal(Array.isArray(data.data) ? list.length : (data.data.total || list.length));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeSearch.current = searchName;
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchName('');
    activeSearch.current = '';
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const genderColor = (g) => {
    if (!g) return 'secondary';
    if (g.toLowerCase() === 'male') return 'info';
    if (g.toLowerCase() === 'female') return 'danger';
    return 'secondary';
  };

  return (
    <CRow>
      <CCol xs={12}>
        {/* Search Bar */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={5}>
                <CFormLabel>Search</CFormLabel>
                <CFormInput
                  placeholder="Name, email or phone..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
              {activeSearch.current && (
                <CCol md="auto">
                  <CButton color="secondary" variant="outline" onClick={handleClear}>Clear</CButton>
                </CCol>
              )}
              {total > 0 && !loading && (
                <CCol md="auto" className="ms-auto">
                  <span className="text-body-secondary" style={{ fontSize: 13 }}>{total} user{total !== 1 ? 's' : ''}</span>
                </CCol>
              )}
            </CForm>
          </CCardBody>
        </CCard>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : users.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No users found.</CCardBody></CCard>
        ) : (
          users.map((user) => (
            <CCard key={user.id} className="mb-3">
              <CCardBody>
                <CRow className="align-items-center g-3">
                  {/* Avatar */}
                  <CCol xs={12} md={1} className="text-center">
                    {user.profile_picture ? (
                      <CImage
                        src={awsUrl(user.profile_picture)}
                        alt={user.name}
                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: 60, height: 60, borderRadius: '50%',
                        backgroundColor: 'var(--cui-secondary-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CIcon icon={cilUser} size="xl" style={{ color: 'var(--cui-secondary-color)' }} />
                      </div>
                    )}
                  </CCol>

                  {/* Main Info */}
                  <CCol xs={12} md={5}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <strong style={{ fontSize: 15 }}>{user.name}</strong>
                      {Array.isArray(user.roles)
                        ? user.roles.map((r) => (
                            <CBadge key={r.id} color="primary" shape="rounded-pill">{r.name}</CBadge>
                          ))
                        : user.roles?.name && (
                            <CBadge color="primary" shape="rounded-pill">{user.roles.name}</CBadge>
                          )
                      }
                      {user.gender && (
                        <CBadge color={genderColor(user.gender)} shape="rounded-pill">{user.gender}</CBadge>
                      )}
                      {user.isVerified == 1 && (
                        <CBadge color="success" shape="rounded-pill">
                          <CIcon icon={cilBadge} className="me-1" size="sm" />Verified
                        </CBadge>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 13, color: 'var(--cui-secondary-color)' }}>
                      {user.email && (
                        <span><CIcon icon={cilEnvelopeClosed} size="sm" className="me-1" />{user.email}</span>
                      )}
                      {user.mobile && (
                        <span><CIcon icon={cilPhone} size="sm" className="me-1" />{user.mobile}</span>
                      )}
                    </div>
                  </CCol>

                  {/* Secondary Info */}
                  <CCol xs={12} md={4}>
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 13, color: 'var(--cui-secondary-color)' }}>
                      {user.language && <span>Language: {user.language}</span>}
                      {user.dob && <span>DOB: {user.dob}</span>}
                      {user.uid && (
                        <span>
                          <CIcon icon={cilLockLocked} size="sm" className="me-1" />
                          Ref: {user.uid}
                        </span>
                      )}
                    </div>
                    {user.email_verified_at && (
                      <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)', marginTop: 4 }}>
                        Email verified: {user.email_verified_at.slice(0, 10)}
                      </div>
                    )}
                  </CCol>

                  {/* Joined */}
                  <CCol xs={12} md={2} className="text-end">
                    <div style={{ fontSize: 11, color: 'var(--cui-secondary-color)' }}>
                      Joined {user.created_at?.slice(0, 10)}
                    </div>
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

      <AlertModal alert={alert} onClose={clearAlert} />
    </CRow>
  );
};

export default Users;
