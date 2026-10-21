import { Navigate } from 'react-router-dom';

// This page had placeholder content that did not describe the real project.
// The route now sends visitors to the home page.
export default function Community() {
  return <Navigate to="/" replace />;
}
