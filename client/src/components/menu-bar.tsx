import { useState } from "react";
import { Link } from "react-router";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const role = user?.role || "student";

  return (
    <div className="h-20 border-b relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-full">
        <div className="flex items-center justify-between w-full gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </Button>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="font-medium">
              Dashboard
            </Link>
            {role === "instructor" && (
              <Link to="/dashboard/new" className="font-medium">
                New Course
              </Link>
            )}
            <Link to="/dashboard/course" className="font-medium">
              View Courses
            </Link>
          </div>
          <Link to="/dashboard/profile">
            <div className="rounded-full size-10 overflow-hidden">
              <img
                src="/profile.png"
                alt="Profile Picture"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b flex flex-col items-center gap-2 py-2 z-10">
          <Link
            to="/dashboard"
            className="font-medium"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          {role === "instructor" && (
            <Link
              to="/dashboard/new"
              className="font-medium"
              onClick={() => setIsOpen(false)}
            >
              New Course
            </Link>
          )}
          <Link
            to="/dashboard/course"
            className="font-medium"
            onClick={() => setIsOpen(false)}
          >
            View Courses
          </Link>
          <Link to="/dashboard/profile" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
