import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Config from '../pages/Config';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/config"
        element={
          <Config />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
