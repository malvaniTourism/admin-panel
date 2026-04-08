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
import { cilCalendar, cilImage, cilLayers, cilPencil, cilTrash, cilCheckCircle, cilLink, cilBan, cilCheck, cilClock } from '@coreui/icons';
import apiService, { publicApiService } from 'src/services/apiService';
import AlertModal from 'src/components/AlertModal';
import { parseApiMessage } from 'src/utils/apiMessages';

const STATUS_COLORS = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  expired: 'secondary',
  active: 'success',
  inactive: 'secondary',
};

// PHP class paths for bannerable_type
const BANNERABLE_TYPES = [
  { value: '', label: 'Select Type...' },
  { value: 'App\\Models\\Place', label: 'Place' },
  { value: 'App\\Models\\Hotel', label: 'Hotel' },
  { value: 'App\\Models\\Restaurant', label: 'Restaurant' },
  { value: 'App\\Models\\Activity', label: 'Activity' },
];

// Native select + option style fix for dark mode
const selectStyle = {
  color: '#212631',
  backgroundColor: '#fff',
};

const emptyForm = {
  id: '',
  name: '',
  title: '',
  image: null,
  redirect_url: '',
  start_date: '',
  duration: '',
  level: '',
  image_orientation: '',
  bannerable_type: '',
  bannerable_id: '',
  status: 1,
  meta_data: '',
};

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Dropdown options — fetched once and cached
  const [daysOptions, setDaysOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [orientationOptions, setOrientationOptions] = useState([]);
  const dropdownsLoaded = useRef(false);

  // Advertising packages — fetched once on mount
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Status filter
  const [statusFilter, setStatusFilter] = useState('');
  const activeStatusFilter = useRef('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    fetchBanners(currentPage);
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const handleStatusSearch = () => {
    activeStatusFilter.current = statusFilter;
    if (currentPage !== 1) setCurrentPage(1);
    else setSearchTrigger((t) => t + 1);
  };

  const showError = (msg) => setError({ type: 'danger', message: msg });
  const showSuccess = (msg) => setError({ type: 'success', message: msg });
  const clearAlert = () => setError(null);

  // ─── List ─────────────────────────────────────────────────────────────────────

  const fetchBanners = async (page) => {
    setLoading(true);
    const body = {};
    if (activeStatusFilter.current) body.status = activeStatusFilter.current;
    try {
      const data = await apiService('POST', `listBanners?page=${page}`, body);
      if (!data.success) {
        showError(parseApiMessage(data.message) || 'Failed to load banners');
        return;
      }
      setBanners(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
      setTotal(data.data.total || 0);
    } catch (err) {
      console.error('Error fetching banners:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Advertising Packages (public, no auth) ──────────────────────────────────

  const fetchPackages = async () => {
    try {
      const data = await publicApiService('advertisingPackages');
      if (data.success) setPackages(data.data || []);
    } catch (err) {
      console.error('Error fetching advertising packages:', err);
    }
  };

  // ─── Dropdown APIs (cached) ──────────────────────────────────────────────────

  const loadDropdowns = async () => {
    if (dropdownsLoaded.current) return;
    try {
      const [days, levels, orientations] = await Promise.all([
        apiService('POST', 'bannerDaysDD'),
        apiService('POST', 'bannerLevelsDD'),
        apiService('POST', 'bannerImageOrientationDD'),
      ]);
      setDaysOptions(days.data || []);
      setLevelOptions(levels.data || []);
      setOrientationOptions(orientations.data || []);
      dropdownsLoaded.current = true;
    } catch (err) {
      console.error('Error loading banner dropdowns:', err);
    }
  };

  // ─── Open Modals ─────────────────────────────────────────────────────────────

  const openAddModal = async () => {
    setFormData(emptyForm);
    setCurrentImageUrl('');
    setSelectedPackage(null);
    setShowAddModal(true);
    await loadDropdowns();
  };

  const openEditModal = async (banner) => {
    setShowEditModal(true);
    setCurrentImageUrl(banner.image ?? '');
    await loadDropdowns();

    setModalLoading(true);
    try {
      const data = await apiService('POST', 'getBanner', { id: banner.id });
      if (!data.success) {
        showError(parseApiMessage(data.message) || 'Failed to load banner details');
        return;
      }
      const b = data.data;
      setFormData({
        id: b.id,
        name: b.name ?? '',
        title: b.title ?? '',
        image: null,
        redirect_url: b.redirect_url ?? '',
        start_date: b.start_date ?? '',
        duration: b.duration ?? '',
        level: b.level ?? '',
        image_orientation: b.image_orientation ?? '',
        bannerable_type: b.bannerable_type ?? '',
        bannerable_id: b.bannerable_id ?? '',
        status: b.status ?? 1,
        meta_data: b.meta_data ? JSON.stringify(b.meta_data) : '',
      });
      if (b.image) setCurrentImageUrl(b.image);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // ─── CRUD ─────────────────────────────────────────────────────────────────────

  const normalizeDate = (val) => {
    if (!val) return '';
    // Ensure format is always "Y-m-d H:i:s" regardless of source
    const s = val.replace('T', ' ');
    return s.length === 16 ? s + ':00' : s;
  };

  const handleAddBanner = async () => {
    const form = new FormData();
    if (formData.name) form.append('name', formData.name);
    if (formData.title) form.append('title', formData.title);
    if (formData.image) form.append('image', formData.image);
    if (formData.redirect_url) form.append('redirect_url', formData.redirect_url);
    if (formData.start_date) form.append('start_date', normalizeDate(formData.start_date));
    if (formData.duration) form.append('duration', formData.duration);
    if (formData.level) form.append('level', formData.level);
    if (formData.image_orientation) form.append('image_orientation', formData.image_orientation);
    if (formData.bannerable_type) form.append('bannerable_type', formData.bannerable_type);
    if (formData.bannerable_id) form.append('bannerable_id', formData.bannerable_id);
    form.append('status', formData.status ? '1' : '0');
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setModalLoading(true);
    try {
      const data = await apiService('POST', 'addBanner', form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowAddModal(false);
      showSuccess(data.message);
      fetchBanners(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateBanner = async () => {
    const form = new FormData();
    form.append('id', formData.id);
    if (formData.name) form.append('name', formData.name);
    if (formData.title) form.append('title', formData.title);
    if (formData.image) form.append('image', formData.image);
    if (formData.redirect_url) form.append('redirect_url', formData.redirect_url);
    if (formData.start_date) form.append('start_date', normalizeDate(formData.start_date));
    if (formData.duration) form.append('duration', formData.duration);
    if (formData.level) form.append('level', formData.level);
    if (formData.image_orientation) form.append('image_orientation', formData.image_orientation);
    if (formData.bannerable_type && formData.bannerable_id) {
      form.append('bannerable_type', formData.bannerable_type);
      form.append('bannerable_id', formData.bannerable_id);
    }
    form.append('status', formData.status ? '1' : '0');
    if (formData.meta_data) form.append('meta_data', formData.meta_data);

    setModalLoading(true);
    try {
      const data = await apiService('POST', 'updateBanner', form);
      if (!data.success) {
        showError(parseApiMessage(data.message));
        return;
      }
      setShowEditModal(false);
      showSuccess(data.message);
      fetchBanners(currentPage);
    } catch (err) {
      showError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const data = await apiService('POST', 'deleteBanner', { id });
      if (!data.success) {
        showError(parseApiMessage(data.message) || 'Failed to delete banner');
        return;
      }
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showSuccess(data.message);
    } catch (err) {
      showError(err.message);
    }
  };

  // ─── Status Workflow ──────────────────────────────────────────────────────────

  const handleChangeStatus = async (banner_id, status) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    if (!window.confirm(`${label} this banner?`)) return;
    try {
      const data = await apiService('POST', 'changeBannerStatus', { banner_id, status });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setBanners((prev) => prev.map((b) => b.id === banner_id ? { ...b, status } : b));
    } catch (err) {
      showError(err.message);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setCurrentImageUrl(URL.createObjectURL(file));
  };

  const orientationHeight = (o) => {
    if (o === 'portrait') return 300;
    if (o === 'square') return 220;
    return 180;
  };

  // Apply selected package duration to the form
  const applyPackage = (pkg) => {
    setSelectedPackage(pkg.id);
    setFormData((prev) => ({ ...prev, duration: pkg.duration_days }));
  };

  // ─── Advertising Packages selector ───────────────────────────────────────────

  const PackageSelector = () => (
    <div className="mb-3">
      <CFormLabel className="fw-semibold">Choose Advertising Package</CFormLabel>
      <CRow className="g-2 mt-1">
        {packages.filter((p) => p.is_active).map((pkg) => (
          <CCol key={pkg.id} xs={6} md={4}>
            <div
              onClick={() => applyPackage(pkg)}
              style={{
                border: `2px solid ${selectedPackage === pkg.id ? 'var(--cui-primary)' : 'var(--cui-border-color)'}`,
                borderRadius: 10,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: selectedPackage === pkg.id ? 'rgba(50,31,219,0.08)' : 'var(--cui-secondary-bg)',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              {selectedPackage === pkg.id && (
                <CIcon
                  icon={cilCheckCircle}
                  style={{ position: 'absolute', top: 6, right: 6, color: 'var(--cui-primary)', fontSize: 16 }}
                />
              )}
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cui-body-color)' }}>
                {pkg.name}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--cui-primary)', margin: '4px 0' }}>
                ₹{pkg.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                {pkg.duration_days} days
              </div>
            </div>
          </CCol>
        ))}
      </CRow>
      {selectedPackage && (
        <div style={{ fontSize: 12, color: 'var(--cui-success)', marginTop: 6 }}>
          ✓ Duration auto-filled from selected package
        </div>
      )}
    </div>
  );

  // ─── Shared Form ─────────────────────────────────────────────────────────────

  const bannerForm = (isEdit = false) => (
    <CForm>
      <CRow className="g-3">

        {/* Advertising Packages (only in Add) */}
        {!isEdit && packages.length > 0 && (
          <CCol md={12}>
            <PackageSelector />
            <hr style={{ borderColor: 'var(--cui-border-color)' }} />
          </CCol>
        )}

        {/* Name */}
        <CCol md={6}>
          <CFormLabel>Name <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="2–40 characters, must be unique"
          />
        </CCol>

        {/* Title */}
        <CCol md={6}>
          <CFormLabel>Title <span className="text-body-secondary" style={{ fontSize: 12 }}>(display)</span></CFormLabel>
          <CFormInput
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Shown on the ad"
          />
        </CCol>

        {/* Redirect URL */}
        <CCol md={12}>
          <CFormLabel>Redirect URL</CFormLabel>
          <CFormInput
            name="redirect_url"
            value={formData.redirect_url}
            onChange={handleInputChange}
            placeholder="https://..."
          />
        </CCol>

        {/* Image */}
        <CCol md={12}>
          <CFormLabel>
            Image {!isEdit && <span className="text-danger">*</span>}
            {isEdit && <span className="text-body-secondary ms-1" style={{ fontSize: 12 }}>(leave empty to keep current)</span>}
          </CFormLabel>
          <CFormInput type="file" name="image" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} />
          {currentImageUrl && (
            <div className="mt-2">
              <CImage
                src={currentImageUrl}
                alt="preview"
                style={{ maxHeight: 100, maxWidth: 200, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--cui-border-color)' }}
              />
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--cui-secondary-color)', marginTop: 4 }}>
            Accepted: jpeg, jpg, png, webp
          </div>
        </CCol>

        {/* Start Date */}
        <CCol md={6}>
          <CFormLabel>Start Date <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            type="datetime-local"
            name="start_date"
            value={formData.start_date?.replace(' ', 'T').slice(0, 16)}
            onChange={(e) =>
              setFormData((p) => ({ ...p, start_date: e.target.value.replace('T', ' ') + ':00' }))
            }
          />
        </CCol>

        {/* Duration */}
        <CCol md={6}>
          <CFormLabel>Duration <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="duration" value={formData.duration} onChange={handleInputChange} style={selectStyle}>
            <option value="" style={selectStyle}>Select duration...</option>
            {daysOptions.map((o) => (
              <option key={o.code} value={o.code} style={selectStyle}>{o.name}</option>
            ))}
          </CFormSelect>
          {selectedPackage && formData.duration && (
            <div style={{ fontSize: 11, color: 'var(--cui-success)', marginTop: 3 }}>
              ✓ Set from package
            </div>
          )}
        </CCol>

        {/* Level */}
        <CCol md={6}>
          <CFormLabel>Level <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="level" value={formData.level} onChange={handleInputChange} style={selectStyle}>
            <option value="" style={selectStyle}>Select level...</option>
            {levelOptions.map((o) => (
              <option key={o.code} value={o.code} style={selectStyle}>{o.name}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Image Orientation */}
        <CCol md={6}>
          <CFormLabel>Image Orientation <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="image_orientation" value={formData.image_orientation} onChange={handleInputChange} style={selectStyle}>
            <option value="" style={selectStyle}>Select orientation...</option>
            {orientationOptions.map((o) => (
              <option key={o.code} value={o.code} style={selectStyle}>{o.name}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Entity Type */}
        <CCol md={6}>
          <CFormLabel>Entity Type <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="bannerable_type" value={formData.bannerable_type} onChange={handleInputChange} style={selectStyle}>
            {BANNERABLE_TYPES.map((t) => (
              <option key={t.value} value={t.value} style={selectStyle}>{t.label}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Entity ID */}
        <CCol md={6}>
          <CFormLabel>Entity ID <span className="text-danger">*</span></CFormLabel>
          <CFormInput
            type="number"
            name="bannerable_id"
            value={formData.bannerable_id}
            onChange={handleInputChange}
            placeholder="ID of the linked entity"
          />
        </CCol>

        {/* Status */}
        <CCol md={6}>
          <CFormLabel>Status</CFormLabel>
          <div className="mt-1">
            <CFormSwitch
              id="banner-status"
              label={formData.status ? 'Active' : 'Inactive'}
              checked={!!formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.checked ? 1 : 0 }))}
            />
          </div>
        </CCol>

        {/* Meta Data */}
        <CCol md={12}>
          <CFormLabel>
            Meta Data{' '}
            <span className="text-body-secondary" style={{ fontSize: 12 }}>(JSON, optional)</span>
          </CFormLabel>
          <CFormInput
            name="meta_data"
            value={formData.meta_data}
            onChange={handleInputChange}
            placeholder='{"key": "value"}'
          />
        </CCol>
      </CRow>
    </CForm>
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <CRow>
      <CCol xs={12}>
        {/* Toolbar + Filter */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleStatusSearch(); }}>
              <CCol md={3}>
                <CFormLabel className="mb-1">Status</CFormLabel>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" style={selectStyle}>All</option>
                  <option value="pending" style={selectStyle}>Pending</option>
                  <option value="approved" style={selectStyle}>Approved</option>
                  <option value="rejected" style={selectStyle}>Rejected</option>
                  <option value="expired" style={selectStyle}>Expired</option>
                </CFormSelect>
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Filter</CButton>
              </CCol>
              {activeStatusFilter.current && (
                <CCol md="auto">
                  <CButton color="secondary" variant="outline" onClick={() => {
                    setStatusFilter('');
                    activeStatusFilter.current = '';
                    setSearchTrigger((t) => t + 1);
                  }}>Clear</CButton>
                </CCol>
              )}
              <CCol className="ms-auto" md="auto">
                <div>
                  <strong>Banners</strong>
                  {total > 0 && <span className="ms-2 text-body-secondary" style={{ fontSize: 13 }}>{total} total</span>}
                </div>
              </CCol>
              <CCol md="auto">
                <CButton color="success" onClick={openAddModal}>+ Add Banner</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Banner Grid */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : banners.length === 0 ? (
          <CCard>
            <CCardBody className="text-center text-body-secondary py-5">No banners found.</CCardBody>
          </CCard>
        ) : (
          <CRow className="g-3">
            {banners.map((banner) => {
              const imgH = orientationHeight(banner.image_orientation);
              const isPortrait = banner.image_orientation === 'portrait';
              return (
                <CCol key={banner.id} xs={12} sm={6} md={isPortrait ? 3 : 6} xl={isPortrait ? 2 : 4}>
                  <CCard className="h-100" style={{ overflow: 'hidden' }}>

                    {/* Banner image — full width at top */}
                    <div style={{
                      position: 'relative',
                      height: imgH,
                      backgroundColor: 'var(--cui-secondary-bg)',
                      overflow: 'hidden',
                    }}>
                      {banner.image ? (
                        <CImage
                          src={banner.image}
                          alt={banner.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                          <CIcon icon={cilImage} style={{ fontSize: 40, color: 'var(--cui-secondary-color)' }} />
                          <span style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>No Image</span>
                        </div>
                      )}
                      {/* Status — top right overlay */}
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <CBadge
                          color={STATUS_COLORS[banner.status] || (banner.status ? 'success' : 'secondary')}
                          shape="rounded-pill"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {banner.status}
                        </CBadge>
                      </div>
                      {/* Level — top left overlay */}
                      {banner.level && (
                        <div style={{ position: 'absolute', top: 8, left: 8 }}>
                          <CBadge color="info" shape="rounded-pill">
                            <CIcon icon={cilLayers} size="sm" className="me-1" />L{banner.level}
                          </CBadge>
                        </div>
                      )}
                      {/* Orientation — bottom left overlay */}
                      {banner.image_orientation && (
                        <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                          <CBadge color="dark" shape="rounded-pill" style={{ fontSize: 10, opacity: 0.85 }}>
                            {banner.image_orientation}
                          </CBadge>
                        </div>
                      )}
                    </div>

                    {/* Card body — info + actions */}
                    <CCardBody className="p-3">
                      <strong style={{ fontSize: 14, display: 'block' }}>{banner.name}</strong>
                      {banner.title && (
                        <span className="text-body-secondary" style={{ fontSize: 12 }}>{banner.title}</span>
                      )}

                      {/* Date & Duration */}
                      <div className="d-flex flex-wrap gap-2 my-2" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                        {banner.start_date && (
                          <span>
                            <CIcon icon={cilCalendar} size="sm" className="me-1" />
                            {banner.start_date.slice(0, 10)}
                          </span>
                        )}
                        {banner.duration != null && (
                          <span>{banner.duration} days</span>
                        )}
                        {banner.redirect_url && (
                          <span>
                            <CIcon icon={cilLink} size="sm" className="me-1" />
                            <a href={banner.redirect_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                              URL
                            </a>
                          </span>
                        )}
                      </div>

                      {/* Linked entity */}
                      {banner.bannerable && (
                        <div className="mb-2" style={{ fontSize: 12 }}>
                          <span className="text-body-secondary">Linked: </span>
                          <strong>{banner.bannerable.name}</strong>
                          {banner.bannerable_type && (
                            <CBadge color="secondary" shape="rounded-pill" className="ms-1" style={{ fontSize: 10, fontWeight: 400 }}>
                              {BANNERABLE_TYPES.find((t) => t.value === banner.bannerable_type)?.label || banner.bannerable_type.split('\\').pop()}
                            </CBadge>
                          )}
                        </div>
                      )}

                      {/* Status workflow buttons */}
                      {(banner.status === 'pending' || banner.status === 'approved' || banner.status === 'rejected') && (
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {banner.status !== 'approved' && (
                            <CButton color="success" size="sm" variant="outline" onClick={() => handleChangeStatus(banner.id, 'approved')}>
                              <CIcon icon={cilCheck} size="sm" className="me-1" />Approve
                            </CButton>
                          )}
                          {banner.status !== 'rejected' && (
                            <CButton color="danger" size="sm" variant="outline" onClick={() => handleChangeStatus(banner.id, 'rejected')}>
                              <CIcon icon={cilBan} size="sm" className="me-1" />Reject
                            </CButton>
                          )}
                          {banner.status === 'approved' && (
                            <CButton color="secondary" size="sm" variant="outline" onClick={() => handleChangeStatus(banner.id, 'expired')}>
                              <CIcon icon={cilClock} size="sm" className="me-1" />Expire
                            </CButton>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="d-flex gap-2 mt-auto pt-1">
                        <CButton
                          color="warning"
                          size="sm"
                          className="flex-fill"
                          onClick={() => openEditModal(banner)}
                        >
                          <CIcon icon={cilPencil} className="me-1" />Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="flex-fill"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <CIcon icon={cilTrash} className="me-1" />Delete
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              );
            })}
          </CRow>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <CPagination className="mt-3">
            <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Previous
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
        )}
      </CCol>

      {/* ── Add Modal ─────────────────────────────────────────────────────────── */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="lg" scrollable>
        <CModalHeader onClose={() => setShowAddModal(false)}>
          <CModalTitle>Add Banner</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading
            ? <div className="text-center py-4"><CSpinner color="primary" /></div>
            : bannerForm(false)
          }
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleAddBanner} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : 'Add Banner'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="lg" scrollable>
        <CModalHeader onClose={() => setShowEditModal(false)}>
          <CModalTitle>Edit Banner{formData.name ? ` — ${formData.name}` : ''}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalLoading
            ? <div className="text-center py-4"><CSpinner color="primary" /></div>
            : bannerForm(true)
          }
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUpdateBanner} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <AlertModal alert={error} onClose={clearAlert} />

    </CRow>
  );
};

export default Banners;
