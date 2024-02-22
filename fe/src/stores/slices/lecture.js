import { createSlice } from "@reduxjs/toolkit";

const lectures = createSlice({
    name: "lectures",
    initialState:{
        lecture: null,
        loading: true
    },
    reducers: {
        getLectureById: (state, action) => {
            state.lecture = action.payload;
            state.loading = true;
        },
        getLectureByIdSuccess: (state, action) => {
            state.lecture = action.payload;
            state.loading = false;
        },
        getLectureByIdError: (state, action) => {
            state.lecture = action.payload;
            state.loading = false;
        },
    }
})

export const {
    getLectureById,
    getLectureByIdSuccess,
    getLectureByIdError
 } = lectures.actions
export default lectures.reducer