import React, { useEffect, useRef, useState } from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBarChart,
  cilCalendar,
  cilCheckCircle,
  cilCloudUpload,
  cilImage,
  cilLocationPin,
  cilPencil,
  cilStar,
  cilTrash,
  cilUser,
  cilVideo,
  cilWifiSignalOff,
  cilXCircle,
} from '@coreui/icons';
import apiService from 'src/services/apiService';
import { awsUrl } from 'src/services/endpoints';
import AlertModal from 'src/components/AlertModal';
import DropdownSearch from 'src/components/DropdownSearch';
import { parseApiMessage } from 'src/utils/apiMessages';

const selectStyle = { color: '#212631', backgroundColor: '#fff' };

const TALUKAS = ['Devgad', 'Kudal', 'Malvan', 'Sawantwadi', 'Vengurla', 'Dodamarg', 'Kankavli', 'Vaibhavvadi'];
const STATUSES = ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed'];
const STATUS_COLORS = { approved: 'success', rejected: 'danger', pending: 'warning', cancelled: 'secondary', completed: 'info', draft: 'light' };

const emptyForm = {
  id: '',
  user_id: '',
  event_type_id: '',
  site_id: '',
  title: '',
  description: '',
  address: '',
  taluka: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  venue_name: '',
  organizer_name: '',
  organizer_phone: '',
  organizer_email: '',
  is_free: true,
  entry_fee: '',
  registration_required: false,
  registration_link: '',
  max_participants: '',
  tags: '',
  status: 'approved',
  video_url: '',
  banner_image_url: '',
};

const emptyApproveForm = { admin_notes: '', is_featured: false, featured_until: '', send_notification: false };
const emptyFeatureForm = { is_featured: true, featured_until: '' };

