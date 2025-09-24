export interface Lecture {
  id: string;
  title: string;
  type: string;
  content?: string;
  quizContent?: unknown;
  courseId?: string;
  isViewed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  lectures: Lecture[];
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  lectures: { id: string; title: string; type: string; isViewed?: boolean }[];
  courseEnrolled?: boolean;
  lastLectureCompletedIndex?: number;
  instructor: {
    id: string;
    name: string;
  };
}

export interface DashboardData {
  user: {
    name: string;
  };
  courses: Array<{
    id: string;
    title: string;
    description: string;
    coverImage: string;
    lectures: Lecture[];
  }>;
}

export interface DocumentContent {
  id: string;
  title: string;
  type: string;
  content: string | null;
  quizContent: unknown;
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
  Course: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    instructorId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer?: string;
  correctAnswer?: number;
}

export interface QuizContent {
  id: string;
  title: string;
  type: string;
  content: string | null;
  quizContent: {
    questions: QuizQuestion[] | null;
  };
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
  Course: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    instructorId: string;
    createdAt: string;
    updatedAt: string;
  };
}
