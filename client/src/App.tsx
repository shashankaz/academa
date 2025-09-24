import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import RootLayout from "./Layout/RootLayout";
import DashboardLayout from "./Layout/DashboardLayout";

import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Demo = lazy(() => import("./pages/Demo"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewCourse = lazy(() => import("./pages/NewCourse"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const CourseDocs = lazy(() => import("./pages/CourseDocs"));
const CourseQuiz = lazy(() => import("./pages/CourseQuiz"));
const CourseEdit = lazy(() => import("./pages/CourseEdit"));
const Profile = lazy(() => import("./pages/Profile"));

const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="demo" element={<Demo />} />
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="new" element={<NewCourse />} />
              <Route path="course" element={<Courses />} />
              <Route path="course/:id" element={<CourseDetails />} />
              <Route
                path="course/:id/reading/:docId"
                element={<CourseDocs />}
              />
              <Route path="course/:id/quiz/:quizId" element={<CourseQuiz />} />
              <Route path="course/:id/edit" element={<CourseEdit />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
};

export default Home;
