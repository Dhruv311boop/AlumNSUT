import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Role } from '../../context/AuthContext';

export default function StudentLogin() {
  return <LoginForm role="STUDENT" />;
}
