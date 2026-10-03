import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { UploadPaper } from './pages/UploadPaper';
import { PaperAnalysis } from './pages/PaperAnalysis';
import { ExperimentConfig } from './pages/ExperimentConfig';
import { ExperimentRunning } from './pages/ExperimentRunning';
import { ResultsComparison } from './pages/ResultsComparison';
import { ReproducibilityReport } from './pages/ReproducibilityReport';
import { PapersLibrary } from './pages/PapersLibrary';
import { ExperimentsList } from './pages/ExperimentsList';
import { ReportsList } from './pages/ReportsList';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadPaper />} />
            <Route path="analysis" element={<PaperAnalysis />} />
            <Route path="experiment/config" element={<ExperimentConfig />} />
            <Route path="experiment/running" element={<ExperimentRunning />} />
            <Route path="results/comparison" element={<ResultsComparison />} />
            <Route path="report" element={<ReproducibilityReport />} />
            <Route path="papers" element={<PapersLibrary />} />
            <Route path="experiments" element={<ExperimentsList />} />
            <Route path="reports" element={<ReportsList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
