import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CategoryCourse from "./CategoryCourse";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

export default function ScheduleCourse({
  open,
  formik,
  handleCloseSchedule,
  handleUpdateSchedule,
}) {
  const coursesCategories = formik.values.update_courses_categories || [];
  const categoryCourse = [];
  for (let i = 0; i < coursesCategories.length; i++) {
    categoryCourse.push(i);
  }
  const categories = categoryCourse || [0];
  const handleAddCategory = () => {
    CreateCategoryFormik(categories.length);
  };
  const CreateCategoryFormik = (index) => {
    formik.setFieldValue(`update_courses_categories[${index}]`, {
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
      >
        <DialogTitle>Add course schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>Multiple Category for course</DialogContentText>
          {categories.map((category, index) => (
            <CategoryCourse key={index} index={index} formik={formik} />
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
          <Button
            onClick={handleUpdateSchedule}
            style={{ backgroundColor: "blue", color: "white" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
