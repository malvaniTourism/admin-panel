import React, { useState } from 'react';
import { CImage, CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import { FTP_BASE_URL } from 'src/services/endpoints';

const ImageCell = ({ banner }) => {
  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    toggleModal();
  };

  return (
    <>
      <CImage
        src={FTP_BASE_URL + banner.image}
        alt={banner.image}
        width="50"
        onClick={() => handleImageClick(banner.image)}
        style={{ cursor: 'pointer' }}
      />
      <CModal show={modal} onClose={toggleModal} size="lg">
        <CModalHeader closeButton>
          <h5>Image Preview</h5>
        </CModalHeader>
        <CModalBody className="d-flex justify-content-center">
          <CImage src={FTP_BASE_URL + selectedImage} alt={selectedImage} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ImageCell;
