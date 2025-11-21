// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Preloader from './Preloader'; // Yüklənmə zamanı bu görünsün

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Preloader />; // Yoxlayana qədər ekranı tuturuq
  if (!user) return <Navigate to="/login" replace />; // Giriş yoxdursa, Loginə at

  return children; // Giriş varsa, Admini göstər
};

export default ProtectedRoute;