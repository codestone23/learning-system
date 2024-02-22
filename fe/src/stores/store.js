import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import coursesSlice from "./slices/course";
import accountsSlice from "./slices/account";
import lecturesSlice from "./slices/lecture";
import rootSaga from "./sagas/index";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    accounts: accountsSlice,
    courses: coursesSlice,
    lectures: lecturesSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
