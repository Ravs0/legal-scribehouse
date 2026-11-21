import { Route, Routes } from 'react-router-dom';
import { RequireUser, WorkspaceShell } from './components/Shell';
import Overview from './pages/Overview';
import Matters from './pages/Matters';
import MatterDetail from './pages/MatterDetail';
import Enquiries from './pages/Enquiries';
import Clients from './pages/Clients';
import { ArticleEditor, ArticleList } from './pages/Articles';
import { Activity, Team } from './pages/Team';
import { PortalHome, PortalMatter, PortalShell } from './pages/Portal';

/** /workspace/* (firm) and /portal/* (clients). Loaded on demand from App.tsx. */
const WorkspaceRoutes = ({ area }: { area: 'workspace' | 'portal' }) =>
  area === 'workspace' ? (
    <RequireUser area="workspace">
      <Routes>
        <Route element={<WorkspaceShell />}>
          <Route index element={<Overview />} />
          <Route path="matters" element={<Matters />} />
          <Route path="matters/:id" element={<MatterDetail />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="clients" element={<Clients />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/:id" element={<ArticleEditor />} />
          <Route path="team" element={<Team />} />
          <Route path="activity" element={<Activity />} />
        </Route>
      </Routes>
    </RequireUser>
  ) : (
    <RequireUser area="portal">
      <Routes>
        <Route element={<PortalShell />}>
          <Route index element={<PortalHome />} />
          <Route path="matters/:id" element={<PortalMatter />} />
        </Route>
      </Routes>
    </RequireUser>
  );

export default WorkspaceRoutes;
