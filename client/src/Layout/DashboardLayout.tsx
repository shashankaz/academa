import { Outlet } from "react-router";

import MenuBar from "@/components/menu-bar";

const DashboardLayout = () => {
  return (
    <div className="bg-accent">
      <MenuBar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
