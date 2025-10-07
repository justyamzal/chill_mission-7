import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import { ShowsProvider } from "./state/shows-context.jsx";
import Manage from "./pages/Manage.jsx";

export default function App() {
  return (
     <ShowsProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div className="p-8 text-white">404</div>} />
      </Routes>
    </ShowsProvider>
  );
}

