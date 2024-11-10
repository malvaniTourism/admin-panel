import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { Link, useNavigate } from 'react-router-dom';

const DefaultLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const myToken = localStorage.getItem('token');
    if (!myToken) {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
