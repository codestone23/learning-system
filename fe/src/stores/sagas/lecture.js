import { put, call,takeLatest  } from "redux-saga/effects";
import {
    getLectureByIdSuccess, getLectureByIdError,getLectureById
} from "../slices/lecture";
import { GET_LECTURE_BY_ID } from "../types/lecture";
import { findLectureById } from "../../services/admin.service";

export function* getLectureByIdSaga(query) {
  yield put(getLectureById());
    try {
      const response = yield call(findLectureById,query.payload);
      // console.log(query);
      if (response.status === 200) {
        yield put(getLectureByIdSuccess(response.data));
      }
      console.log(response.data);
    } catch (error) {
      yield put(getLectureByIdError(error));
      console.log("error");
    }
}

export function* watchLecturesAsync() {
    yield takeLatest(GET_LECTURE_BY_ID, getLectureByIdSaga)
}