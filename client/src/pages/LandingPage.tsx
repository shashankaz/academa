import { Link } from "react-router";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const LandingPage = () => {
  return (
    <div className="bg-[#F6F6F4]">
      <div className="h-screen max-w-7xl mx-auto flex flex-col items-center justify-center space-y-8 px-4">
        <Navbar />
        <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm shadow-md">
          <Zap className="size-4" fill="currentColor" /> Beta is live!
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.2] text-center w-full md:w-3/5 mx-auto">
          Your Learning Journey Starts Here
        </h1>
        <p className="text-center w-full md:w-3/5 mx-auto text-base md:text-lg text-muted-foreground">
          Discover courses, complete interactive lessons, and track your
          progress with ease. Whether you're an instructor or a student,
          everything you need is in one platform.
        </p>

        <div className="space-x-2">
          <Button size={"lg"} className="shadow-md" asChild>
            <Link to="/register">Start for Free</Link>
          </Button>
          <Button
            size={"lg"}
            variant={"secondary"}
            className="shadow-md"
            asChild
          >
            <Link to="/demo">Get a Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
