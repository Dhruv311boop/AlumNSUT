import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Role } from '../../context/AuthContext';

export default function MentorLogin() {
  return <LoginForm role="MENTOR" />;
}
