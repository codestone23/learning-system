import "../assets/styles/root.css";
import "../assets/styles/accountManagement.css";
import "../assets/styles/courseManager.css";
import "../assets/styles/tableCourse.css";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from "../components/icons/SearchIcon";
import CourseTableMUI from "../components/CourseTableMUI.jsx";
import FormNewCourse from "../components/FormNewCourse.jsx";
import { ToastContainer } from "react-toastify";
// import ScheduleCourse from "../components/actionCourse/ScheduleCourse.jsx";
import {
  GET_ALL_COURSES,
  GET_TOTAL_COURSES,
  GET_COURSE_BY_ID,
} from "../stores/types/course.js";
import {
  GET_ACCOUNTS_BY_ROLES,
  GET_ACCOUNTS_BY_ROLE_MONITOR,
  GET_ACCOUNTS_BY_ROLE_STUDENT,
} from "../stores/types/account.js";
import BackDrop from "../components/backdrop/BackDrop.jsx";

const STATUS = () => ["PENDING", "IN PROGRESS", "DONE", "CANCELED"];

function SelectSmall({ navigate, status, name, rowsPerPage }) {
  const handleChangeStatus = (event) => {
    navigate(
      `.?pageNo=0&name=${name}&status=${event.target.value}&pageSize=${rowsPerPage}`
    );
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
      <InputLabel id="demo-select-small-label">Status</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={status}
        label="Status"
        onChange={handleChangeStatus}
      >
        <MenuItem value="0">
          <em>ALL</em>
        </MenuItem>
        {STATUS().map((statusItem, index) => (
          <MenuItem key={statusItem} value={index + 1}>
            {statusItem}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function CourseManager() {
  const [searchParams] = useSearchParams();
  const [openNewCourse, setOpenNewCourse] = useState(false);
  const status = searchParams.get("status") || "0";
  const name = searchParams.get("name") || "";
  const page = searchParams.get("pageNo") || "0";
  const rowsPer = searchParams.get("pageSize") || "5";
  const [pageNo, setPageNo] = useState(Number.parseInt(page));
  const [rowsPerPage, setRowsPerPage] = useState(Number.parseInt(rowsPer));
  const data = useSelector((state) => state.courses.courses);
  const total = useSelector((state) => state.courses.total);
  const loading = useSelector((state) => state.courses.loading);
  const loadingCourse = useSelector((state) => state.courses.loadingCourse);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPageNo(Number.parseInt(page));
    setRowsPerPage(Number.parseInt(rowsPer));
    const query = { name, status, pageNo, rowsPerPage };
    findAllCourses(query);
    findTotalCourses(query);
    dispatch({ type: GET_ACCOUNTS_BY_ROLES, payload: ["Mentor", "Trainer"] });
  }, [name, page, pageNo, rowsPer, rowsPerPage, searchParams, status]);
  const findAllCourses = (query) => {
    dispatch({ type: GET_ALL_COURSES, payload: query });
  };
  const findTotalCourses = (query) => {
    dispatch({ type: GET_TOTAL_COURSES, payload: query });
  };
  const handleClickOpenNewCourse = () => {
    dispatch({ type: GET_ACCOUNTS_BY_ROLES, payload: ["Mentor", "Trainer"] });
    dispatch({ type: GET_COURSE_BY_ID, payload: 0 });
    dispatch({ type: GET_ACCOUNTS_BY_ROLE_MONITOR, payload: "Monitor" });
    dispatch({ type: GET_ACCOUNTS_BY_ROLE_STUDENT, payload: "Student" });
    setOpenNewCourse(!openNewCourse);
  };
  const handleChangeName = debounce((event) => {
    navigate(
      `.?pageNo=0&name=${event.target.value}&status=${status}&pageSize=${rowsPerPage}`
    );
  }, 1500);
  // console.log(data);
  const handleBack = () => {
    const query = { name, status, pageNo, rowsPerPage };
    findAllCourses(query);
    findTotalCourses(query);
  };

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">Courses / All courses</div>

        <div className="main-content-title">
          <div className="title-account">Courses Management</div>

          <button
            onClick={handleClickOpenNewCourse}
            className="button-create-new-account"
          >
            New Course
          </button>
        </div>
        <div className="action">
          <form className="form-search-account">
            <div className="icon-search-input">
              <SearchIcon />
            </div>
            <input
              type="text"
              className="form-input-search-account"
              placeholder="Search Course"
              name="name"
              htmlFor="name"
              defaultValue={name}
              onChange={handleChangeName}
            />
            <div className="status-course">
              <SelectSmall
                navigate={navigate}
                status={status}
                name={name}
                rowsPerPage={rowsPerPage}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="account-info-table course-info-table">
        {/* {!data && 
      <BackDrop status={true}/>} */}
        {loading && <BackDrop status={true} />}

        {!loading && (
          <>
          {Number.parseInt(total) === 0 && (
            <div className="no__account">
              <h2>No courses found</h2>
              <p>There&apos;s no Course width the info that you provided</p>
            </div>
          )}
          {total > 0 && 
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <CourseTableMUI
              page={pageNo}
              totalPages={total}
              data={data}
              rowsPerPage={rowsPerPage}
            />
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={total}
              page={pageNo}
              onPageChange={(event, page) =>
                navigate(
                  `.?pageNo=${page}&name=${name}&status=${status}&pageSize=${rowsPerPage}`
                )
              }
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                navigate(
                  `.?pageNo=0&name=${name}&status=${status}&pageSize=${event.target.value}`
                );
              }}
            />
          </Paper>
          }
          </>
          
          
        )}

        {openNewCourse &&
          !loadingCourse && (
            <FormNewCourse
              open={openNewCourse}
              handleClickOpen={handleClickOpenNewCourse}
              handleClose={handleClickOpenNewCourse}
              isNew={true}
              handleBack={handleBack}
            />
          )}
          {openNewCourse &&
            loadingCourse && (
              <BackDrop status={true} />
          )}
        {/* { openNewCourse && openSchedule && 
        <>
          <ScheduleCourse 
          open={openNewCourse}
          // handleClickOpen={handleClickOpenNewCourse}
          // handleClose={handleClickSchedule}
          // isNew={true}
          handleCloseSchedule={handleClickSchedule}
          />
        </>

        } */}
      </div>
      <ToastContainer />
    </>
  );
}

export default CourseManager;
