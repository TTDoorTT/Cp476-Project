import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TopicsPage from "./pages/TopicsPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import CreateTopicPage from "./pages/CreateTopicPage";
import AdminDeletedTopicsPage from "./pages/AdminDeletedTopicsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDeletedRepliesPage from "./pages/AdminDeletedRepliesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/topics" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/new" element={<CreateTopicPage />} />
          <Route path="/topics/:id" element={<TopicDetailPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="/admin/deleted-topics"
            element={<AdminDeletedTopicsPage />}
          />
          <Route path="/admin/deleted-replies" element={<AdminDeletedRepliesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}