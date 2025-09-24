import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/lib/api";

const NewCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, coverImage: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let coverImageUrl = "";

      if (formData.coverImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.coverImage);

        const uploadResponse = await api.post(
          "/instructor/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        coverImageUrl = uploadResponse.data.url;
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        coverImageUrl,
      };

      const response = await api.post("/instructor/new-course", courseData);

      if (response.status === 201) {
        toast.success("Course created successfully!");
        setFormData({
          title: "",
          description: "",
          coverImage: null,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="course-name">Enter name of the course</Label>
          <Input
            id="course-name"
            placeholder="React for Beginners"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-description">
            Enter a short description for the course
          </Label>
          <Textarea
            id="course-description"
            placeholder="This course covers the basics of React."
            className="min-h-[150px]"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover-image">Cover Image</Label>
          <Input
            id="cover-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewCourse;
