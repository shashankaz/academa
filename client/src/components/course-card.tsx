import { Link } from "react-router";

import type { Course } from "@/types";

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link to={`/dashboard/course/${course?.id}`}>
      <div className="bg-white p-4 rounded-lg shadow-md hover:-translate-y-2 transition-all cursor-pointer duration-300">
        <div className="bg-accent h-32 w-full rounded-md overflow-hidden">
          <img
            src={course?.coverImage}
            alt={course?.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 justify-between h-20">
          <h4 className="font-medium line-clamp-2">{course?.title}</h4>
          <p className="text-sm">{course?.lectures?.length} Lessons</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
