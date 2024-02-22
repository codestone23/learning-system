import TextField from "@mui/material/TextField";
import LessonCourse from "./LessonCourse";
import { useState } from "react";
import AddIcon from "../icons/AddIcon";
import MultipleIcon from "../icons/MultipleIcon";

export default function CategoryCourse({ index, formik }) {
  // console.log(formik.values);
  const [selectTrainer] = useState(formik.values.courses_mentors || []);
  const lessons = [];
  // console.log(formik.values.update_courses_categories[index]);
  for (
    let i = 0;
    i < formik.values.update_courses_categories[index]?.lectures?.length;
    i++
  ) {
    lessons.push({ id: i });
  }
  const handleCreateLessonFormik = (indexLesson) => {
    formik.setFieldValue(
      `update_courses_categories[${index}].lectures[${indexLesson}]`,
      {
        lecture_id: "",
        category_id:
          formik.values.update_courses_categories[index]?.category_id || "",
        date: "",
        duration: "",
        topic: "",
        trainer_id: "",
      }
    );
  };
  if (lessons.length === 0) {
    handleCreateLessonFormik(0);
  }
  const [lessonCourses, setLessonCourses] = useState(
    lessons.length !== 0 ? lessons : [{ id: 0 }]
  );

  const handleAddIconClick = () => {
    handleCreateLessonFormik(lessonCourses.length);
    const newLessonCourses = [...lessonCourses, { id: lessonCourses.length }];
    setLessonCourses(newLessonCourses);
  };

  const handleMultipleIconClick = (i, id) => {
    // console.log({i,id});
    const newLessonCourses = lessonCourses.filter(
      (course, index) => index !== i
    );
    setLessonCourses(newLessonCourses);
    // const lecture_id = formik.values.update_courses_categories[index]?.lectures[i]?.lecture_id;
    // console.log(lecture_id);
    // console.log(formik.values.update_courses_categories[index]?.lectures);
    const multipleLesson = formik.values.update_courses_categories[
      index
    ]?.lectures.filter((lecture, index) => index !== i);
    formik.setFieldValue(
      `update_courses_categories[${index}].lectures`,
      multipleLesson
    );
  };

  return (
    <div>
      <div className="category__title--content">
        <TextField
          // autoFocus
          margin="dense"
          id="name_category"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Category Name"
          value={
            formik.values.update_courses_categories[index]?.category_name || ""
          }
          onChange={(e) => {
            formik.setFieldValue(
              `update_courses_categories[${index}].category_name`,
              e.target.value
            );
          }}
        />
        {/* <div
          className="form__course--lesson__plus"
          // onClick={}
        >
          <TrashIcon />
        </div> */}
      </div>

      {lessonCourses.map((course, i) => (
        <div key={i} className="form__course--lesson">
          <LessonCourse
            selectTrainer={selectTrainer}
            formik={formik}
            index={index}
            indexLesson={i}
            key={course.id}
          />
          <div className="form__course--lesson__icon">
            <div
              className="form__course--lesson__add"
              onClick={handleAddIconClick}
            >
              <AddIcon />
            </div>
            {lessonCourses.length > 1 && (
              <div
                className="form__course--lesson__plus"
                onClick={() => handleMultipleIconClick(i, course.id)}
              >
                <MultipleIcon />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="vertical-category"></div>
    </div>
  );
}
