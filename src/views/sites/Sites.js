import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CButton,
  CSpinner
} from '@coreui/react'

const Sites = () => {
  const [sites, setSites] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSites(currentPage)
  }, [currentPage])

  const fetchSites = async (page) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('apitype', 'list')
    formData.append('category', 'city')
    // formData.append('parent_id', '6')
    setLoading(true)
    console.log(token, "Token")

    try {
      const response = await fetch(`https://dev.tourkokan.com/admin/v2/sites?page=${page}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('API response:', data)

      if (data && data.data) {
        setSites(data.data.data || [])
        setTotalPages(data.data.last_page || 1)
      } else {
        throw new Error('Invalid data structure')
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCol xs={12}>
              <CCard className="mb-4">

                <CCardBody>
                  <CForm className="row gx-3 gy-2 align-items-center">
                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeInputName">
                        Name
                      </CFormLabel>
                      <CFormInput id="specificSizeInputName" placeholder="Jane Doe" />
                    </CCol>

                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                        Preference
                      </CFormLabel>
                      <CFormSelect id="specificSizeSelect">
                        <option>Category...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </CFormSelect>
                    </CCol>

                    <CCol sm={3}>
                      <CFormLabel className="visually-hidden" htmlFor="specificSizeSelect">
                        Preference
                      </CFormLabel>
                      <CFormSelect id="specificSizeSelect">
                        <option>City...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </CFormSelect>
                    </CCol>

                    <CCol xs="auto">
                      <CButton color="primary" type="submit">
                        Submit
                      </CButton>
                    </CCol>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <CSpinner color="primary" />
            ) : (
              <>            <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Stop Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tag Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Domain Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Is Hot Place</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Latitude</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Longitude</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sites.map((site, index) => (
                    <CTableRow key={site.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{site.name}</CTableDataCell>
                      <CTableDataCell>{site.category.name}</CTableDataCell>
                      <CTableDataCell>{site.bus_stop_type}</CTableDataCell>
                      <CTableDataCell>{site.tag_line}</CTableDataCell>
                      <CTableDataCell>{site.description}</CTableDataCell>
                      <CTableDataCell>{site.domain_name}</CTableDataCell>
                      <CTableDataCell>{site.status}</CTableDataCell>
                      <CTableDataCell>{site.is_hot_place}</CTableDataCell>
                      <CTableDataCell>{site.latitude}</CTableDataCell>
                      <CTableDataCell>{site.longitude}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              </>
            )}
            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Sites
