import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import { Brain, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/api";
import type { CourseDetails } from "@/types";

const CourseDetails = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const id = useParams().id;

  const fetchCourseDetails = async () => {
    setIsLoading(true);

    try {
      const response = await api.get(`/dashboard/course/${id}`);
      if (response.status === 200) {
        setCourseDetails(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await api.post(`/student/enroll`, {
        courseId: id,
      });

      if (response.status === 200) {
        toast.success("Enrolled Successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourseDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;
  const userType = user?.role;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-10">
      <div className="w-full md:w-2/3 space-y-6">
        {isLoading ? (
          <>
            <Skeleton className="h-8 md:h-9 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 flex items-start gap-4 border-t"
                >
                  <Skeleton className="size-4 mt-1" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold">
              {courseDetails?.title || "Course Title"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {courseDetails?.description || "Course Description"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Instructor:{" "}
                {courseDetails?.instructor?.name || "Unknown Instructor"}
              </p>
              {courseDetails?.instructor?.id === userId && (
                <Button size={"sm"}>
                  <Link to={`/dashboard/course/${courseDetails?.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              )}
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="p-4 space-y-2">
                <h3 className="text-lg md:text-xl font-semibold">Syllabus</h3>
                <p className="text-sm">
                  {courseDetails?.lectures?.length || 0} lessons
                </p>
                {courseDetails?.courseEnrolled &&
                  (() => {
                    const total = courseDetails?.lectures?.length || 0;
                    const completed = Math.min(
                      Math.max(
                        (courseDetails?.lastLectureCompletedIndex ?? -1) + 1,
                        0
                      ),
                      total
                    );
                    const percent = total
                      ? Math.round((completed / total) * 100)
                      : 0;

                    return (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>
                            {completed}/{total} ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
              </div>

              {(() => {
                const firstUnviewedIndex = (
                  courseDetails?.lectures || []
                ).findIndex((l) => l.isViewed === false);

                return courseDetails?.lectures.map((lesson, idx) => {
                  const destination = `/dashboard/course/${courseDetails?.id}/${
                    lesson.type === "reading" ? "reading" : "quiz"
                  }/${lesson.id}`;

                  let disabled = false;

                  if (!courseDetails?.courseEnrolled) {
                    disabled = true;
                  } else if (lesson.isViewed === false) {
                    disabled = !(idx === firstUnviewedIndex);
                  }

                  const ItemContent = (
                    <div
                      className={`p-4 flex items-start gap-4 border-t transition-colors duration-200 ${
                        disabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-accent-foreground hover:text-accent cursor-pointer"
                      }`}
                    >
                      {lesson.type === "reading" ? (
                        <FileText className="size-4 mt-1 flex-shrink-0" />
                      ) : (
                        <Brain className="size-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm md:text-base">
                          {lesson.title}
                        </h4>
                        <p className="text-xs">
                          {lesson.type === "reading" ? "Reading" : "Quiz"}
                        </p>
                      </div>
                    </div>
                  );

                  return disabled ? (
                    <div key={lesson.id}>{ItemContent}</div>
                  ) : (
                    <Link key={lesson.id} to={destination}>
                      {ItemContent}
                    </Link>
                  );
                });
              })()}
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 h-fit">
        {isLoading ? (
          <>
            <Skeleton className="h-40 md:h-52 w-full rounded-md" />
            <Skeleton className="h-10 w-full mt-4" />
          </>
        ) : (
          <>
            <div className="bg-accent h-40 md:h-52 w-full rounded-md overflow-hidden">
              <img
                src={courseDetails?.coverImage || "/placeholder.svg"}
                alt={courseDetails?.title || "Course Title"}
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              className="mt-4 w-full"
              disabled={
                userType === "instructor" || courseDetails?.courseEnrolled
              }
              onClick={handleEnroll}
            >
              Enroll For FREE
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
