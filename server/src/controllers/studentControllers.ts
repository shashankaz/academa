import { Request, Response } from "express";
import prisma from "../config/prisma";

export const handleCourseEnrollment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const courseEnrolled = await prisma.coursesEnrolled.findFirst({
      where: { courseId, userId: user.id },
    });
    if (courseEnrolled) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    await prisma.coursesEnrolled.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markLectureViewed = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res
        .status(400)
        .json({ message: "courseId and lectureId are required" });
    }

    const enrollment = await prisma.coursesEnrolled.findUnique({
      where: {
        userId_courseId: { userId: user.id, courseId },
      },
      select: { lastLectureCompleted: true },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    const lectures = await prisma.lecture.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
      select: { id: true, type: true },
    });

    const idx = lectures.findIndex((l) => l.id === lectureId);
    if (idx === -1) {
      return res.status(404).json({ message: "Lecture not found in course" });
    }

    const lecture = lectures[idx];
    if (lecture.type !== "reading") {
      return res
        .status(400)
        .json({ message: "Lecture is not of type reading" });
    }

    const newIndex = Math.max(enrollment.lastLectureCompleted ?? -1, idx);
    if ((enrollment.lastLectureCompleted ?? -1) === newIndex) {
      return res.json({
        message: "Progress already up to date",
        lastLectureCompletedIndex: newIndex,
      });
    }

    await prisma.coursesEnrolled.update({
      where: { userId_courseId: { userId: user.id, courseId } },
      data: { lastLectureCompleted: newIndex },
    });

    res.json({
      message: "Lecture marked as viewed",
      lastLectureCompletedIndex: newIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitQuizScore = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { courseId, lectureId, score } = req.body;

    if (!courseId || !lectureId || typeof score !== "number") {
      return res.status(400).json({
        message: "courseId, lectureId and numeric score are required",
      });
    }

    const enrollment = await prisma.coursesEnrolled.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { lastLectureCompleted: true, quizScores: true },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    const lectures = await prisma.lecture.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
      select: { id: true, type: true },
    });

    const idx = lectures.findIndex((l) => l.id === lectureId);
    if (idx === -1) {
      return res.status(404).json({ message: "Lecture not found in course" });
    }
    const lecture = lectures[idx];
    if (lecture.type !== "quiz") {
      return res.status(400).json({ message: "Lecture is not of type quiz" });
    }

    const existing = (enrollment.quizScores as any) || {};
    const updatedScores = {
      ...existing,
      [lectureId]: { score },
    };

    const newIndex = Math.max(enrollment.lastLectureCompleted ?? -1, idx);

    await prisma.coursesEnrolled.update({
      where: { userId_courseId: { userId: user.id, courseId } },
      data: {
        quizScores: updatedScores as any,
        lastLectureCompleted: newIndex,
      },
    });

    res.json({
      message: "Quiz score recorded",
      saved: { lectureId, score },
      lastLectureCompletedIndex: newIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
