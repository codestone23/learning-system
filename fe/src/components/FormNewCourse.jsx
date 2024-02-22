import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MultiSelectStudent from "./actionCourse/MultiSelectStudent";
import { useSelector } from "react-redux";
import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import ScheduleCourse from "./actionCourse/ScheduleCourse";
// import { v4 as uuidv4 } from "uuid";
import Slide from "@mui/material/Slide";
import { createOrUpdateCourse } from "../services/admin.service";
import { notifySuccess } from "./notify/NotifySuccess";
import { notifyError } from "./notify/NotifyError";
import CircularProgress from "@mui/material/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
const nameTechnologys = [
  "React",
  "HTML",
  "CSS",
  "Javascript",
  "Nodejs",
  "Vite",
  "Express",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FormNewCourse({
  open,
  handleClose,
  isNew,
  handleBack,
}) {
  const courseSaga = useSelector((state) => state.courses.course);
  const monitors = useSelector((state) => state.accounts.monitors);
  const [loading, setLoading] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [course] = useState(courseSaga);
  const theme = useTheme();
  const [technologyName] = React.useState([]);
  const selected_tech = [];
  for (let i = 0; i < course?.technology?.length; i++) {
    selected_tech.push(course?.technology[i].name);
  }
  // console.log(selected_tech);
  const selectIdStudents = [];
  for (let i = 0; i < course?.courses_students?.length; i++) {
    selectIdStudents.push({
      id: course?.courses_students[i].student_id,
      name: course?.courses_students[i].accounts.name,
    });
  }
  const handleCloseForm = () => {
    handleClose();
  };
  const formik = useFormik({
    initialValues: {
      course_id: course?.course_id || null,
      account_managed: course?.account_managed || null,
      courses_categories: course?.courses_categories || [],
      update_courses_categories: course?.courses_categories || [],
      courses_mentors: course?.courses_mentors || [],
      courses_students: selectIdStudents || [],
      created_at: course?.created_at || Date.now(),
      created_by: course?.created_by || "",
      fee: course?.fee || "",
      from_date: course?.from_date || null,
      to_date: course?.to_date || null,
      managed_by: course?.managed_by || "",
      name: course?.name || "",
      summary: course?.summary || "",
      technology: selected_tech || [],
      training_form: course?.training_form || "",
      training_location: course?.training_location || "",
      updated_at: Date.now(),
      updated_by: course?.updated_by || "",
      is_create: isNew ? true : false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required!"),
      training_form: Yup.string().required("Required!"),
      managed_by: Yup.string().required("Required!"),
      summary: Yup.string()
        .min(20, "Minimum 20 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      (async () =>
        await createOrUpdateCourse(values).then((response) => {
          console.log(values);
          if (response.status === 200) {
            console.log(response);
            notifySuccess(response.data.message);
            handleCloseForm();
          } else {
            notifyError("Server error");
            setLoading(false);
          }
          setLoading(false);
        }))();
      handleBack();
    },
  });
  const handleClickSchedule = () => {
    setOpenSchedule(!openSchedule);
  };
  const handleCloseSchedule = () => {
    formik.setFieldValue(
      "update_courses_categories",
      formik.values.courses_categories
    );
    setOpenSchedule(!openSchedule);
  };
  const handleUpdateSchedule = () => {
    formik.setFieldValue(
      "courses_categories",
      formik.values.update_courses_categories
    );
    setOpenSchedule(!openSchedule);
  };
  const relCount = formik.values.courses_categories?.reduce(
    (total, category) => total + category.lectures?.length,
    0
  );
  // console.log(formik.values);
  const [countLesson] = useState(relCount || 0);
  const handleChangeFormik = (query, value) => {
    formik.setFieldValue(query, value);
  };
  return (
    <>
      <div className="form__course-left">
        <Dialog
          className={
            openSchedule ? "form__course-left__out" : "form__course-left__in"
          }
          open={open}
          onClose={handleClose}
          fullWidth={true}
          TransitionComponent={Transition}
          keepMounted
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <DialogTitle>{isNew ? "New Course" : "Edit Course"}</DialogTitle>
          <DialogContent className="form__new-course-content">
            <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Course Name</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <TextField
                className="input_course"
                fullWidth={true}
                placeholder="Enter Course Name"
                autoFocus
                margin="dense"
                id="name"
                type="text"
                variant="outlined"
                defaultValue={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="error error--name">{formik.errors.name}</p>
              )}
            </div>
            <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Training Form</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <Select
                className="input_course"
                sx={{ minWidth: "100%" }}
                labelId="demo-select-small-label"
                id="training_form"
                value={formik.values.training_form || ""}
                onChange={(e) => {
                  formik.setFieldValue("training_form", e.target.value);
                }}
                // onBlur={formik.handleBlur}
                // error={formik.touched.training_form && Boolean(formik.errors.training_form)}
                // helpertext={formik.touched.training_form && formik.errors.training_form}
              >
                <MenuItem value={""}>Choose Training Form</MenuItem>
                <MenuItem value={"In Office"}>In Office</MenuItem>
                <MenuItem value={"Remote"}>Remote</MenuItem>
              </Select>
              {formik.errors.training_form && formik.touched.training_form && (
                <p className="error">{formik.errors.training_form}</p>
              )}
            </div>

            <DialogContentText>
              <span className="form__new-course-title">Training Location</span>
            </DialogContentText>
            <TextField
              className="input_course"
              fullWidth={true}
              autoFocus
              margin="dense"
              placeholder="Enter Training Location"
              id="training_location"
              type="text"
              variant="outlined"
              defaultValue={formik.values.training_location}
              onChange={formik.handleChange}
            />
            <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Manager</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <Select
                className="input_course"
                sx={{ minWidth: "100%" }}
                labelId="demo-select-small-label"
                id="managed_by"
                value={formik.values?.managed_by || ""}
                // defaultValue={""}
                onChange={(e) => {
                  formik.setFieldValue("managed_by", e.target.value);
                }}
              >
                <MenuItem value={""} key={0}>
                  <em>Choose Manager</em>
                </MenuItem>
                {monitors.map((monitor, i) => {
                  return (
                    <MenuItem value={monitor.account_id} key={i + 1}>
                      {monitor.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {formik.errors.managed_by && formik.touched.managed_by && (
                <p className="error">{formik.errors.managed_by}</p>
              )}
            </div>

            <DialogContentText>
              <span className="form__new-course-title">Technology</span>
            </DialogContentText>
            <Select
              className="input_course"
              sx={{ minWidth: "100%" }}
              labelId="demo-multiple-chip-label"
              id="technology"
              multiple
              value={formik.values.technology || ""}
              onChange={(e) => {
                // console.log(e.target.value);
                formik.setFieldValue("technology", e.target.value);
              }}
              input={<OutlinedInput id="select-multiple-chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value, index) => (
                    <Chip key={index} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {nameTechnologys.map((name, index) => (
                <MenuItem
                  key={index}
                  value={name}
                  style={getStyles(name, technologyName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
            <DialogContentText>
              <span className="form__new-course-title">From Date</span>
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  id="from_date"
                  // format="DD/MM/YYYY"
                  defaultValue={dayjs(formik.values.from_date)}
                  onChange={(value) => {
                    formik.setFieldValue(
                      "from_date",
                      value?.format("YYYY-MM-DD")
                    );
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <DialogContentText>
              <span className="form__new-course-title">To Date</span>
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  id="to_date"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(formik.values.to_date)}
                  onChange={(value) => {
                    formik.setFieldValue(
                      "to_date",
                      value?.format("YYYY-MM-DD")
                    );
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <DialogContentText>
              <span className="form__new-course-title">Fee</span>
            </DialogContentText>
            <TextField
              className="input_course"
              fullWidth={true}
              autoFocus
              margin="dense"
              placeholder="Enter Fee"
              id="fee"
              type="text"
              variant="outlined"
              defaultValue={formik.values.fee}
              onChange={formik.handleChange}
            />
            <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Summary</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <TextField
                className="input_course"
                fullWidth={true}
                rows={5}
                placeholder="Write Discription for Course"
                multiline
                margin="dense"
                id="summary"
                type="text"
                variant="outlined"
                defaultValue={formik.values.summary}
                onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // error={formik.touched.summary && Boolean(formik.errors.summary)}
                // helpertext={formik.touched.summary && formik.errors.summary}
              />
              {formik.errors.summary && formik.touched.summary && (
                <p className="error error--summary">{formik.errors.summary}</p>
              )}
            </div>

            <DialogContentText>
              <span className="form__new-course-title">Students</span>
            </DialogContentText>
            <MultiSelectStudent
              courses_students={course?.courses_students}
              formik={formik}
            />
          </DialogContent>
          <div className="form__new__course-btn">
            <div className="setup__schedule">
              <Button
                className="setup__schedule--btn"
                style={{ backgroundColor: "blue", color: "white" }}
                onClick={handleClickSchedule}
              >
                {isNew ? "Setup " : "Update "}Schedule
              </Button>
              <div className="setup__schedule--info">
                <span>
                  Category:{formik.values.courses_categories?.length || 0} -
                  Lesson:{countLesson}
                </span>
              </div>
            </div>
            {/* <div className="setup__schedule setup__schedule--right">
            <Button
              className="setup__schedule--btn"
              style={{ backgroundColor: "blue", color: "white" }}
              // onClick={handleClickSchedule}
            >
              Assign Mentor
            </Button>
          </div> */}
          </div>

          <DialogActions>
            <Button onClick={handleClose}>Discard</Button>
            {!loading && (
              <Button
                style={{ backgroundColor: "blue", color: "white" }}
                type="submit"
              >
                {isNew ? "Create" : "Update"}
              </Button>
            )}

            {loading && (
              <Button
                type="submit"
                autoFocus
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  width: "71px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <CircularProgress color="inherit" size={25} thickness={4} />
                </Box>
              </Button>
            )}
          </DialogActions>
        </Dialog>
        {openSchedule && (
          <>
            <ScheduleCourse
              open={openSchedule}
              // handleClickOpen={handleClickOpenNewCourse}
              // handleClose={handleClickSchedule}
              isNew={isNew}
              formik={formik}
              handleCloseSchedule={handleCloseSchedule}
              handleUpdateSchedule={handleUpdateSchedule}
              handleChangeFormik={handleChangeFormik}
            />
          </>
        )}
      </div>
    </>
  );
}

function getStyles(name, technologyName, theme) {
  return {
    fontWeight:
      technologyName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
