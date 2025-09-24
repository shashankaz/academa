import { Link } from "react-router";

import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <span className="text-2xl font-medium font-playfair">Academa</span>
        <div className="space-x-2">
          <Button variant={"secondary"} className="shadow-md" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button className="shadow-md" asChild>
            <Link to="/register">Start Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
