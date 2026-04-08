import React from 'react';
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilWarning } from '@coreui/icons';
import PropTypes from 'prop-types';

/**
 * Reusable alert popup.
 * Props:
 *   alert  — { type: 'success'|'danger', message: string } or null
 *   onClose — callback to clear alert
 */
const AlertModal = ({ alert, onClose }) => {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const icon = isSuccess ? cilCheckCircle : cilWarning;
  const iconColor = isSuccess ? '#2eb85c' : '#e55353';
  const title = isSuccess ? 'Success' : 'Error';

  return (
    <CModal visible alignment="center" onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={icon} style={{ color: iconColor, fontSize: 20 }} />
          {title}
        </CModalTitle>
      </CModalHeader>
      <CModalBody style={{ whiteSpace: 'pre-line', fontSize: 15 }}>
        {alert.message}
      </CModalBody>
      <CModalFooter>
        {!isSuccess && (
          <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        )}
        <CButton color={isSuccess ? 'success' : 'danger'} onClick={onClose}>OK</CButton>
      </CModalFooter>
    </CModal>
  );
};

AlertModal.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'danger']),
    message: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
