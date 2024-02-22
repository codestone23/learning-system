import "../assets/styles/root.css";
import "../assets/styles/accountManagement.css";
import "../assets/styles/courseManager.css";
import "../assets/styles/tableCourse.css";
import { ToastContainer } from "react-toastify";
import "../assets/styles/timelineCourse.css";
import "../assets/styles/courseDetail.css";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import PrePointIcon from "../components/icons-timeline/PrePointIcon";
import PointIcon from "../components/icons-timeline/PointIcon";
import NextPointIcon from "../components/icons-timeline/NextPointIcon";
import HorizontalBottomIcon from "../components/icons-timeline/HorizontalBottomIcon";
import HorizontalTopIcon from "../components/icons-timeline/HorizontalTopIcon";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Fragment, useState } from "react";
import { makeStyles } from "@mui/styles";
import ActionCourseDetail from "../components/actionCourse/ActionCourseDetail";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackDrop from "../components/backdrop/BackDrop";
// import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import {
  GET_ACCOUNTS_BY_ROLE_STUDENT,
  GET_STUDENTS_BY_COURSE_ID,
} from "../stores/types/account";
import AssignNewStudent from "../components/actionCourse/AssignNewStudent";
import ScheduleCourseDetail from "../components/courseDetail/ScheduleCourseDetail";

const useStyles = makeStyles(() => ({
  columnAvatar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  borderBottom: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  columnAvatarBorder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    backgroundColor: theme.palette.mode === "light" ? "#3FEE22" : "#308fe8",
  },
}));

const columns = [
  { id: "category", label: "Category", minWidth: 150, align: "left" },
  { id: "topic", label: "Topic", minWidth: 100, align: "left" },
  { id: "status", label: "Status", minWidth: 30, align: "left" },
  { id: "trainer", label: "Trainer", minWidth: 100, align: "left" },
  { id: "time", label: "Time", minWidth: 150, align: "left" },
  { id: "document", label: "Document", minWidth: 30, align: "left" },
  { id: "description", label: "Description", minWidth: 100, align: "left" },
  { id: "attendance", label: "Attendance", minWidth: 50, align: "center" },
  { id: "actions", label: "Action", minWidth: 30, align: "center" },
];

