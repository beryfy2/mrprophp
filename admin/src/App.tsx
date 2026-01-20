import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import Enquiries from "./pages/Enquiries";
import NavItems from "./pages/NavItems";
import AdminSettings from "./pages/AdminSettings";
import NavItemDetail from "./pages/NavItemDetail";
import TitleDetail from "./pages/TitleDetail";
import SubtitleDetail from "./pages/SubtitleDetail";
import AdminLayout from "./layouts/AdminLayout";
import Careers from "./pages/Careers";
import Achievements from "./pages/Achievements";
import AchievementForm from "./pages/AchievementForm";
import Works from "./pages/Works";
import WorkForm from "./pages/WorkForm";
import Media from "./pages/Media";
import MediaForm from "./pages/MediaForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="careers" element={<Careers />} />
          <Route path="nav-items" element={<NavItems />} />
          <Route path="nav-items/:id" element={<NavItemDetail />} />
          <Route path="titles/:id" element={<TitleDetail />} />
          <Route path="subtitles/:id" element={<SubtitleDetail />} />
          <Route path="admin-settings" element={<AdminSettings />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="achievements/new" element={<AchievementForm />} />
          <Route path="achievements/:id" element={<AchievementForm />} />
          <Route path="works" element={<Works />} />
          <Route path="works/new" element={<WorkForm />} />
          <Route path="works/:id" element={<WorkForm />} />
          <Route path="media" element={<Media />} />
          <Route path="media/new" element={<MediaForm />} />
          <Route path="media/:id" element={<MediaForm />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

