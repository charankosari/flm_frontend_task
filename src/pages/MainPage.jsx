import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import "../styles/styles.css";

function MainPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <MainContent />
    </div>
  );
}

export default MainPage;
