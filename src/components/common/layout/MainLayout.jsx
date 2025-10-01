import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import s from "./MainLayout.module.css";
import { useState } from "react";

export default function MainLayout(){
  const { pathname } = useLocation();
  const crumbs = pathname === "/" ? ["Home","Dashboard"] : ["Home", pathname.slice(1)];
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  return (
    <div className={`${s.shell} ${sidebarOpen ? "" : s.collapsed}`}>
      <aside className={`${s.sidebar} ${sidebarOpen ? s.show : s.hidden}`}>
        <Sidebar />
      </aside>

      <main className={s.main}>
       <Topbar onToggleSidebar={handleToggleSidebar} />
        <div className={s.headline}>
          
        </div>
        <div className={s.content}><Outlet /></div>
      </main>
    </div>
  );
}
