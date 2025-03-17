import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    console.log('User not logged in, redirecting to login...');
    return React.createElement(Navigate, { to: '/login', replace: true });
  }

  return React.createElement(React.Fragment, null, children);
}
