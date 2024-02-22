import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CategoryCourseDetail from "./CategoryCourseDetail";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateSchedule } from "../../services/admin.service";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { GET_COURSE_BY_ID } from "../../stores/types/course";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

export default function ScheduleCourseDetail({
  open,
  course,
  handleCloseSchedule,
}) {
    const [loading,setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
          course_id: course?.course_id || null,
          courses_categories: course?.courses_categories || [],
          courses_mentors: course?.courses_mentors || [],
        },
        validationSchema: Yup.object().shape({
            courses_categories: Yup.array()
              .of(
                Yup.object().shape({
                  category_name: Yup.string().min(4, 'too short').required('Required'),
                  lectures: Yup.array()
                  .of(
                    Yup.object().shape({
                      topic: Yup.string().min(4, 'too short').required('Required'),
                      duration: Yup.string().min(3, 'cmon').required('Required'), 
                      date: Yup.string().min(3, 'cmon').required('Required'), 
                      trainer_id: Yup.string().required('Required'),
                    })
                  )
                  .required('Must have lecture') 
                })
              )
              .required('Must have category') 
          }),
        onSubmit: (values) => {
            console.log(values);
          setLoading(true);
          (async () =>
            await updateSchedule(values).then((response) => {
              console.log(values);
              if (response.status === 200) {
                console.log(response);
                notifySuccess(response.data.message);
                dispatch({ type: GET_COURSE_BY_ID, payload: course.course_id });
                handleCloseSchedule();
              } else {
                notifyError("Server error");
                setLoading(false); 
              }
              setLoading(false);
            }))();

        },
    });
  const coursesCategories = formik.values.courses_categories || [];
  const categoryCourse = [];
  for (let i = 0; i < coursesCategories.length; i++) {
    categoryCourse.push(i);
  }
  const categories = categoryCourse || [0];
  const handleAddCategory = () => {
    CreateCategoryFormik(categories.length);
  };
  const CreateCategoryFormik = (index) => {
    formik.setFieldValue(`courses_categories[${index}]`, {
      category_id: "",
      course_id: formik.values.course_id,
      category_name: "",
      lectures: [
        {
          lecture_id: "",
          category_id: "",
          date: "",
          duration: "",
          topic: "",
          trainer_id: "",
        },
      ],
    });
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseSchedule}
        fullWidth={true}
        maxWidth={"md"}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <DialogTitle>Add course schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>Multiple Category for course</DialogContentText>
          {categories.map((category, index) => (
            <CategoryCourseDetail key={index} index={index} formik={formik} />
          ))}
        </DialogContent>
        <div className="setup__schedule">
          <Button
            className="setup__schedule--btn"
            style={{ backgroundColor: "blue", color: "white" }}
            onClick={handleAddCategory}
          >
            New Category
          </Button>
        </div>
        <DialogActions>
          <Button onClick={handleCloseSchedule}>Discard</Button>
          {!loading && (
              <Button
                style={{ backgroundColor: "blue", color: "white" }}
                type="submit"
              >
                Save
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
    </React.Fragment>
  );
}
