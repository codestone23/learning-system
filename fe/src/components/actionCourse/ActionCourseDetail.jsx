import { useRef, useEffect, useReducer } from "react";
import DotVertical from "../icons/DotVertical";
import "/src/assets/styles/tableCourse.css";
import { useNavigate } from "react-router-dom";
import EditLecture from "../actionLecture/EditLecture";
import StartLecture from "../actionLecture/StartLecture";
import ChangeStatusLecture from "../actionLecture/ChangeStatusLecture";
import NextSession from "../actionLecture/NextSession";
import { useDispatch, useSelector } from "react-redux";
import { GET_LECTURE_BY_ID }  from  "../../stores/types/lecture";

const ActionTypes = {
  TOGGLE_ACTION: "TOGGLE_ACTION",
  TOGGLE_ACTION_CLOSE: "TOGGLE_ACTION_CLOSE",
  TOGGLE_EDIT: "TOGGLE_EDIT",
  TOGGLE_EDIT_CLOSE: "TOGGLE_EDIT_CLOSE",
  TOGGLE_NEXT_SESSION: "TOGGLE_NEXT_SESSION",
  TOGGLE_START_LECTURE: "TOGGLE_START_LECTURE",
  TOGGLE_CANCEL_LECTURE: "TOGGLE_CANCEL_LECTURE",
  TOGGLE_FINISH_LECTURE: "TOGGLE_FINISH_LECTURE",
  TOGGLE_DELETE_LECTURE: "TOGGLE_DELETE_LECTURE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_ACTION:
      return { ...state, openAction: !state.openAction };
    case ActionTypes.TOGGLE_ACTION_CLOSE:
      return { ...state, openAction: false };
    case ActionTypes.TOGGLE_EDIT:
      return { ...state, isEdit: !state.isEdit };
    case ActionTypes.TOGGLE_EDIT_CLOSE:
      return { ...state, isEdit: false };
    case ActionTypes.TOGGLE_NEXT_SESSION:
      return { ...state, isCheckNextLesson: !state.isCheckNextLesson };
    case ActionTypes.TOGGLE_START_LECTURE:
      return { ...state, isStartLecture: !state.isStartLecture };
    case ActionTypes.TOGGLE_CANCEL_LECTURE:
      return { ...state, isCancelLecture: !state.isCancelLecture };
    case ActionTypes.TOGGLE_FINISH_LECTURE:
      return { ...state, isFinishLecture: !state.isFinishLecture };
    case ActionTypes.TOGGLE_DELETE_LECTURE:
      return { ...state, isDeleteLecture: !state.isDeleteLecture };
    default:
      return state;
  }
};

export default function ActionCourseDetail({lecture_id}) {
  const dispatchSaga = useDispatch();
  const loading = useSelector((state) => state.lectures.loading);
  const [state, dispatch] = useReducer(reducer, {
    openAction: false,
    isAddDocument: false,
    isEdit: false,
    isCheckNextLesson: false,
    isStartLecture: false,
    isCancelLecture: false,
    isFinishLecture: false,
    isDeleteLecture: false,
  });
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
  const handleOpenAction = () => {
    dispatch({ type: ActionTypes.TOGGLE_ACTION });
  };
  const handleOpenEdit = () => {
    dispatch({ type: ActionTypes.TOGGLE_EDIT });
  };
  const handleOpenNextSession = () => {
    dispatch({ type: ActionTypes.TOGGLE_NEXT_SESSION });
  };
  const handleOpenStart = () => {
    dispatch({ type: ActionTypes.TOGGLE_START_LECTURE });
  };
  const handleOpenCancel = () => {
    dispatch({ type: ActionTypes.TOGGLE_CANCEL_LECTURE });
  };
  const handleOpenFinish = () => {
    dispatch({ type: ActionTypes.TOGGLE_FINISH_LECTURE });
  };
  const handleOpenDelete = () => {
    dispatch({ type: ActionTypes.TOGGLE_DELETE_LECTURE });
  };
  const handleGetLecture = () => {
    dispatchSaga({ type: GET_LECTURE_BY_ID, payload: lecture_id });
    navigate("/courses/lecture");
    
  };

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
                onClick={handleGetLecture}
              >
                <img src="/src/assets/images/view.png" />
                <span className="action-name">View</span>
              </div>
            </dl>
            <dl 
            // onClick={}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/edit.png" />
                <span className="action-name">Add Document</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenEdit}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/edit-course.png" />
                <span className="action-name">Edit</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenNextSession}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/add_homework.png" />
                <span className="action-name">Check Next session</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenStart}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/add_reminder.png" />
                <span className="action-name">Start Class</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenCancel}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/cancel.png" />
                <span className="action-name">Cancel Class</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenFinish}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/change-pass.png" />
                <span className="action-name">Finish Class</span>
              </div>
            </dl>
            <dl 
            onClick={handleOpenDelete}
            >
              <div className="dropdown-list-actions-item">
                <img src="/src/assets/images/deactive.png" />
                <span className="action-name">Delete Class</span>
              </div>
            </dl>
          </div>
          
        </>
      )}
      {state.isEdit && (
        <>
          <EditLecture
            onHandleClose={handleOpenEdit}
            open={state.isEdit}
          />
        </>
      )}
      {state.isStartLecture && (
        <>
          <StartLecture
            onHandleClose={handleOpenStart}
            open={state.isStartLecture}
          />
        </>
      )}
      {state.isCancelLecture && (
        <>
          <ChangeStatusLecture
            status={4}
            onHandleClose={handleOpenCancel}
            open={state.isCancelLecture}
          />
        </>
      )}
      {state.isFinishLecture && (
        <>
          <ChangeStatusLecture
            status={1}
            onHandleClose={handleOpenFinish}
            open={state.isFinishLecture}
          />
        </>
      )}
      {state.isCheckNextLesson && (
        <>
          <NextSession
            onHandleClose={handleOpenNextSession}
            open={state.isCheckNextLesson}
          />
        </>
      )}
      {state.isDeleteLecture && (
        <>
          <ChangeStatusLecture
            status={5}
            onHandleClose={handleOpenDelete}
            open={state.isDeleteLecture}
          />
        </>
      )}
    </div>
  );
}
