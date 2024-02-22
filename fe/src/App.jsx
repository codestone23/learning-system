import "./App.css";
import Login from "./pages/login.jsx";
import Layout from "./pages/layout.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ChangePassword from "./pages/changePassword.jsx";
import AccountManage from "./pages/accountManage";
import PersonalInfo from "./pages/personalInfo.jsx";
import PageComingSoon from "./pages/PageComingSoon.jsx";
import ViewCourse from "./components/ViewCourse.jsx";
import CourseManager from "./pages/courseManager.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseDetail from "./pages/courseDetail.jsx";
import YourSchedule from "./pages/yourSchedule.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="reset-password" element={<ChangePassword />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/" element={<Layout redirectPath="/login" />}>
          <Route
            path="configuration/account"
            element={<AccountManage />}
          ></Route>
          <Route
            path="documents"
            element={<PageComingSoon title="TMS / Documents" />}
          ></Route>
          <Route
            path="report"
            element={<PageComingSoon title="TMS / Reports" />}
          ></Route>
          <Route
            path="application-settings"
            element={
              <PageComingSoon title="Configuration / Application Setting" />
            }
          ></Route>
          <Route path="schedules" element={<YourSchedule />}></Route>
          <Route
            path="students"
            element={<PageComingSoon title="TMS / Students" />}
          ></Route>
          <Route
            path="pending-courses"
            element={<PageComingSoon title="Courses / Pending Courses" />}
          ></Route>
          <Route
            path="joining-courses"
            element={<PageComingSoon title="Courses / Joining Courses" />}
          ></Route>
          <Route
            path="training-courses"
            element={<PageComingSoon title="Training" />}
          ></Route>
          <Route path="courses" element={<CourseManager />}></Route>
          <Route path="courses/lecture" element={<ViewCourse />}></Route>
          <Route path="courses/detail" element={<CourseDetail />}></Route>

          <Route path="profile" element={<PersonalInfo />}></Route>
          <Route path="*" element={<Login />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
