/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import "../assets/styles/root.css";
import "../assets/styles/schedule.css";
import { getYourSchedule } from "../services/lecture.service";
import {
  // getAllMondayOfYear,
  // getCurrentYear,
  getMondayOfWeek,
} from "../utils/dayUtils";
import dayjs from "dayjs";
import Schedule from "../components/Schedule";
import { useDispatch, useSelector } from "react-redux";
import BackDrop from "../components/backdrop/BackDrop";
import { GET_STUDENT_DETAIL } from "../stores/types/account";


function YourSchedule() {
  //const current_year = getCurrentYear();
  const dispatch = useDispatch();
  const current_week = getMondayOfWeek(Date());
  const end = dayjs(current_week).add(6, "day");
  // const mondays = getAllMondayOfYear(current_year);
  const [lectures, setLectures] = useState([]);
  const account = useSelector((state) => state.accounts.account);
  const loading = useSelector((state) => state.accounts.loading);
  const email = JSON.parse(localStorage.getItem("user")).email;
  useEffect(() => {
    console.log("abc");
    const fetchData = async () => {
      try {
        const response = await getYourSchedule(current_week, end);
        const lecture = response.data.lectures;
        console.log(lecture);
        const schedule = [];
        for (let i = 0; i < lecture.length; i++) {
          const date = lecture[i].date.split("-");
          console.log(date);
          const startTime = lecture[i].start_time.split(":");
          const endTime = lecture[i].end_time.split(":");
          const start = new Date(
            date[0],
            date[1] - 1,
            date[2],
            startTime[0],
            startTime[1]
          );
          const end = new Date(
            date[0],
            date[1] - 1,
            date[2],
            endTime[0],
            endTime[1]
          );
          schedule.push({
            title: lecture[i].topic,
            id: lecture[i].lecture_id,
            startDate: start,
            endDate: end,
            mentor: lecture[i].accounts.avatar,
            manager:
              lecture[i].courses_categories.courses.account_managed.avatar,
          });
        }

        setLectures(schedule);
        console.log(schedule);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    const findAccountDetail = () => {
      dispatch({ type: GET_STUDENT_DETAIL, payload: email });
    };
    findAccountDetail();
    fetchData();
  }, []);
  console.log(email);
  console.log(account);
  return loading ? (
    <BackDrop status={true}/>
  ) : (
    <>
      <div className="page-header">
        <div className="breadcrumb">Calender / Meeting Schedule</div>
        <div>
          <div className="student__information-title">Student Information</div>
          <div className="student__information">
            <div className="student__information--avatar">
              <div className="student__information--avatar__img">
                <img className="student__information--image" src={account?.avatar || "src/assets/images/user_null.png"} alt="" />
              </div>
              <div className="student__information--name">{account?.name}</div>
            </div>
            <div className="student__information--body">
              <div className="student__information--body__header">
                <div className="student__information--big__title">Account Information</div>
                <div className="student__information--content">
                  <div className="student__information--content__left">
                    <div className="student__information--context">
                      <span className="student__information--context__title">Email: </span>
                      <span className="student__information--context__description">{account?.email}</span>
                    </div>
                    <div className="student__information--context">
                      <span className="student__information--context__title">Role: </span>
                      <span  className="student__information--context__description">Student</span>
                    </div>
                  </div>
                  <div className="student__information--context student__information--content__right">
                    <span className="student__information--context__title">Phone: </span>
                    <span className="student__information--context__description">{account?.phone_number}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="student__information--big__title">
                  Student Information
                </div>
                <div className="student__information--content">
                  <div className="student__information--content__left">
                    <div className="student__information--context">
                      <span className="student__information--context__title">Sex: </span>
                      <span className="student__information--context__description">{account?.gender ? "Male" : "Female"}</span>
                    </div>
                    <div className="student__information--context">
                      <span className="student__information--context__title">DOB: </span>
                      <span className="student__information--context__description">{account?.dob}</span>
                    </div>
                    <div className="student__information--context">
                      <span className="student__information--context__title">School: </span>
                      <span className="student__information--context__description">{account?.user_detail?.education_information?.University}</span>
                    </div>
                    <div className="student__information--context">
                      <span className="student__information--context__title">Major: </span>
                      <span className="student__information--context__description">{account?.user_detail?.education_information?.Majors}</span>
                    </div>
                  </div>
                  <div className="student__information--course student__information--content__right">
                    <div className="student__information--course__title student__information--context__title">Finished Courses:</div>
                    <div className="student__information--course__content">
                      <div className="student__information--courses">
                        {account?.courses_students?.map((course,index)=>{
                          return (
                            <div key={index}>
                              {course?.courses?.name}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content-title">
          <div className="title-account">Meeting Schedule</div>
        </div>
        <div className="action">
          <div className="form-search-account">
            <select className="select-courses-shedule">
              <option value="all">All Course</option>
            </select>

            <button className="button-today">Today</button>
          </div>
        </div>
        <div className="account-info-table account__schedule">
          <Schedule data={lectures} />
        </div>
      </div>
    </>
  );
}

export default YourSchedule;
