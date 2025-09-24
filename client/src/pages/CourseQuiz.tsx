import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Loading from "@/components/loading";
import { api } from "@/lib/api";
import type { QuizContent, QuizQuestion } from "@/types";

const CourseQuiz = () => {
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const courseId = useParams().id;
  const quizId = useParams().quizId;

  const fetchQuizContent = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/dashboard/course/${courseId}/quiz/${quizId}`
      );

      if (response.status === 200) {
        setQuizContent(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [courseId, quizId]);

  useEffect(() => {
    fetchQuizContent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const renderQuizQuestions = (questions: QuizQuestion[]) => {
    return (
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div className="space-y-3" key={qIndex}>
            <Label>
              {qIndex + 1}. {q.question}
            </Label>
            <RadioGroup
              value={answers[qIndex] || ""}
              onValueChange={(value) => handleAnswerChange(qIndex, value)}
            >
              {q.options.map((option, optIndex) => {
                const optionId = `question-${qIndex}-option-${optIndex}`;
                return (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={optionId} />
                    <Label htmlFor={optionId}>{option}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (
      !quizContent?.quizContent ||
      !Array.isArray(quizContent.quizContent.questions)
    )
      return;

    const questions = quizContent.quizContent.questions as QuizQuestion[];

    let localScore = 0;
    questions.forEach((q, qIndex) => {
      const selected = answers[qIndex];
      if (selected == null) return;
      if (typeof q.correctAnswer === "number") {
        const correctOption = q.options[q.correctAnswer];
        if (selected === correctOption) localScore += 1;
      } else if (typeof q.answer === "string") {
        if (selected === q.answer) localScore += 1;
      }
    });

    setSubmitting(true);

    try {
      await api.post("/student/quiz/submit", {
        courseId,
        lectureId: quizId,
        score: localScore,
      });

      setScore(localScore);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">{quizContent?.Course?.title}</h1>
      <p className="text-muted-foreground">
        {quizContent?.Course?.description}
      </p>
      <h2 className="text-xl font-semibold">{quizContent?.title}</h2>
      {quizContent?.quizContent &&
      Array.isArray(quizContent.quizContent.questions) ? (
        <>
          {renderQuizQuestions(quizContent.quizContent.questions)}
          <div className="flex items-center gap-4">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Answers"}
            </Button>
            {score != null && (
              <div className="text-sm">
                Score: {score} / {quizContent.quizContent.questions.length}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p>No quiz content available.</p>
        </div>
      )}
    </div>
  );
};

export default CourseQuiz;
