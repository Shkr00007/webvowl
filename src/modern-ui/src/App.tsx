import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "pages/DashboardPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
