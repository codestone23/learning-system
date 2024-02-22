import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

export default function LessonCourse({ formik, index, indexLesson }) {
  const course = useSelector((state) => state.courses.course);
  const mentors = useSelector((state) => state.accounts.accountsByRoles);
  // console.log(formik.values);
  // console.log(mentors);
  // const [mentorId] = useState(formik.values.update_courses_categories[index]?.lectures[indexLesson]?.trainer_id || "");
  // console.log(mentorId);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            id="from_date"
            format="DD/MM/YYYY"
            defaultValue={
              dayjs(
                formik.values.update_courses_categories[index]?.lectures[
                  indexLesson
                ]?.date
              ) || ""
            }
            onChange={(value) => {
              formik.setFieldValue(
                `update_courses_categories[${index}].lectures[${indexLesson}].date`,
                value?.format("YYYY-MM-DD")
              );
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      <Select
        className="input_course"
        sx={{ minWidth: "12%" }}
        labelId="demo-select-small-label"
        id="demo-select-small"
        defaultValue={
          formik.values.update_courses_categories[index]?.lectures[indexLesson]
            ?.duration || "0"
        }
        onChange={(e) => {
          formik.setFieldValue(
            `update_courses_categories[${index}].lectures[${indexLesson}].duration`,
            e.target.value
          );
        }}
      >
        {" "}
        <MenuItem value="0">
          <em>Duration</em>
        </MenuItem>
        <MenuItem value={"30 mins"}>30 mins</MenuItem>
        <MenuItem value={"1 hour"}>1 hour</MenuItem>
        <MenuItem value={"2 hour"}>2 hour</MenuItem>
        <MenuItem value={"3 hour"}>3 hour</MenuItem>
      </Select>
      <TextField
        sx={{ maxWidth: "25%" }}
        margin="dense"
        id="name-lesson"
        type="text"
        fullWidth
        variant="outlined"
        placeholder="Lesson Name"
        defaultValue={
          formik.values.update_courses_categories[index]?.lectures[indexLesson]
            ?.topic
        }
        onChange={(e) => {
          formik.setFieldValue(
            `update_courses_categories[${index}].lectures[${indexLesson}].topic`,
            e.target.value
          );
        }}
      />
      <Select
        className="input_course"
        sx={{ minWidth: "20%" }}
        labelId="demo-select-small-label"
        id="demo-select-small"
        defaultValue={
          formik.values.update_courses_categories[index]?.lectures[indexLesson]
            ?.trainer_id || "0"
        }
        onChange={(e) => {
          formik.setFieldValue(
            `update_courses_categories[${index}].lectures[${indexLesson}].trainer_id`,
            e.target.value
          );
        }}
        placeholder="Trainer"
      >
        <MenuItem value="0">
          <em>Select Trainer</em>
        </MenuItem>
        {!formik.values.is_create &&
          course?.courses_mentors?.map((mentor, i) => (
            <MenuItem key={i} value={mentor.mentor_id}>
              {mentor.accounts.name}
            </MenuItem>
          ))}
        {formik.values.is_create &&
          mentors.map((mentor, i) => (
            <MenuItem key={i} value={mentor.account_id}>
              {mentor.name}
            </MenuItem>
          ))}
      </Select>
    </>
  );
}
