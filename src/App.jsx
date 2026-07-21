import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicApp from "./PublicApp";
import AdminApp from "./admin/AdminApp";
import "./App.css";

// Two branches share one router: the admin console lives entirely under
// /admin/* with its own chrome and auth, and everything else is the public
// marketing + registration site.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  );
}
