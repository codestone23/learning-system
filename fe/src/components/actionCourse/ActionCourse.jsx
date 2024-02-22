import { useRef, useEffect, useReducer } from "react";
import DotVertical from "../icons/DotVertical";
import "/src/assets/styles/tableCourse.css";
import { useNavigate } from "react-router-dom";
import FormNewCourse from "../FormNewCourse";
// import ScheduleCourse from '../actionCourse/ScheduleCourse';
import AddReminderCourse from "./AddReminderCourse";
import StartCourse from "./StartCourse";
import CancelCourse from "./CancelCourse";
import FinishCourse from "./FinishCourse";
import { useDispatch, useSelector } from "react-redux";
import { GET_COURSE_BY_ID } from "../../stores/types/course";
import BackDrop from "../backdrop/BackDrop";
import {
  GET_ACCOUNTS_BY_ROLE_MONITOR,
  GET_ACCOUNTS_BY_ROLE_STUDENT,
  GET_MENTORS_BY_COURSE_ID,
  GET_STUDENTS_BY_COURSE_ID,
  GET_ACCOUNTS_BY_ROLE_MENTOR,
} from "../../stores/types/account";
import AssignNewMentor from "./AssignNewMentor";
import AssignNewStudent from "./AssignNewStudent";

const ActionTypes = {
  TOGGLE_ACTION: "TOGGLE_ACTION",
  TOGGLE_EDIT: "TOGGLE_EDIT",
  TOGGLE_EDIT_CLOSE: "TOGGLE_EDIT_CLOSE",
  TOGGLE_SCHEDULE: "TOGGLE_SCHEDULE",
  TOGGLE_ADD_REMINDER: "TOGGLE_ADD_REMINDER",
  TOGGLE_START_COURSE: "TOGGLE_START_COURSE",
  TOGGLE_CANCEL_COURSE: "TOGGLE_CANCEL_COURSE",
  TOGGLE_FINISH_COURSE: "TOGGLE_FINISH_COURSE",
  TOGGLE_ASSIGN_STUDENT: "TOGGLE_ASSIGN_STUDENT",
  TOGGLE_ASSIGN_TRAINER: "TOGGLE_ASSIGN_TRAINER",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_ACTION:
      return { ...state, openAction: !state.openAction };
    case ActionTypes.TOGGLE_ACTION_CLOSE:
      return { ...state, openAction: false };
    case ActionTypes.TOGGLE_EDIT:
      return { ...state, isOpenEdit: !state.isOpenEdit };
    case ActionTypes.TOGGLE_EDIT_CLOSE:
      return { ...state, isOpenEdit: false };
    case ActionTypes.TOGGLE_SCHEDULE:
      return { ...state, openSchedule: !state.openSchedule };
    case ActionTypes.TOGGLE_ADD_REMINDER:
      return { ...state, openAddReminder: !state.openAddReminder };
    case ActionTypes.TOGGLE_START_COURSE:
      return { ...state, isStartCourse: !state.isStartCourse };
    case ActionTypes.TOGGLE_CANCEL_COURSE:
      return { ...state, isCancelCourse: !state.isCancelCourse };
    case ActionTypes.TOGGLE_FINISH_COURSE:
      return { ...state, isFinishCourse: !state.isFinishCourse };
    case ActionTypes.TOGGLE_ASSIGN_STUDENT:
      return { ...state, isAssignStudent: !state.isAssignStudent };
    case ActionTypes.TOGGLE_ASSIGN_TRAINER:
      return { ...state, isAssignTrainer: !state.isAssignTrainer };
    default:
      return state;
  }
};

