import { useEffect } from "react";
import { Outlet } from "react-router";
import Cookies from "js-cookie";

const RootLayout = () => {
  useEffect(() => {
    const cookie = Cookies.get("token");

    if (cookie) {
      console.log("User is authenticated");
    }
  }, []);

  return (
    <div className="font-montserrat">
      <Outlet />
    </div>
  );
};

export default RootLayout;
