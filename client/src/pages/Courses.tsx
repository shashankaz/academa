import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/lib/api";
import type { Course } from "@/types";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async (query: string = "") => {
    setIsFetching(true);

    try {
      const params = query ? { search: query } : {};
      const response = await api.get("/dashboard/all-courses", { params });

      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = () => {
    fetchCourses(searchQuery.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">Courses</h1>
      <div className="mt-6 flex gap-2 w-1/2">
        <Input
          placeholder="Search courses..."
          className="bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="mt-10">
        {isFetching ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                className="bg-white p-4 rounded-lg shadow-md flex gap-4"
                key={i}
              >
                <Skeleton className="w-60 aspect-video rounded-md shrink-0" />
                <div className="flex flex-col gap-4 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No courses available
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <Link to={`/dashboard/course/${course.id}`} key={course.id}>
              <div className="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <div className="bg-accent w-60 aspect-video rounded-md shrink-0 overflow-hidden">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-xl font-medium line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-sm">{course.lectures.length} Lessons</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