export default function ActionCourse({ status, course_id }) {
  const [state, dispatch] = useReducer(reducer, {
    openAction: false,
    isOpenEdit: false,
    openSchedule: false,
    openAddReminder: false,
    isStartCourse: false,
    isCancelCourse: false,
    isFinishCourse: false,
    isAssignStudent: false,
    isAssignTrainer: false,
  });
  const dispatchAction = useDispatch();
  const mentors = useSelector((state) => state.accounts.mentors);
  const loading = useSelector((state) => state.accounts.loading);
  const loadingCourse = useSelector((state) => state.courses.loadingCourse);
  const mentorsByCourseId = useSelector(
    (state) => state.accounts.mentorsByCourseId
  );
  const studentsByCourseId = useSelector(
    (state) => state.accounts.studentsByCourseId
  );

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch({ type: ActionTypes.TOGGLE_ACTION_CLOSE });
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const navigate = useNavigate();

  const handleClickOpenAssignStudent = () => {
    dispatch({ type: ActionTypes.TOGGLE_ASSIGN_STUDENT });
    dispatchAction({ type: GET_STUDENTS_BY_COURSE_ID, payload: course_id });
  };
  const handleClickOpenAssignTrainer = () => {
    dispatch({ type: ActionTypes.TOGGLE_ASSIGN_TRAINER });
    dispatchAction({ type: GET_MENTORS_BY_COURSE_ID, payload: course_id });
    dispatchAction({ type: GET_ACCOUNTS_BY_ROLE_MENTOR, payload: "Mentor" });
  };
  const handleOpenEdit = () => {
    dispatchAction({ type: GET_COURSE_BY_ID, payload: course_id });
    dispatchAction({ type: GET_ACCOUNTS_BY_ROLE_MONITOR, payload: "Monitor" });
    dispatchAction({ type: GET_ACCOUNTS_BY_ROLE_STUDENT, payload: "Student" });
    dispatch({ type: ActionTypes.TOGGLE_EDIT });
  };
  const handleOpenEditClose = () => {
    dispatchAction({ type: GET_COURSE_BY_ID, payload: 0 });
    dispatch({ type: ActionTypes.TOGGLE_EDIT });
  };
  const handleStartCourse = () => {
    dispatch({ type: ActionTypes.TOGGLE_START_COURSE });
  };
  const handleCancelCourse = () => {
    dispatch({ type: ActionTypes.TOGGLE_CANCEL_COURSE });
  };
  const handleFinishCourse = () => {
    dispatch({ type: ActionTypes.TOGGLE_FINISH_COURSE });
  };
  const handleClickSchedule = () => {
    dispatch({ type: ActionTypes.TOGGLE_SCHEDULE });
  };
  const handleAddReminder = () => {
    dispatch({ type: ActionTypes.TOGGLE_ADD_REMINDER });
  };
  const handleOpenAction = () => {
    // dispatchCourse({ type: GET_COURSE_BY_ID, payload: course_id});
    dispatch({ type: ActionTypes.TOGGLE_ACTION });
  };
  const handleOpenViewCourse = () => {
    dispatchAction({ type: GET_COURSE_BY_ID, payload: course_id });
    navigate("/courses/detail");
  }

  return (
    <div ref={dropdownRef} className="course__action">
      <div className="course__action--main" onClick={handleOpenAction}>
        <DotVertical />
      </div>
      {state.openAction && (
        <>
          <div className="dropdown-list-actions-account-table">
            <dl
            //   onClick={}
            >
              <div
                className="dropdown-list-actions-item"
                onClick={handleOpenViewCourse}
              >
                <img src="/src/assets/images/view.png" />
                <span className="action-name">View</span>
              </div>
            </dl>
            {status !== 4 && (
              <>
                <dl onClick={handleClickOpenAssignStudent}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/change-pass.png" />
                    <span className="action-name">Register</span>
                  </div>
                </dl>
                <dl onClick={handleClickOpenAssignTrainer}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/deactive.png" />
                    <span className="action-name">Add Mentor</span>
                  </div>
                </dl>
                <dl onClick={handleAddReminder}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/add_reminder.png" />
                    <span className="action-name">Add Reminder</span>
                  </div>
                </dl>
              </>
            )}

            <dl onClick={handleOpenEdit}>
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/edit-course.png" />
                <span className="action-name">Edit</span>
              </div>
            </dl>
            {status === 1 && (
              <>
                <dl onClick={handleStartCourse}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/cancel.png" />
                    <span className="action-name">Start</span>
                  </div>
                </dl>
              </>
            )}
            {status === 2 && (
              <>
                <dl onClick={handleFinishCourse}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/cancel.png" />
                    <span className="action-name">Finish</span>
                  </div>
                </dl>
              </>
            )}
            {(status === 1 || status === 2) && (
              <>
                <dl onClick={handleCancelCourse}>
                  <div className="dropdown-list-actions-item">
                    <img src="/src/assets/images/edit.png" />
                    <span className="action-name">Cancel</span>
                  </div>
                </dl>
              </>
            )}
          </div>
        </>
      )}
      {state.isOpenEdit && !loadingCourse && (  
        <FormNewCourse
          open={state.isOpenEdit}
          handleClose={handleOpenEditClose}
          isNew={false}
          handleClickSchedule={handleClickSchedule}
          openSchedule={state.openSchedule}
        />
      )}
      {state.isOpenEdit && loadingCourse && (
        <BackDrop status={true} />
      )}
      {/* { state.isOpenEdit && state.openSchedule && 
      <>
        <ScheduleCourse 
        open={state.isOpenEdit}
        handleCloseSchedule={handleClickSchedule}
        />
      </>
        
      } */}
      {state.openAddReminder && (
        <>
          <AddReminderCourse
            open={state.openAddReminder}
            handleClose={handleAddReminder}
          />
        </>
      )}
      {state.isStartCourse && (
        <>
          <StartCourse
            status={status}
            onHandleCourse={handleStartCourse}
            open={state.isStartCourse}
            course_id={course_id}
          />
        </>
      )}
      {state.isCancelCourse && (
        <>
          <CancelCourse
            status={status}
            onHandleCourse={handleCancelCourse}
            open={state.isCancelCourse}
            course_id={course_id}
          />
        </>
      )}
      {state.isFinishCourse && (
        <>
          <FinishCourse
            status={status}
            onHandleCourse={handleFinishCourse}
            open={state.isFinishCourse}
            course_id={course_id}
          />
        </>
      )}
      {state.isAssignStudent && (
        <>
          {loading && <BackDrop status={true} />}
          {!loading && studentsByCourseId && (
            <AssignNewStudent
              handleClose={handleClickOpenAssignStudent}
              open={state.isAssignStudent}
              data={studentsByCourseId}
              course_id={course_id}
            />
          )}
        </>
      )}
      {state.isAssignTrainer && (
        <>
          {loading && <BackDrop status={true} />}
          {!loading && mentorsByCourseId && (
            <AssignNewMentor
              handleClose={handleClickOpenAssignTrainer}
              open={state.isAssignTrainer}
              data={mentorsByCourseId}
              mentors={mentors}
              course_id={course_id}
            />
          )}
        </>
      )}
    </div>
  );
}
