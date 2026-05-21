import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';
import { createPortal } from 'react-dom';

import RoutesComponent from './app.tsx';
import PasswordGate from './components/auth/PasswordGate';
import './index.css';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full mx-4">
        <h2 className="text-lg font-bold text-red-600 mb-2">页面出错了</h2>
        <pre className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg overflow-auto mb-4 max-h-48">
          {error instanceof Error ? error.message : String(error)}
          {error instanceof Error && error.stack ? '\n\n' + error.stack : ''}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-[#4361EE] text-white rounded-lg hover:bg-[#3451d1] transition-colors text-sm"
        >
          重试
        </button>
      </div>
    </div>
  );
}

const MainApp = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PasswordGate>
          <RoutesComponent />
        </PasswordGate>
        {createPortal(<Toaster />, document.body)}
      </ErrorBoundary>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(<MainApp />);
