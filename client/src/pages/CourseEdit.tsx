import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import {
  Brain,
  FileText,
  Plus,
  Trash2,
  Upload,
  Edit3,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import Loading from "@/components/loading";
import { api } from "@/lib/api";
import type { CourseDetails } from "@/types";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TextLessonForm {
  title: string;
  contentType: "write" | "upload";
  content: string;
  uploadedFile: File | null;
}

interface QuizLessonForm {
  title: string;
  questions: QuizQuestion[];
}

const CourseEdit = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lessonType, setLessonType] = useState<"text" | "quiz" | null>(null);

  const [textForm, setTextForm] = useState<TextLessonForm>({
    title: "",
    contentType: "write",
    content: "",
    uploadedFile: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image, PDF, or Word document file");
      return;
    }

    setTextForm((prev) => ({
      ...prev,
      uploadedFile: file,
    }));

    toast.success("File selected successfully!");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const [quizForm, setQuizForm] = useState<QuizLessonForm>({
    title: "",
    questions: [],
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "text" || type === "quiz") {
      setLessonType(type);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const id = useParams().id;

  const addQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };

    setQuizForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuizQuestion = (questionId: string) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const updateQuizQuestion = (
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const updateQuizQuestionOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const handleTextFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let fileUrl = null;

      if (textForm.contentType === "upload" && textForm.uploadedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", textForm.uploadedFile);

        toast.loading("Uploading file...");

        const uploadResponse = await api.post(
          "/instructor/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        fileUrl = uploadResponse.data.url;
        toast.dismiss();
        toast.success("File uploaded successfully!");
      }

      const lessonData = {
        title: textForm.title,
        type: "reading",
        content: textForm.contentType === "write" ? textForm.content : fileUrl,
        courseId: id,
      };

      const response = await api.post("/instructor/new-lesson", lessonData);

      if (response.status === 201) {
        toast.success("Text lesson saved successfully!");

        setTextForm({
          title: "",
          contentType: "write",
          content: "",
          uploadedFile: null,
        });

        setLessonType(null);
        setSearchParams({});

        await fetchCourseDetails();
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);

      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 413) {
        toast.error(
          "File is too large. Please upload a file smaller than 10MB."
        );
      } else if (axiosError.response?.status === 415) {
        toast.error(
          "Unsupported file type. Please upload PDF, DOC, or DOCX files."
        );
      } else {
        toast.error("Failed to save lesson. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const lessonData = {
        title: quizForm.title,
        type: "quiz",
        quizContent: {
          questions: quizForm.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
        courseId: id,
      };

      const response = await api.post("/instructor/new-lesson", lessonData);

      if (response.status === 201) {
        toast.success("Quiz lesson saved successfully!");

        setQuizForm({
          title: "",
          questions: [],
        });

        setLessonType(null);
        setSearchParams({});

        await fetchCourseDetails();
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Failed to save quiz lesson. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  useEffect(() => {
    fetchCourseDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 flex gap-10">
      <div className="space-y-6 w-full">
        <h1 className="text-3xl font-semibold">
          {courseDetails?.title || "Course Title"}
        </h1>
        <p className="text-muted-foreground">
          {courseDetails?.description || "Course Description"}
        </p>

        {lessonType === null && (
          <div className="mx-auto max-w-xl py-10">
            <h3 className="text-center font-medium">
              Select The Type Of Lesson You Want to Add
            </h3>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <button
                onClick={() => {
                  setLessonType("text");
                  setSearchParams({ type: "text" });
                }}
                className="bg-white rounded-lg px-4 py-10 flex flex-col items-center justify-center gap-2"
              >
                <FileText className="size-8" />
                <h4 className="font-semibold">Text</h4>
              </button>
              <button
                onClick={() => {
                  setLessonType("quiz");
                  setSearchParams({ type: "quiz" });
                }}
                className="bg-white rounded-lg px-4 py-10 flex flex-col items-center justify-center gap-2"
              >
                <Brain className="size-8" />
                <h4 className="font-semibold">Quiz</h4>
              </button>
            </div>
          </div>
        )}

        {lessonType === "text" && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Add Text Lesson</h3>
            <form onSubmit={handleTextFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-title">Lesson Title</Label>
                <Input
                  id="text-title"
                  value={textForm.title}
                  onChange={(e) =>
                    setTextForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setTextForm((prev) => ({
                        ...prev,
                        contentType: "write",
                        uploadedFile: null,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      textForm.contentType === "write"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Edit3 className="w-6 h-6" />
                      <span className="font-medium">Write Content</span>
                      <span className="text-sm text-muted-foreground">
                        Write your lesson content directly
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTextForm((prev) => ({
                        ...prev,
                        contentType: "upload",
                        content: "",
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      textForm.contentType === "upload"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6" />
                      <span className="font-medium">Upload Document</span>
                      <span className="text-sm text-muted-foreground">
                        Upload images, PDF or Word documents
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {textForm.contentType === "write" && (
                <div className="space-y-2">
                  <Label htmlFor="text-content">Lesson Content</Label>
                  <Textarea
                    id="text-content"
                    value={textForm.content}
                    onChange={(e) =>
                      setTextForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter lesson content"
                    className="min-h-[200px]"
                    required
                  />
                </div>
              )}

              {textForm.contentType === "upload" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Document</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.svg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {isDragging
                            ? "Drop file here"
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Images, PDF, DOC, DOCX (max 10MB)
                        </span>
                      </label>
                      {textForm.uploadedFile && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-green-800 block">
                                {textForm.uploadedFile.name}
                              </span>
                              <span className="text-xs text-green-600">
                                {(
                                  textForm.uploadedFile.size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setTextForm((prev) => ({
                                  ...prev,
                                  uploadedFile: null,
                                }))
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (textForm.contentType === "write"
                      ? !textForm.content.trim()
                      : !textForm.uploadedFile)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Text Lesson"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLessonType(null);
                    setSearchParams({});
                    setTextForm({
                      title: "",
                      contentType: "write",
                      content: "",
                      uploadedFile: null,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {lessonType === "quiz" && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Add Quiz Lesson</h3>
            <form onSubmit={handleQuizFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={quizForm.title}
                  onChange={(e) =>
                    setQuizForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">Quiz Questions</h4>
                  <Button
                    type="button"
                    onClick={addQuizQuestion}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {quizForm.questions.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No questions added yet. Click "Add Question" to get started.
                  </p>
                )}

                {quizForm.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">
                        Question {questionIndex + 1}
                      </h5>
                      <Button
                        type="button"
                        onClick={() => removeQuizQuestion(question.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>
                        Question
                      </Label>
                      <Textarea
                        id={`question-${question.id}`}
                        value={question.question}
                        onChange={(e) =>
                          updateQuizQuestion(question.id, {
                            question: e.target.value,
                          })
                        }
                        placeholder="Enter your question"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Options</Label>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            name={`correct-answer-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() =>
                              updateQuizQuestion(question.id, {
                                correctAnswer: optionIndex,
                              })
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Input
                              value={option}
                              onChange={(e) =>
                                updateQuizQuestionOption(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {question.correctAnswer === optionIndex
                              ? "Correct"
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || quizForm.questions.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Quiz Lesson"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLessonType(null);
                    setSearchParams({});
                    setQuizForm({ title: "", questions: [] });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEdit;
