import { createSlice } from "@reduxjs/toolkit";

const courses = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        course: null,
        total: 0,
        loading: true,
        loadingCourse: true
    },
    reducers: {
        getAllCourses: (state, action) => {
            state.courses = action.payload;
            state.loading = true;
        },
        getAllCoursesSuccess: (state, action) => {
            state.courses = action.payload;
            state.loading = false;
        },
        getAllCoursesError: (state, action) => {
            state.courses = action.payload;
            state.loading = false;
        },
        getTotalCourses: (state, action) => {
            state.total = action.payload;
            state.loading = true;
        },
        getTotalCoursesSuccess: (state, action) => {
            state.total = action.payload;
            state.loading = false;
        },
        getTotalCoursesError: (state, action) => {
            state.total = action.payload;
            state.loading = false;
        },
        getCourseById: (state, action) => {
            state.course = action.payload;
            state.loadingCourse = true;
        },
        getCourseByIdSuccess: (state, action) => {
            state.course = action.payload;
            state.loadingCourse = false;
        },
        getCourseByIdError: (state, action) => {
            state.course = action.payload;
            state.loadingCourse = false;
        },
        updateCourseStatusSuccess: (state, course) => {
            state.courses = state.courses.map((i) =>
              i.course_id === course.payload.course.course_id ? course.payload.course : i
            );
            state.loading = false;
        },
    }
});

export const { getAllCourses,
    getAllCoursesSuccess,
    getAllCoursesError,
    getTotalCourses,
    getTotalCoursesSuccess,
    getTotalCoursesError,
    getCourseById,
    getCourseByIdSuccess,
    getCourseByIdError,
    updateCourseStatusSuccess
 } = courses.actions
export default courses.reducer