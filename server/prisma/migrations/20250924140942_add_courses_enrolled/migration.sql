-- CreateTable
CREATE TABLE "public"."CoursesEnrolled" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLectureCompleted" INTEGER NOT NULL DEFAULT 0,
    "quizScores" JSONB,

    CONSTRAINT "CoursesEnrolled_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoursesEnrolled_userId_courseId_key" ON "public"."CoursesEnrolled"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."CoursesEnrolled" ADD CONSTRAINT "CoursesEnrolled_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoursesEnrolled" ADD CONSTRAINT "CoursesEnrolled_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
