import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Predictor } from "@/pages/Predictor";
import { MapPage } from "@/pages/MapPage";
import { RoutePage } from "@/pages/RoutePage";
import { Report } from "@/pages/Report";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
