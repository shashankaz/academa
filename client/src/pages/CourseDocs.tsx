import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import Loading from "@/components/loading";
import { api } from "@/lib/api";
import type { DocumentContent } from "@/types";

const CourseDocs = () => {
  const [documentContent, setDocumentContent] =
    useState<DocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMarked, setViewMarked] = useState(false);

  const courseId = useParams().id;
  const docId = useParams().docId;

  const fetchReadingContent = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/dashboard/course/${courseId}/reading/${docId}`
      );

      if (response.status === 200) {
        setDocumentContent(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [courseId, docId]);

  useEffect(() => {
    fetchReadingContent();
  }, [fetchReadingContent]);

  useEffect(() => {
    const markViewed = async () => {
      if (!courseId || !docId) return;
      try {
        await api.post("/student/lecture/viewed", {
          courseId,
          lectureId: docId,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (documentContent && documentContent.type === "reading" && !viewMarked) {
      markViewed();
      setViewMarked(true);
    }
  }, [documentContent, viewMarked, courseId, docId]);

  const findFileLink = (text: string) => {
    const regex =
      /(https?:\/\/academa\.s3\.ap-south-1\.amazonaws\.com\/[^\s]+\.(pdf|docx|jpg|jpeg|png|gif|webp|svg))/gi;
    const matches = text.match(regex);
    return matches ? matches[0] : null;
  };

  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase();
  };

  const renderFileContent = (fileUrl: string) => {
    const extension = getFileExtension(fileUrl);

    if (extension === "pdf") {
      return (
        <div className="border-2 border-primary rounded-lg p-4">
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            className="rounded-lg"
          ></iframe>
        </div>
      );
    } else if (extension === "docx") {
      return (
        <div className="border-2 border-primary rounded-lg p-4">
          <div className="text-center py-8">
            <p className="mb-4">
              DOCX files cannot be previewed directly in the browser.
            </p>
            <a
              href={fileUrl}
              download
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download {fileUrl.split("/").pop()}
            </a>
          </div>
        </div>
      );
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return (
        <div className="border-2 border-primary rounded-lg p-4">
          <img
            src={fileUrl}
            alt={fileUrl.split("/").pop()}
            className="max-w-full h-auto rounded-lg mx-auto"
            style={{ maxHeight: "600px" }}
          />
        </div>
      );
    }

    return (
      <div className="border-2 border-primary rounded-lg p-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View File: {fileUrl.split("/").pop()}
        </a>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">
        {documentContent?.Course?.title}
      </h1>
      <p className="text-muted-foreground">
        {documentContent?.Course?.description}
      </p>
      <h2 className="text-xl font-semibold">{documentContent?.title}</h2>
      {documentContent?.content && findFileLink(documentContent.content) ? (
        renderFileContent(findFileLink(documentContent.content)!)
      ) : (
        <p>
          {documentContent?.content
            ?.split("\n")
            .map((line: string, index: number) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </p>
      )}
    </div>
  );
};

export default CourseDocs;
