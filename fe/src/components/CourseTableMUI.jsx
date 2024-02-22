import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ActionCourse from "./actionCourse/ActionCourse";
import "../assets/styles/tableCourse.css";
// import { useState } from 'react';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  columnAvatar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const columns = [
  { id: "index_course", label: "ID", minWidth: 30 },
  { id: "created_by", label: "Created By", minWidth: 100 },
  { id: "name", label: "Course name", minWidth: 120 },
  { id: "progress", label: "Progress", minWidth: 30 },
  { id: "training_form", label: "Training Form", minWidth: 50 },
  { id: "managed_by", label: "Manager", minWidth: 100, align: "left" },
  { id: "trainer", label: "Trainer/Mentor", minWidth: 30, align: "center" },
  { id: "status", label: "Status", minWidth: 100, align: "left" },
  { id: "from_date", label: "From Date", minWidth: 50, align: "left" },
  { id: "to_date", label: "To Date", minWidth: 50, align: "left" },
  { id: "students", label: "Students", minWidth: 50, align: "center" },
  { id: "actions", label: "Actions", minWidth: 30, align: "center" },
];

function createData(
  course_id,
  index_course,
  created_by,
  name,
  progress,
  training_form,
  managed_by,
  trainer,
  status,
  from_date,
  to_date,
  students
) {
  return {
    course_id,
    index_course,
    created_by,
    name,
    progress,
    training_form,
    managed_by,
    trainer,
    status,
    from_date,
    to_date,
    students,
  };
}

export default function CourseTableMUI({ page, data, rowsPerPage }) {
  const rows = [];
  const classes = useStyles();
  const indexPage = page * rowsPerPage;
  for (let i = indexPage; i < data?.length + indexPage; i++) {
    const course_id = data[i - indexPage]?.course_id;
    const name = data[i - indexPage]?.name;
    const created_by = [
      data[i - indexPage]?.account_created.name,
      data[i - indexPage]?.account_created.avatar,
    ];
    const training_form = data[i - indexPage]?.training_form;
    const managed_by = [
      data[i - indexPage]?.account_managed.name,
      data[i - indexPage]?.account_managed.avatar,
    ];
    const mentor = data[i - indexPage]?.courses_mentors.length;
    const status = Number.parseInt(data[i - indexPage]?.status);
    const from_date = data[i - indexPage]?.from_date;
    const to_date = data[i - indexPage]?.to_date;
    const students = data[i - indexPage]?.courses_students.length;
    const countLesson = data[i - indexPage].courses_categories?.reduce(
      (total, category) => total + category.lectures.length,
      0
    );
    const countLessonSuccess = data[i - indexPage].courses_categories?.reduce(
      (total, category) =>
        total +
        category.lectures.reduce((totalDone, lecture) => {
          if (lecture.status === "1") {
            return totalDone + 1;
          } else {
            return totalDone;
          }
        }, 0),
      0
    );
    const progress = Math.ceil((countLessonSuccess / countLesson) * 100) || 0;
    rows.push(
      createData(
        course_id,
        i + 1,
        created_by,
        name,
        progress,
        training_form,
        managed_by,
        mentor,
        status,
        from_date,
        to_date,
        students
      )
    );
  }
  console.log(rows);

  return !rows ? null : (
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
          {rows.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.course_id}>
                {columns.map((column, index) => {
                  const value = row[column.id];
                  switch (column.id) {
                    case "actions":
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <ActionCourse
                            status={row.status}
                            index={index}
                            course_id={row.course_id}
                          />
                        </TableCell>
                      );
                    case "status":
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            <div>
                              <span
                                className="status__course"
                                style={{
                                  backgroundColor: getStatusColor(value),
                                }}
                              >
                                {getStatusText(value)}
                              </span>
                            </div>
                          )}
                        </TableCell>
                      );
                    case "progress":
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            <div>
                              <span
                                className="status__course"
                                style={{
                                  backgroundColor: getProgressColor(
                                    value,
                                    row["status"]
                                  ),
                                }}
                              >
                                {value + "%"}
                              </span>
                            </div>
                          )}
                        </TableCell>
                      );
                    case "created_by":
                    case "managed_by":
                      return (
                        <TableCell
                          className={classes.columnAvatar}
                          key={column.id}
                          align={column.align}
                        >
                          <div className="created_by--content">
                            <img
                              className="image__created_by"
                              src={
                                value[1] || "/src/assets/images/user_null.png"
                              }
                              alt=""
                            />
                            {column.format && typeof value === "number"
                              ? column.format(value[0])
                              : value[0]}
                          </div>
                        </TableCell>
                      );
                    default:
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function getStatusText(value) {
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

function getStatusColor(value) {
  switch (value) {
    case 1:
      return "#9337BE";
    case 2:
      return "#F66438";
    case 3:
      return "#00D084";
    case 4:
      return "#FF0000";
    default:
      return "#000000";
  }
}
function getProgressColor(value, status) {
  // console.log(status);
  if (status === 4) {
    return "#FF0000";
  }
  switch (value) {
    case 0:
      return "#F66438";
    case 100:
      return "#00D084";
    default:
      return "#F66438";
  }
}
