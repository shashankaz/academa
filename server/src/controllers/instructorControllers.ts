import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import s3Client from "../config/aws";
import prisma from "../config/prisma";

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const fileExtension = file.originalname.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const buffer = file.buffer;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ url: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createNewCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, description, coverImageUrl } = req.body;
    if (!title || !description || !coverImageUrl) {
      return res
        .status(400)
        .json({ error: "Title, description, and cover image are required" });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        coverImage: coverImageUrl,
        instructorId: user.id,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createNewLesson = async (req: Request, res: Response) => {
  try {
    const { title, type, content, quizContent, courseId } = req.body;

    if (!title || !type || !courseId) {
      return res
        .status(400)
        .json({ error: "Title, type, and courseId are required" });
    }

    if (type === "reading" && !content) {
      return res
        .status(400)
        .json({ error: "Content is required for reading lessons" });
    }

    if (type === "quiz" && !quizContent) {
      return res
        .status(400)
        .json({ error: "Quiz content is required for quiz lessons" });
    }

    const newLesson = await prisma.lecture.create({
      data: {
        title,
        type,
        content: type === "reading" ? content : null,
        quizContent: type === "quiz" ? quizContent : null,
        courseId,
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