function CourseDetail() {
  const dispatchAction = useDispatch();
  const classes = useStyles();
  const [isUpdateSchedule, setIsUpdateSchedule] = useState(false);
  const course = useSelector((state) => state.courses.course);
  const loadingCourse = useSelector((state) => state.courses.loadingCourse);
  const loading = useSelector((state) => state.accounts.loading);
  const students = useSelector((state) => state.accounts.students);
  console.log(students);
  console.log("dmcd");
  const studentsByCourseId = useSelector(
    (state) => state.accounts.studentsByCourseId
  );
  const [isAssignStudent, setIsAssignStudent] = useState(false);
  const rows = course?.courses_categories;
  console.log(rows);
  let checkTimeline = true;
  let trainers = new Set();
  for (let i = 0; i < course?.courses_mentors?.length; i++) {
    course?.courses_mentors.map((mentor) => {
      trainers.add(mentor.accounts.name);
    });
  }
  const countLesson = course?.courses_categories?.reduce(
    (total, category) => total + category?.lectures.length,
    0
  );
  const countLessonSuccess = course?.courses_categories?.reduce(
    (total, category) =>
      total +
      category?.lectures.reduce((totalDone, lecture) => {
        if (lecture?.status === "0") {
          return totalDone + 1;
        } else {
          return totalDone;
        }
      }, 0),
    0
  );
  const progress = Math.ceil((countLessonSuccess / countLesson) * 100) || 0;
  console.log(course);
  console.log(loadingCourse);
  const handleClickOpenAssignStudent = () => {
    setIsAssignStudent(!isAssignStudent);
    dispatchAction({
      type: GET_STUDENTS_BY_COURSE_ID,
      payload: course.course_id,
    });
    dispatchAction({ type: GET_ACCOUNTS_BY_ROLE_STUDENT, payload: "Student" });
  };
  console.log(course?.courses_categories.length);
  const handleUpdateSchedule = () => {
    setIsUpdateSchedule(!isUpdateSchedule);
  };
  console.log(isUpdateSchedule);
  return loadingCourse ? (
    <BackDrop status={true} />
  ) : (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          Courses /
          <Link to="/courses" style={{ color: "#6b778c" }}>
            <span> All courses </span>
          </Link>
          / Detail
        </div>

        <div className="main-content-title">
          <div className="title-account">{course?.name}</div>

          <button
            onClick={handleClickOpenAssignStudent}
            className="button-create-new-account assign__btn assign__student--btn"
          >
            Assign Student
          </button>
          <button
            onClick={handleUpdateSchedule}
            className="button-create-new-account assign__btn"
          >
            Update Schedule
          </button>
        </div>
      </div>
      <div className="account-info-table course-info-table">
        {course.courses_categories.length === 0 && (
          <div className="not__exist">
            The timeline has not been updated yet
          </div>
        )}
        {course.courses_categories.length !== 0 && (
          <div className="timeline__course">
            <div className="timeline__course--start">
              <span className="timeline__course--start--title">Start</span>
            </div>
            <div className="timeline__course--middle">
              <section className="ps-timeline-sec">
                <div className="container">
                  <ol className="ps-timeline timeline__course--main">
                    {course?.courses_categories.map((category) =>
                      category?.lectures.map((lecture, index) => {
                        checkTimeline = !checkTimeline;
                        if (checkTimeline) {
                          return (
                            <>
                              <li key={index}>
                                <div className="img-handler-bot timeline__course--chidle__topic">
                                  <Tooltip title={lecture.topic}>
                                    <span className="lecture__topic">
                                      {lecture.topic}
                                    </span>
                                  </Tooltip>
                                </div>
                                <div className="ps-top timeline__course--chidle__title">
                                  {lecture.date}
                                </div>
                                <div className="ps-sp-bot">
                                  <div className="timeline__course--point__bottom">
                                    <div>
                                      {lecture.status === "0" ? (
                                        <PrePointIcon />
                                      ) : lecture.status == "1" ? (
                                        <PointIcon />
                                      ) : (
                                        <NextPointIcon />
                                      )}
                                      {/* <PrePointIcon /> */}
                                    </div>
                                    <div>
                                      <HorizontalBottomIcon />
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </>
                          );
                        } else {
                          return (
                            <li key={index}>
                              <div className="img-handler-top timeline__course--title timeline__course--chidle__topic">
                                <Tooltip
                                  sx={{ fontSize: "16px" }}
                                  title={lecture.topic}
                                >
                                  <span className="lecture__topic">
                                    {lecture.topic}
                                  </span>
                                </Tooltip>
                              </div>
                              <div className="ps-bot timeline__course--chidle__title">
                                {lecture.date}
                              </div>
                              <span className="ps-sp-top timeline__course--chidle__point">
                                <div className="timeline__course--point__top">
                                  <div>
                                    {lecture.status === "0" ? (
                                      <PrePointIcon />
                                    ) : lecture.status == "1" ? (
                                      <PointIcon />
                                    ) : (
                                      <NextPointIcon />
                                    )}
                                  </div>
                                  <div className="horizontal__top--icon">
                                    <HorizontalTopIcon />
                                  </div>
                                </div>
                              </span>
                            </li>
                          );
                        }
                      })
                    )}
                  </ol>
                </div>
              </section>
            </div>
            <div className="timeline__course--end">
              <span className="timeline__course--end--title">End</span>
            </div>
          </div>
        )}
        <div className="course__info">
          <div className="course__info--head">
            <div className="course__info--head__title">Summary</div>
            <div className="course__info--head__summary">{course?.summary}</div>
          </div>
          <div className="course__info--body">
            <div className="course__info--body__content">
              <table>
                <tr>
                  <td className="course__info--body__title">Trainer:</td>
                  <td className="course__info--body__description">
                    {[...trainers].join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">Training form:</td>
                  <td className="course__info--body__description">
                    {course?.training_form}
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">
                    Training location:
                  </td>
                  <td className="course__info--body__description">
                    {course?.training_location}
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">Students:</td>
                  <td className="course__info--body__description">
                    <AvatarGroup max={12}>
                      {course?.courses_students.map((student, index) => (
                        <Avatar
                          key={index}
                          alt={student?.accounts.name}
                          sx={{ width: 36, height: 36 }}
                          src={student?.accounts.avatar}
                        />
                      ))}
                    </AvatarGroup>
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">
                    Remaining Reminder:
                  </td>
                  <td className="course__info--body__description">
                    <span className="course__info--body__reminder--number">
                      25
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div className="course__info--body__content">
              <table>
                <tr>
                  <td className="course__info--body__title">Status:</td>
                  <td className="course__info--body__description">
                    <spa className="course__info--body__status">
                      {getStatusTextCourse(Number.parseInt(course?.status))}
                    </spa>
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">Training time:</td>
                  <td className="course__info--body__description">
                    {course?.from_date + " - " + course?.to_date}
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">Training fee:</td>
                  <td className="course__info--body__description">
                    {course?.fee}
                  </td>
                </tr>
                <tr>
                  <td className="course__info--body__title">
                    Training Progress:
                  </td>
                  <td className="course__info--body__description">
                    {countLessonSuccess + "/" + countLesson} lesson
                  </td>
                </tr>
              </table>
              <div className="training__progress">
                <Box sx={{ flexGrow: 1 }}>
                  <BorderLinearProgress
                    variant="determinate"
                    value={progress}
                  />
                </Box>
              </div>
            </div>
          </div>

          <div className="course__info--footer">
            <div className="course__info--footer__title">Detailed schedule</div>
            {course.courses_categories.length === 0 && (
              <div className="not__exist">
                <h2>No lectures found</h2>
                <p>There&apos;s no Lecture width the info that you provided</p>
              </div>
            )}
            {course.courses_categories.length !== 0 && (
              <div className="course__info--footer__content">
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows?.map((category, index) => {
                          return (
                            <Fragment key={index}>
                              <TableRow>
                                <TableCell
                                  style={{
                                    borderBottom:
                                      "1px solid rgba(224, 224, 224, 1)",
                                  }}
                                  className={classes.borderBottom}
                                  rowSpan={category.lectures.length + 1}
                                >
                                  {category.category_name}
                                </TableCell>
                              </TableRow>
                              {category.lectures.map((lecture, index) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={index}
                                  >
                                    {columns.map((column) => {
                                      const value = lecture[column.id];
                                      switch (column.id) {
                                        case "actions":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              <ActionCourseDetail
                                                lecture_id={lecture.lecture_id}
                                              />
                                            </TableCell>
                                          );
                                        case "status":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              {column.format &&
                                              typeof value === "number" ? (
                                                column.format(value)
                                              ) : (
                                                <div>
                                                  <span
                                                    className="status__course"
                                                    style={{
                                                      backgroundColor:
                                                        getStatusColor(value),
                                                    }}
                                                  >
                                                    {getStatusText(value)}
                                                  </span>
                                                </div>
                                              )}
                                            </TableCell>
                                          );
                                        case "document":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              {column.format &&
                                              typeof value === "number" ? (
                                                column.format(value)
                                              ) : (
                                                <div>
                                                  <span
                                                    className="status__course"
                                                    style={{
                                                      backgroundColor:
                                                        getDocumentColor(
                                                          lecture.status,
                                                          value ? 1 : 0
                                                        ),
                                                    }}
                                                  >
                                                    {/* {column.format && typeof value === "number"
                                                              ? column.format(value.document_id)
                                                              : value.document_id} */}
                                                    {getDocumentText(
                                                      lecture.status,
                                                      value ? 1 : 0
                                                    )}
                                                  </span>
                                                </div>
                                              )}
                                            </TableCell>
                                          );
                                        case "trainer":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.columnAvatarBorder
                                                  : classes.columnAvatar
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              <div className="created_by--content">
                                                <img
                                                  className="image__trainer"
                                                  src={
                                                    lecture.accounts.avatar ||
                                                    "/src/assets/images/user_null.png"
                                                  }
                                                  alt=""
                                                />
                                                {lecture.accounts.name}
                                              </div>
                                            </TableCell>
                                          );
                                        case "category":
                                          return <></>;
                                        case "time":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              {lecture?.date + " - "}
                                              {lecture?.start_time
                                                ? lecture?.start_time
                                                : "None"}
                                            </TableCell>
                                          );
                                        case "attendance":
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              10
                                            </TableCell>
                                          );
                                        case "topic":
                                          return (
                                            <Tooltip title={value}>
                                              <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                                maxWidth: "250px",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                width: "100px"
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              {column.format &&
                                              typeof value === "number"
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                            </Tooltip>
                                            
                                          );
                                          case "description":
                                            return (
                                              <Tooltip title={value}>
                                                <TableCell
                                                  style={{
                                                    borderBottom:
                                                      index ===
                                                      category.lectures.length - 1
                                                        ? "1px solid rgba(224, 224, 224, 1)"
                                                        : "",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        maxWidth:"250px"
                                                  }}
                                                  className={
                                                    index ===
                                                    category.lectures.length - 1
                                                      ? classes.borderBottom
                                                      : ""
                                                  }
                                                  key={column.id}
                                                  align={column.align}
                                                >
                                                  {column.format &&
                                                  typeof value === "number"
                                                    ? column.format(value)
                                                    : value}
                                                </TableCell>
                                              </Tooltip>
                                              
                                            );
                                        default:
                                          return (
                                            <TableCell
                                              style={{
                                                borderBottom:
                                                  index ===
                                                  category.lectures.length - 1
                                                    ? "1px solid rgba(224, 224, 224, 1)"
                                                    : "",
                                              }}
                                              className={
                                                index ===
                                                category.lectures.length - 1
                                                  ? classes.borderBottom
                                                  : ""
                                              }
                                              key={column.id}
                                              align={column.align}
                                            >
                                              {column.format &&
                                              typeof value === "number"
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                          );
                                      }
                                    })}
                                  </TableRow>
                                );
                              })}
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}
          </div>
        </div>
        <div></div>
      </div>
      {isAssignStudent && (
        <>
          {loading && <BackDrop status={true} />}
          {!loading && studentsByCourseId && (
            <AssignNewStudent
              handleClose={handleClickOpenAssignStudent}
              open={isAssignStudent}
              data={studentsByCourseId}
              course_id={course.course_id}
              students={students}
            />
          )}
        </>
      )}
      {isUpdateSchedule && (
        <ScheduleCourseDetail
          open={isUpdateSchedule}
          course={course}
          handleCloseSchedule={handleUpdateSchedule}
        />
      )}
      <ToastContainer />
    </>
  );
}

