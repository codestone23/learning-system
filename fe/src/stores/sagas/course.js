import { put, call,takeLatest  } from "redux-saga/effects";
import {
    getAllCoursesSuccess,
    getAllCoursesError,
    getTotalCoursesSuccess,
    getTotalCourses,
    getTotalCoursesError,
    getCourseByIdError,
    getCourseById,
    getCourseByIdSuccess ,
    updateCourseStatusSuccess
} from "../slices/course";
import { GET_ALL_COURSES,GET_TOTAL_COURSES, GET_COURSE_BY_ID, UPDATE_COURSE_STATUS } from "../types/course";
import { findCourseByNameAndStatus, findCourseById } from "../../services/admin.service";

export function* getAllCoursesSaga(query) {
  try {
    const response = yield call(
        findCourseByNameAndStatus,
      query.payload
    );
    // console.log(query);
    if (response.status === 200) {
      yield put(getAllCoursesSuccess(response.data.courses));
    }
    // console.log(response.data);
  } catch (error) {
    yield put(getAllCoursesError(error));
    console.log("error");
  }
}

export function* getTotalCoursesSaga(query) {
  yield put(getTotalCourses());
  try {
    const response = yield call(findCourseByNameAndStatus,query.payload);
    // console.log(query);
    if (response.status === 200) {
      yield put(getTotalCoursesSuccess(response.data.total));
    }
    // console.log(response.data);
  } catch (error) {
    yield put(getTotalCoursesError(error));
    console.log("error");
  }
}

export function* getCourseByIdSage(query) {
  yield put(getCourseById());
  try {
    const response = yield call(findCourseById,query.payload);
    // console.log(query);
    if (response.status === 200) {
      yield put(getCourseByIdSuccess(response.data));
    }
  
    // console.log(response.data);
  } catch (error) {
    yield put(getCourseByIdError(error));
    console.log("error");
  }
}
export function* onUpdateCourseStatus(payload) {
  yield put(updateCourseStatusSuccess({ course: payload.course }));
  // console.log(payload.course);
}

export function* watchCoursesAsync() {
    yield takeLatest(GET_ALL_COURSES, getAllCoursesSaga)
    yield takeLatest(GET_TOTAL_COURSES, getTotalCoursesSaga)
    yield takeLatest(GET_COURSE_BY_ID, getCourseByIdSage)
    yield takeLatest(UPDATE_COURSE_STATUS, onUpdateCourseStatus)
    
}
