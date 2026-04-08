import React, { useEffect, useState } from 'react';
import {
  CAlert,
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
import { cilUser, cilEnvelopeClosed, cilPhone, cilLockLocked, cilBadge } from '@coreui/icons';
import apiService from 'src/services/apiService';
import DropdownSearch from '../../components/DropdownSearch';
import { FTP_BASE_URL } from 'src/services/endpoints';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const showAlert = (msg) => setError(msg);
  const clearAlert = () => setError(null);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const data = await apiService('POST', `allUsers?page=${page}`, {});
      setUsers(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
      showAlert(err.message);
    } finally {
      setLoading(false);
    }
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
            <CForm className="row g-3 align-items-end">
              <CCol md={4}>
                <CFormLabel>Name</CFormLabel>
                <CFormInput placeholder="Search by name..." />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Role</CFormLabel>
                <DropdownSearch
                  onChange={() => {}}
                  endpoint="roleDD"
                  label="Roles"
                  filter={[{}]}
                />
              </CCol>
              <CCol md="auto">
                <CButton color="primary">Search</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {error && (
          <CAlert color="danger" onClose={clearAlert} dismissible className="mb-3">{error}</CAlert>
        )}

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
                        src={FTP_BASE_URL + user.profile_picture}
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
                      {user.roles?.name && (
                        <CBadge color="primary" shape="rounded-pill">{user.roles.name}</CBadge>
                      )}
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
                        Email verified: {user.email_verified_at}
                      </div>
                    )}
                  </CCol>

                  {/* OTP + Timestamps */}
                  <CCol xs={12} md={2} className="text-end">
                    {user.otp && (
                      <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>OTP: {user.otp}</div>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--cui-secondary-color)', marginTop: 4 }}>
                      {user.created_at?.slice(0, 10)}
                    </div>
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
    </CRow>
  );
};

export default Users;
