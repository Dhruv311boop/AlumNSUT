const fs = require('fs');
const path = require('path');

const pages = [
  'pages/About.tsx',
  'pages/Contact.tsx',
  'pages/NotFound.tsx',
  'pages/student/StudentProfile.tsx',
  'pages/student/StudentSettings.tsx',
  'pages/student/FindMentor.tsx',
  'pages/student/StudentMessages.tsx',
  'pages/student/BookSession.tsx',
  'pages/student/StudentSessions.tsx',
  'pages/student/StudentNotifications.tsx',
  'pages/mentor/MentorDashboard.tsx',
  'pages/mentor/MentorProfile.tsx',
  'pages/mentor/MentorSettings.tsx',
  'pages/mentor/MentorVerification.tsx',
  'pages/mentor/MentorMessages.tsx',
  'pages/mentor/MentorBookings.tsx',
  'pages/mentor/MentorAvailability.tsx',
  'pages/mentor/MentorEarnings.tsx',
  'pages/admin/AdminDashboard.tsx',
];

pages.forEach(pagePath => {
  const fullPath = path.join(__dirname, 'src', pagePath);
  const componentName = path.basename(pagePath, '.tsx');
  
  if (!fs.existsSync(fullPath)) {
    const content = `import React from 'react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">${componentName.replace(/([A-Z])/g, ' $1').trim()}</h1>
        <p className="mt-4 text-slate-600">This page is under construction.</p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(fullPath, content);
    console.log('Created', fullPath);
  }
});
