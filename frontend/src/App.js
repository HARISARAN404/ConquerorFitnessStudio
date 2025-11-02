import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DueUpdates from "./pages/DueUpdates";
import Attendance from "./pages/Attendance";
import AddMember from "./pages/AddMember";
import MonthlyReport from "./pages/MonthlyReport";
import { Toaster } from "./components/ui/sonner";
import { initializeMockData } from "./mock";

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/due-updates" element={<DueUpdates />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
