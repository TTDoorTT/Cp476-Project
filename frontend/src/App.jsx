import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import TopicsPage from "./pages/TopicsPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import CreateTopicPage from "./pages/CreateTopicPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: 12 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/topics" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/new" element={<CreateTopicPage />} />
          <Route path="/topics/:id" element={<TopicDetailPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}