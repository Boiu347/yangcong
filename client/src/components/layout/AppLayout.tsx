import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FileBar from './FileBar';
import { useProject } from '../../store/useProjectStore';

export default function AppLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProject(projectId);

  // If project doesn't exist, redirect to project list
  if (projectId && !project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F4F5F7] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <FileBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
