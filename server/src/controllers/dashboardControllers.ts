import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courses = await prisma.course.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        lectures: true,
      },
    });

    res.json({ user: { name: user.name }, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const courses = await prisma.course.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      include: {
        lectures: true,
      },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSingleCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any)?.user?.id as string | undefined;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lectures: {
          orderBy: { createdAt: "asc" },
        },
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let courseEnrolled = false;
    let lastLectureCompletedIndex = -1;

    if (userId) {
      const enrollment = await prisma.coursesEnrolled.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: id,
          },
        },
        select: {
          lastLectureCompleted: true,
        },
      });

      if (enrollment) {
        courseEnrolled = true;
        lastLectureCompletedIndex = enrollment.lastLectureCompleted ?? -1;
      }
    }

    const lecturesWithViewed = course.lectures.map((lec, idx) => ({
      ...lec,
      isViewed: courseEnrolled && idx <= lastLectureCompletedIndex,
    }));

    res.json({
      ...course,
      lectures: lecturesWithViewed,
      courseEnrolled,
      lastLectureCompletedIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReadingContent = async (req: Request, res: Response) => {
  try {
    const { id, docId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const document = await prisma.lecture.findFirst({
      where: { id: docId, courseId: id },
      include: {
        Course: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getQuizContent = async (req: Request, res: Response) => {
  try {
    const { id, quizId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const quiz = await prisma.lecture.findFirst({
      where: { id: quizId, courseId: id },
      include: {
        Course: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
