import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*"         element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
