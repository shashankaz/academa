import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import CourseCard from "@/components/course-card";
import Loading from "@/components/loading";

import { api } from "@/lib/api";
import type { DashboardData } from "@/types";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const fetchdashboardData = async () => {
    setLoading(true);

    try {
      const response = await api.get("/dashboard");

      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const totalPages = Math.ceil(
    (dashboardData?.courses?.length || 0) / itemsPerPage
  );
  const visibleCourses =
    dashboardData?.courses.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ) || [];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10">
      {dashboardData?.user?.name && (
        <h2 className="text-2xl md:text-3xl font-semibold">
          Hello {dashboardData?.user?.name},
        </h2>
      )}

      <div className="mt-10 space-y-8">
        <div>
          <div className="flex flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-lg md:text-xl font-semibold">Courses</h2>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/course" className="font-medium">
                View All
              </Link>
              <div className="space-x-2">
                <Button
                  size="icon"
                  className="rounded-full size-8"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full size-8"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
