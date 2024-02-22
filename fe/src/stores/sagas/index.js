import { all } from "redux-saga/effects";
import { watchAccountsAsync } from "./account";
import { watchCoursesAsync } from "./course";
import { watchLecturesAsync } from "./lecture";

export default function* rootSaga() {
  yield all([watchAccountsAsync(), watchCoursesAsync(), watchLecturesAsync()]);
}
