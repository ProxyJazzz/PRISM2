import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Evaluation from '../pages/dashboard/Evaluation';
import Proposals from '../pages/dashboard/Proposals';
import ProposalAnalysis from '../pages/dashboard/ProposalAnalysis';
import AuditLogs from '../pages/dashboard/AuditLogs';

export default function DashboardRouter() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="proposals/:id" element={<ProposalAnalysis />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}
