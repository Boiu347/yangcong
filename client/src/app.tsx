import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProjectsPage from './pages/Projects/ProjectsPage';
import SummaryPage from './pages/Summary/SummaryPage';
import QualitativePage from './pages/Qualitative/QualitativePage';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import NotFound from './pages/NotFound/NotFound';

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Root → go to projects list */}
      <Route index element={<Navigate to="/projects" replace />} />

      {/* Project list / creation */}
      <Route path="/projects" element={<ProjectsPage />} />

      {/* Summary: full-screen, outside AppLayout */}
      <Route path="/projects/:projectId/summary" element={<SummaryPage />} />

      {/* Other project pages (with sidebar + FileBar) */}
      <Route path="/projects/:projectId" element={<AppLayout />}>
        <Route index element={<Navigate to="summary" replace />} />
        <Route path="qualitative" element={<QualitativePage />} />
        <Route path="competitive" element={<CompetitivePage />} />
        <Route path="quantitative" element={<QuantitativePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
