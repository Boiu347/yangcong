import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import TopNavLayout from './components/layout/TopNavLayout';
import ProjectsPage from './pages/Projects/ProjectsPage';
import SummaryPage from './pages/Summary/SummaryPage';
import QualitativePage from './pages/Qualitative/QualitativePage';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import CompetitiveReportsPage from './pages/CompetitiveReports/CompetitiveReportsPage';
import NotFound from './pages/NotFound/NotFound';

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Root → go to projects list */}
      <Route index element={<Navigate to="/projects" replace />} />

      {/* Project list / creation */}
      <Route path="/projects" element={<ProjectsPage />} />

      {/* All project pages share the top tab bar (no sidebar) */}
      <Route path="/projects/:projectId" element={<TopNavLayout />}>
        <Route index element={<Navigate to="summary" replace />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="qualitative" element={<QualitativePage />} />
        <Route path="competitive" element={<CompetitivePage />} />
        <Route path="quantitative" element={<QuantitativePage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="reports" element={<CompetitiveReportsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