const Events = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [talukaFilter, setTalukaFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const activeFilters = useRef({ status: '', taluka: '', search: '' });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  // Media
  const [bannerFile, setBannerFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef(null);

  const [approveModal, setApproveModal] = useState({ visible: false, id: null });
  const [approveForm, setApproveForm] = useState(emptyApproveForm);

  const [rejectModal, setRejectModal] = useState({ visible: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const [featureModal, setFeatureModal] = useState({ visible: false, id: null, current: false });
  const [featureForm, setFeatureForm] = useState(emptyFeatureForm);

  const [analyticsModal, setAnalyticsModal] = useState({ visible: false });
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const showError = (msg) => setAlert({ type: 'danger', message: msg });
  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const clearAlert = () => setAlert(null);

  // Online/offline detection
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    fetchEvents(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTrigger]);

  const fetchEvents = async (page) => {
    if (!isOnline) { showError('You are offline. Please check your connection.'); return; }
    setLoading(true);
    try {
      const f = activeFilters.current;
      const payload = { per_page: 15 };
      if (f.status) payload.status = f.status;
      if (f.taluka) payload.taluka = f.taluka;
      if (f.search) payload.search = f.search;
      const endpoint = f.status === 'pending' ? `pendingEvents?page=${page}` : `listEvents?page=${page}`;
      const data = await apiService('POST', endpoint, payload);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      const list = Array.isArray(data.data) ? data.data : (data.data.data || []);
      setEvents(list);
      setLastPage(data.data.last_page || 1);
      setTotal(data.data.total || list.length);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    activeFilters.current = { status: statusFilter, taluka: talukaFilter, search: searchText };
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const handleClear = () => {
    setStatusFilter(''); setTalukaFilter(''); setSearchText('');
    activeFilters.current = { status: '', taluka: '', search: '' };
    if (currentPage === 1) setSearchTrigger((t) => t + 1);
    else setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  // Build multipart FormData for create/update
  const buildFormData = (f, file) => {
    const fd = new FormData();
    if (f.id) fd.append('id', f.id);
    if (f.user_id) fd.append('user_id', f.user_id);
    if (f.event_type_id) fd.append('event_type_id', f.event_type_id);
    if (f.site_id) fd.append('site_id', f.site_id);
    if (f.title) fd.append('title', f.title);
    if (f.description) fd.append('description', f.description);
    if (f.address) fd.append('address', f.address);
    if (f.taluka) fd.append('taluka', f.taluka);
    if (f.start_date) fd.append('start_date', f.start_date);
    if (f.end_date) fd.append('end_date', f.end_date);
    if (f.start_time) fd.append('start_time', f.start_time.length === 5 ? f.start_time + ':00' : f.start_time);
    if (f.end_time) fd.append('end_time', f.end_time.length === 5 ? f.end_time + ':00' : f.end_time);
    if (f.venue_name) fd.append('venue_name', f.venue_name);
    if (f.organizer_name) fd.append('organizer_name', f.organizer_name);
    if (f.organizer_phone) fd.append('organizer_phone', f.organizer_phone);
    if (f.organizer_email) fd.append('organizer_email', f.organizer_email);
    fd.append('is_free', f.is_free ? '1' : '0');
    if (!f.is_free && f.entry_fee) fd.append('entry_fee', f.entry_fee);
    fd.append('registration_required', f.registration_required ? '1' : '0');
    if (f.registration_required && f.registration_link) fd.append('registration_link', f.registration_link);
    if (f.max_participants) fd.append('max_participants', f.max_participants);
    if (f.tags) {
      const tags = f.tags.split(',').map((t) => t.trim()).filter(Boolean);
      tags.forEach((t) => fd.append('tags[]', t));
    }
    if (f.status) fd.append('status', f.status);
    if (f.video_url) fd.append('video_url', f.video_url);
    if (file) fd.append('banner_image', file);
    return fd;
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(emptyForm);
    setBannerFile(null);
    setShowAddModal(true);
  };

  const handleCreate = async () => {
    setActionLoading(true);
    try {
      const fd = buildFormData(formData, bannerFile);
      const data = await apiService('POST', 'createEvent', fd);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setShowAddModal(false);
      fetchEvents(currentPage);
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const openEditModal = async (id) => {
    setEditLoading(true);
    setShowEditModal(true);
    setBannerFile(null);
    setGallery([]);
    setGalleryFiles([]);
    try {
      const data = await apiService('POST', 'getEvent', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); setShowEditModal(false); return; }
      const ev = data.data;
      setFormData({
        id: ev.id,
        user_id: ev.user_id ?? '',
        event_type_id: ev.event_type_id ?? '',
        site_id: ev.site_id ?? '',
        title: ev.title ?? '',
        description: ev.description ?? '',
        address: ev.address ?? '',
        taluka: ev.taluka ?? '',
        start_date: ev.start_date ? ev.start_date.slice(0, 10) : '',
        end_date: ev.end_date ? ev.end_date.slice(0, 10) : '',
        start_time: ev.start_time ? ev.start_time.slice(0, 5) : '',
        end_time: ev.end_time ? ev.end_time.slice(0, 5) : '',
        venue_name: ev.venue_name ?? '',
        organizer_name: ev.organizer_name ?? '',
        organizer_phone: ev.organizer_phone ?? '',
        organizer_email: ev.organizer_email ?? '',
        is_free: ev.is_free ?? true,
        entry_fee: ev.entry_fee ?? '',
        registration_required: ev.registration_required ?? false,
        registration_link: ev.registration_link ?? '',
        max_participants: ev.max_participants ?? '',
        tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : (ev.tags ?? ''),
        status: ev.status ?? 'approved',
        video_url: ev.video_url ?? '',
        banner_image_url: ev.banner_image_url ?? '',
      });
      setGallery(ev.gallery || []);
    } catch (err) { showError(err.message); setShowEditModal(false); }
    finally { setEditLoading(false); }
  };

  const handleUpdate = async () => {
    setActionLoading(true);
    try {
      const fd = buildFormData(formData, bannerFile);
      const data = await apiService('POST', 'updateEvent', fd);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setShowEditModal(false);
      fetchEvents(currentPage);
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'deleteEvent', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setTotal((t) => t - 1);
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Approve ─────────────────────────────────────────────────────────────────
  const openApproveModal = (id) => { setApproveForm(emptyApproveForm); setApproveModal({ visible: true, id }); };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const payload = { id: approveModal.id, ...approveForm };
      if (!approveForm.is_featured) { delete payload.featured_until; }
      const data = await apiService('POST', 'approveEvent', payload);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setEvents((prev) => prev.map((e) => e.id === approveModal.id ? { ...e, status: 'approved', is_featured: approveForm.is_featured } : e));
      setApproveModal({ visible: false, id: null });
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Reject ──────────────────────────────────────────────────────────────────
  const openRejectModal = (id) => { setRejectReason(''); setRejectModal({ visible: true, id }); };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'rejectEvent', { id: rejectModal.id, rejection_reason: rejectReason });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setEvents((prev) => prev.map((e) => e.id === rejectModal.id ? { ...e, status: 'rejected', rejection_reason: rejectReason } : e));
      setRejectModal({ visible: false, id: null });
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Feature ──────────────────────────────────────────────────────────────────
  const openFeatureModal = (id, currentFeatured) => {
    setFeatureForm({ is_featured: !currentFeatured, featured_until: '' });
    setFeatureModal({ visible: true, id, current: currentFeatured });
  };

  const handleFeature = async () => {
    setActionLoading(true);
    try {
      const payload = { id: featureModal.id, is_featured: featureForm.is_featured };
      if (featureForm.is_featured && featureForm.featured_until) payload.featured_until = featureForm.featured_until;
      const data = await apiService('POST', 'featureEvent', payload);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message);
      setEvents((prev) => prev.map((e) => e.id === featureModal.id ? { ...e, is_featured: featureForm.is_featured } : e));
      setFeatureModal({ visible: false, id: null, current: false });
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Gallery ──────────────────────────────────────────────────────────────────
  const handleUploadGallery = async () => {
    if (!galleryFiles.length) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      fd.append('id', formData.id);
      galleryFiles.forEach((f) => fd.append('images[]', f));
      const data = await apiService('POST', 'uploadEventGallery', fd);
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      showSuccess(data.message || 'Photos uploaded.');
      // Refresh gallery from getEvent
      const updated = await apiService('POST', 'getEvent', { id: formData.id });
      if (updated.success) setGallery(updated.data.gallery || []);
      setGalleryFiles([]);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    } catch (err) { showError(err.message); }
    finally { setGalleryUploading(false); }
  };

  const handleDeleteGallery = async (imageId) => {
    if (!window.confirm('Remove this photo?')) return;
    setActionLoading(true);
    try {
      const data = await apiService('POST', 'deleteEventGallery', { id: formData.id, image_id: imageId });
      if (!data.success) { showError(parseApiMessage(data.message)); return; }
      setGallery((prev) => prev.filter((g) => g.id !== imageId));
    } catch (err) { showError(err.message); }
    finally { setActionLoading(false); }
  };

  // ── Analytics ────────────────────────────────────────────────────────────────
  const openAnalytics = async (id) => {
    setAnalytics(null);
    setAnalyticsModal({ visible: true });
    setAnalyticsLoading(true);
    try {
      const data = await apiService('POST', 'eventAnalytics', { id });
      if (!data.success) { showError(parseApiMessage(data.message)); setAnalyticsModal({ visible: false }); return; }
      setAnalytics(data.data);
    } catch (err) { showError(err.message); setAnalyticsModal({ visible: false }); }
    finally { setAnalyticsLoading(false); }
  };

  // ── Shared form JSX ──────────────────────────────────────────────────────────
  const eventForm = (
    <CForm>
      <CRow className="g-3">
        <CCol md={12}>
          <CFormLabel>Title <span className="text-danger">*</span></CFormLabel>
          <CFormInput name="title" value={formData.title} onChange={handleInputChange} placeholder="Event title" />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Description <span className="text-danger">*</span></CFormLabel>
          <CFormTextarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Full description..." />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Taluka <span className="text-danger">*</span></CFormLabel>
          <CFormSelect name="taluka" value={formData.taluka} onChange={handleInputChange} style={selectStyle}>
            <option value="" style={selectStyle}>Select Taluka</option>
            {TALUKAS.map((t) => <option key={t} value={t} style={selectStyle}>{t}</option>)}
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormLabel>Status</CFormLabel>
          <CFormSelect name="status" value={formData.status} onChange={handleInputChange} style={selectStyle}>
            {STATUSES.map((s) => <option key={s} value={s} style={selectStyle}>{s}</option>)}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormLabel>User <span className="text-body-secondary" style={{ fontSize: 12 }}>(optional)</span></CFormLabel>
          <DropdownSearch
            key={`user-${formData.id || 'new'}`}
            endpoint="listUsers"
            label="Select User"
            filter={[]}
            onChange={(id) => setFormData((p) => ({ ...p, user_id: id }))}
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Event Type <span className="text-body-secondary" style={{ fontSize: 12 }}>(optional)</span></CFormLabel>
          <DropdownSearch
            key={`etype-${formData.id || 'new'}`}
            endpoint="eventTypeDD"
            label="Select Event Type"
            filter={[{ status: true }]}
            onChange={(id) => setFormData((p) => ({ ...p, event_type_id: id }))}
          />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Linked Site <span className="text-body-secondary" style={{ fontSize: 12 }}>(optional)</span></CFormLabel>
          <DropdownSearch
            key={`site-${formData.id || 'new'}`}
            endpoint="sites"
            label="Select Site"
            filter={[]}
            onChange={(id) => setFormData((p) => ({ ...p, site_id: id }))}
          />
        </CCol>
        <CCol md={12}>
          <CFormLabel>Address <span className="text-danger">*</span></CFormLabel>
          <CFormInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Full address" />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Start Date <span className="text-danger">*</span></CFormLabel>
          <CFormInput type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>End Date <span className="text-danger">*</span></CFormLabel>
          <CFormInput type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Start Time</CFormLabel>
          <CFormInput type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>End Time</CFormLabel>
          <CFormInput type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Venue Name</CFormLabel>
          <CFormInput name="venue_name" value={formData.venue_name} onChange={handleInputChange} />
        </CCol>
        <CCol md={6}>
          <CFormLabel>Max Participants</CFormLabel>
          <CFormInput type="number" name="max_participants" value={formData.max_participants} onChange={handleInputChange} />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Organizer Name</CFormLabel>
          <CFormInput name="organizer_name" value={formData.organizer_name} onChange={handleInputChange} />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Organizer Phone</CFormLabel>
          <CFormInput name="organizer_phone" value={formData.organizer_phone} onChange={handleInputChange} />
        </CCol>
        <CCol md={4}>
          <CFormLabel>Organizer Email</CFormLabel>
          <CFormInput type="email" name="organizer_email" value={formData.organizer_email} onChange={handleInputChange} />
        </CCol>
        <CCol md={6} className="d-flex align-items-center gap-3 mt-2">
          <CFormCheck
            id="is_free"
            name="is_free"
            label="Free Entry"
            checked={!!formData.is_free}
            onChange={handleInputChange}
          />
          <CFormCheck
            id="registration_required"
            name="registration_required"
            label="Registration Required"
            checked={!!formData.registration_required}
            onChange={handleInputChange}
          />
        </CCol>
        {!formData.is_free && (
          <CCol md={6}>
            <CFormLabel>Entry Fee (₹)</CFormLabel>
            <CFormInput type="number" name="entry_fee" value={formData.entry_fee} onChange={handleInputChange} min="0" />
          </CCol>
        )}
        {formData.registration_required && (
          <CCol md={12}>
            <CFormLabel>Registration Link</CFormLabel>
            <CFormInput name="registration_link" value={formData.registration_link} onChange={handleInputChange} placeholder="https://..." />
          </CCol>
        )}
        <CCol md={12}>
          <CFormLabel>Tags <span className="text-body-secondary" style={{ fontSize: 12 }}>(comma separated)</span></CFormLabel>
          <CFormInput name="tags" value={formData.tags} onChange={handleInputChange} placeholder="food, festival, music" />
        </CCol>

        {/* ── Media ── */}
        <CCol md={12}>
          <CFormLabel><CIcon icon={cilImage} className="me-1" />Banner Image</CFormLabel>
          {formData.banner_image_url && !bannerFile && (
            <div className="mb-2">
              <img
                src={awsUrl(formData.banner_image_url)}
                alt="Current banner"
                style={{ height: 110, objectFit: 'cover', borderRadius: 6, maxWidth: '100%', display: 'block' }}
              />
              <p className="text-body-secondary mt-1 mb-0" style={{ fontSize: 12 }}>
                Current banner — upload a new file to replace it (old file is deleted automatically).
              </p>
            </div>
          )}
          {bannerFile && (
            <div className="mb-2">
              <img
                src={URL.createObjectURL(bannerFile)}
                alt="Preview"
                style={{ height: 110, objectFit: 'cover', borderRadius: 6, maxWidth: '100%', display: 'block' }}
              />
              <p className="text-body-secondary mt-1 mb-0" style={{ fontSize: 12 }}>New file selected — will replace current banner on save.</p>
            </div>
          )}
          <CFormInput
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files[0] || null)}
          />
        </CCol>
        <CCol md={12}>
          <CFormLabel><CIcon icon={cilVideo} className="me-1" />Video URL</CFormLabel>
          <CFormInput
            name="video_url"
            value={formData.video_url}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
          />
        </CCol>
      </CRow>
    </CForm>
  );

  // ── Gallery section (edit modal only, status === completed) ──────────────────
  const gallerySection = formData.status === 'completed' && (
    <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--cui-border-color)' }}>
      <h6 className="mb-3 d-flex align-items-center gap-2">
        <CIcon icon={cilImage} />
        Event Gallery
        <CBadge color="info" shape="rounded-pill">{gallery.length}</CBadge>
      </h6>

      {gallery.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 16 }}>
          {gallery.map((img) => (
            <div key={img.id} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
              <img
                src={awsUrl(img.url || img.image_url)}
                alt=""
                style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={() => handleDeleteGallery(img.id)}
                disabled={actionLoading}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(220,53,69,0.85)', border: 'none', borderRadius: '50%',
                  width: 22, height: 22, cursor: 'pointer', color: '#fff',
                  fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <CFormInput
          type="file"
          multiple
          accept="image/*"
          ref={galleryInputRef}
          onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
          style={{ maxWidth: 320 }}
        />
        <CButton
          color="primary"
          size="sm"
          onClick={handleUploadGallery}
          disabled={!galleryFiles.length || galleryUploading || !isOnline}
        >
          {galleryUploading
            ? <CSpinner size="sm" />
            : <><CIcon icon={cilCloudUpload} className="me-1" />{galleryFiles.length ? `Upload ${galleryFiles.length} photo${galleryFiles.length > 1 ? 's' : ''}` : 'Upload Photos'}</>
          }
        </CButton>
      </div>
    </div>
  );

  return (
    <CRow>
      <CCol xs={12}>
        {/* Offline banner */}
        {!isOnline && (
          <CCard className="mb-3 border-danger">
            <CCardBody className="d-flex align-items-center gap-2 text-danger py-2">
              <CIcon icon={cilWifiSignalOff} />
              <strong>You are offline.</strong> Event data may be stale. Reconnect to make changes.
            </CCardBody>
          </CCard>
        )}

        {/* Filters */}
        <CCard className="mb-3">
          <CCardBody>
            <CForm className="row g-3 align-items-end" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <CCol md={3}>
                <CFormLabel>Search</CFormLabel>
                <CFormInput placeholder="Title or organizer..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </CCol>
              <CCol md={2}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                  <option value="" style={selectStyle}>All</option>
                  {STATUSES.map((s) => <option key={s} value={s} style={selectStyle}>{s}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel>Taluka</CFormLabel>
                <CFormSelect value={talukaFilter} onChange={(e) => setTalukaFilter(e.target.value)} style={selectStyle}>
                  <option value="" style={selectStyle}>All</option>
                  {TALUKAS.map((t) => <option key={t} value={t} style={selectStyle}>{t}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md="auto">
                <CButton color="primary" type="submit">Search</CButton>
              </CCol>
              <CCol md="auto">
                <CButton color="secondary" onClick={handleClear}>Clear</CButton>
              </CCol>
              <CCol md="auto" className="ms-auto">
                <CButton color="success" onClick={openAddModal} disabled={!isOnline}>+ Add Event</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Total */}
        {total > 0 && !loading && (
          <p className="text-body-secondary mb-2" style={{ fontSize: 13 }}>{total} event{total !== 1 ? 's' : ''} found</p>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : events.length === 0 ? (
          <CCard><CCardBody className="text-center text-body-secondary py-5">No events found.</CCardBody></CCard>
        ) : (
          events.map((ev) => (
            <CCard key={ev.id} className="mb-3">
              <CCardBody>
                <CRow className="g-2 align-items-start">
                  {/* Thumbnail */}
                  {ev.banner_image_url && (
                    <CCol xs="auto">
                      <img
                        src={awsUrl(ev.banner_image_url)}
                        alt=""
                        style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                      />
                    </CCol>
                  )}

                  {/* Info */}
                  <CCol>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <strong style={{ fontSize: 15 }}>{ev.title}</strong>
                      <CBadge color={STATUS_COLORS[ev.status] || 'secondary'} shape="rounded-pill">{ev.status}</CBadge>
                      {ev.is_featured && (
                        <CBadge color="warning" shape="rounded-pill">
                          <CIcon icon={cilStar} size="sm" className="me-1" />Featured
                        </CBadge>
                      )}
                      {ev.event_type && (
                        <CBadge color="info" shape="rounded-pill">{ev.event_type.name}</CBadge>
                      )}
                      {!ev.is_free && (
                        <CBadge color="dark" shape="rounded-pill">₹{ev.entry_fee}</CBadge>
                      )}
                    </div>

                    <div className="d-flex flex-wrap gap-3 mb-1" style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                      {ev.user && (
                        <span><CIcon icon={cilUser} size="sm" className="me-1" />{ev.user.name}</span>
                      )}
                      {ev.organizer_name && ev.organizer_name !== ev.user?.name && (
                        <span>Organizer: {ev.organizer_name}</span>
                      )}
                      {ev.taluka && (
                        <span><CIcon icon={cilLocationPin} size="sm" className="me-1" />{ev.taluka}</span>
                      )}
                      {ev.start_date && (
                        <span><CIcon icon={cilCalendar} size="sm" className="me-1" />{ev.start_date}{ev.end_date && ev.end_date !== ev.start_date ? ` → ${ev.end_date}` : ''}</span>
                      )}
                    </div>

                    {/* Engagement stats */}
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 11, color: 'var(--cui-secondary-color)' }}>
                      {ev.view_count > 0 && <span>👁 {ev.view_count}</span>}
                      {ev.like_count > 0 && <span>❤️ {ev.like_count}</span>}
                      {ev.going_count > 0 && <span>✅ {ev.going_count} going</span>}
                      {ev.interested_count > 0 && <span>🔔 {ev.interested_count} interested</span>}
                    </div>

                    {ev.rejection_reason && (
                      <p className="mb-0 mt-1" style={{ fontSize: 12, color: 'var(--cui-danger)' }}>
                        Rejection reason: {ev.rejection_reason}
                      </p>
                    )}
                  </CCol>

                  {/* Actions */}
                  <CCol xs={12} md="auto" className="d-flex flex-wrap justify-content-end gap-1">
                    <CButton color="secondary" size="sm" variant="outline" onClick={() => openAnalytics(ev.id)} disabled={actionLoading}>
                      <CIcon icon={cilBarChart} />
                    </CButton>
                    <CButton color="warning" size="sm" onClick={() => openEditModal(ev.id)} disabled={actionLoading || !isOnline}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    {ev.status !== 'approved' && ev.status !== 'cancelled' && ev.status !== 'completed' && (
                      <CButton color="success" size="sm" onClick={() => openApproveModal(ev.id)} disabled={actionLoading || !isOnline}>
                        <CIcon icon={cilCheckCircle} className="me-1" />Approve
                      </CButton>
                    )}
                    {ev.status !== 'rejected' && ev.status !== 'cancelled' && ev.status !== 'completed' && (
                      <CButton color="danger" size="sm" onClick={() => openRejectModal(ev.id)} disabled={actionLoading || !isOnline}>
                        <CIcon icon={cilXCircle} className="me-1" />Reject
                      </CButton>
                    )}
                    <CButton
                      color={ev.is_featured ? 'warning' : 'light'}
                      size="sm"
                      onClick={() => openFeatureModal(ev.id, ev.is_featured)}
                      disabled={actionLoading || !isOnline}
                      title={ev.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <CIcon icon={cilStar} />
                    </CButton>
                    <CButton color="danger" size="sm" variant="outline" onClick={() => handleDelete(ev.id)} disabled={actionLoading || !isOnline}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <CPagination className="mt-2 flex-wrap">
            <CPaginationItem disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
              &laquo; Prev
            </CPaginationItem>
            {Array.from({ length: Math.min(lastPage, 10) }, (_, i) => {
              const page = currentPage <= 6 ? i + 1 : currentPage - 5 + i;
              if (page > lastPage) return null;
              return (
                <CPaginationItem key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                  {page}
                </CPaginationItem>
              );
            })}
            {lastPage > 10 && currentPage < lastPage - 4 && <CPaginationItem disabled>…</CPaginationItem>}
            {lastPage > 10 && currentPage < lastPage - 4 && (
              <CPaginationItem active={currentPage === lastPage} onClick={() => setCurrentPage(lastPage)}>{lastPage}</CPaginationItem>
            )}
            <CPaginationItem disabled={currentPage >= lastPage} onClick={() => setCurrentPage((p) => p + 1)}>
              Next &raquo;
            </CPaginationItem>
          </CPagination>
        )}
      </CCol>

      {/* ── Add Modal ── */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)} size="xl" scrollable>
        <CModalHeader><CModalTitle>Create Event</CModalTitle></CModalHeader>
        <CModalBody>{eventForm}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Cancel</CButton>
          <CButton color="success" onClick={handleCreate} disabled={actionLoading || !isOnline}>
            {actionLoading ? <CSpinner size="sm" /> : 'Create & Publish'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Edit Modal ── */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)} size="xl" scrollable>
        <CModalHeader><CModalTitle>Edit Event{formData.title ? ` — ${formData.title}` : ''}</CModalTitle></CModalHeader>
        <CModalBody>
          {editLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : (
            <>
              {/* Hero banner */}
              {formData.banner_image_url && (
                <div className="mb-3">
                  <img
                    src={awsUrl(formData.banner_image_url)}
                    alt="Event banner"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  />
                </div>
              )}

              {/* Video link */}
              {formData.video_url && (
                <div className="mb-3 d-flex align-items-center gap-2">
                  <CIcon icon={cilVideo} />
                  <a href={formData.video_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>
                    Watch Event Video
                  </a>
                </div>
              )}

              {eventForm}
              {gallerySection}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUpdate} disabled={actionLoading || editLoading || !isOnline}>
            {actionLoading ? <CSpinner size="sm" /> : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Approve Modal ── */}
      <CModal visible={approveModal.visible} onClose={() => setApproveModal({ visible: false, id: null })}>
        <CModalHeader><CModalTitle>Approve Event</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="g-3">
              <CCol md={12}>
                <CFormLabel>Admin Notes <span className="text-body-secondary" style={{ fontSize: 12 }}>(optional, visible to organizer)</span></CFormLabel>
                <CFormTextarea
                  rows={2}
                  placeholder="e.g. Looks great! Please confirm venue access."
                  value={approveForm.admin_notes}
                  onChange={(e) => setApproveForm((p) => ({ ...p, admin_notes: e.target.value }))}
                />
              </CCol>
              <CCol md={6} className="d-flex flex-column gap-2">
                <CFormCheck
                  id="is_featured_approve"
                  label="Feature this event"
                  checked={approveForm.is_featured}
                  onChange={(e) => setApproveForm((p) => ({ ...p, is_featured: e.target.checked }))}
                />
                <CFormCheck
                  id="send_notification"
                  label="Send push notification to taluka users"
                  checked={approveForm.send_notification}
                  onChange={(e) => setApproveForm((p) => ({ ...p, send_notification: e.target.checked }))}
                />
              </CCol>
              {approveForm.is_featured && (
                <CCol md={6}>
                  <CFormLabel>Featured Until <span className="text-body-secondary" style={{ fontSize: 12 }}>(blank = indefinite)</span></CFormLabel>
                  <CFormInput
                    type="date"
                    value={approveForm.featured_until}
                    onChange={(e) => setApproveForm((p) => ({ ...p, featured_until: e.target.value }))}
                  />
                </CCol>
              )}
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setApproveModal({ visible: false, id: null })}>Cancel</CButton>
          <CButton color="success" onClick={handleApprove} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilCheckCircle} className="me-1" />Approve</>}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Reject Modal ── */}
      <CModal visible={rejectModal.visible} onClose={() => setRejectModal({ visible: false, id: null })}>
        <CModalHeader><CModalTitle>Reject Event</CModalTitle></CModalHeader>
        <CModalBody>
          <CFormLabel>Rejection Reason <span className="text-danger">*</span></CFormLabel>
          <CFormTextarea
            rows={3}
            placeholder="Explain why — this will be shown to the organizer."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRejectModal({ visible: false, id: null })}>Cancel</CButton>
          <CButton color="danger" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
            {actionLoading ? <CSpinner size="sm" /> : <><CIcon icon={cilXCircle} className="me-1" />Reject</>}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Feature Modal ── */}
      <CModal visible={featureModal.visible} onClose={() => setFeatureModal({ visible: false, id: null, current: false })}>
        <CModalHeader>
          <CModalTitle>{featureModal.current ? 'Remove Featured' : 'Feature Event'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {featureModal.current ? (
            <p>Remove this event from the featured list?</p>
          ) : (
            <CForm>
              <CRow className="g-3">
                <CCol md={12}>
                  <CFormLabel>Featured Until <span className="text-body-secondary" style={{ fontSize: 12 }}>(blank = indefinite)</span></CFormLabel>
                  <CFormInput
                    type="date"
                    value={featureForm.featured_until}
                    onChange={(e) => setFeatureForm((p) => ({ ...p, featured_until: e.target.value }))}
                  />
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFeatureModal({ visible: false, id: null, current: false })}>Cancel</CButton>
          <CButton color="warning" onClick={handleFeature} disabled={actionLoading}>
            {actionLoading ? <CSpinner size="sm" /> : featureModal.current ? 'Remove Featured' : 'Feature Event'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Analytics Modal ── */}
      <CModal visible={analyticsModal.visible} onClose={() => setAnalyticsModal({ visible: false })} size="lg">
        <CModalHeader><CModalTitle>Event Analytics{analytics ? ` — ${analytics.title}` : ''}</CModalTitle></CModalHeader>
        <CModalBody>
          {analyticsLoading ? (
            <div className="text-center py-4"><CSpinner color="primary" /></div>
          ) : analytics ? (
            <>
              <CBadge color={STATUS_COLORS[analytics.status] || 'secondary'} className="mb-3">{analytics.status}</CBadge>
              <CTable bordered small responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Metric</CTableHeaderCell>
                    <CTableHeaderCell>Count</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {[
                    ['Views', analytics.view_count],
                    ['Likes', analytics.like_count],
                    ['Going', analytics.going_count],
                    ['Interested', analytics.interested_count],
                    ['Favourites', analytics.favourite_count],
                    ['Shares', analytics.share_count],
                    ['Clicks', analytics.click_count],
                  ].map(([label, count]) => (
                    <CTableRow key={label}>
                      <CTableDataCell>{label}</CTableDataCell>
                      <CTableDataCell><strong>{count ?? 0}</strong></CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </>
          ) : null}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAnalyticsModal({ visible: false })}>Close</CButton>
        </CModalFooter>
      </CModal>

      <AlertModal alert={alert} onClose={clearAlert} />
    </CRow>
  );
};

export default Events;