export default CourseDetail;

function getStatusText(value) {
  switch (value) {
    case "0":
      return "DONE";
    case "1":
      return "NEXT LESSON";
    case "2":
      return "PENDING";
    case "3":
      return "CANCELLED";
    case "4":
      return "DELETED";

    default:
      return "-";
  }
}

function getStatusColor(value) {
  switch (value) {
    case "0":
      return "#00D084";
    case "1":
      return "#F66438";
    case "2":
      return "#9337BE";
    case "3":
      return "#FF0000";
    case "4":
      return "#4E567A";
    default:
      return "#000000";
  }
}

function getDocumentText(status, value) {
  if (status === 3) {
    return "PENDING";
  } else if (value === 0 || status === 5) {
    return "MISSING";
  }
  return "UPDATED";
}

function getDocumentColor(status, value) {
  if (status === 3) {
    return "#42526E";
  } else if (value === 0 || status === 5) {
    return "#D04234";
  }
  return "#00D084";
}
function getStatusTextCourse(value) {
  switch (value) {
    case 1:
      return "PENDING";
    case 2:
      return "IN PROGRESS";
    case 3:
      return "DONE";
    case 4:
      return "CANCELLED";
    default:
      return "-";
  }
}

// function getStatusColorCourse(value) {
//   switch (value) {
//     case 1:
//       return "#9337BE";
//     case 2:
//       return "#F66438";
//     case 3:
//       return "#00D084";
//     case 4:
//       return "#FF0000";
//     default:
//       return "#000000";
//   }
// }
