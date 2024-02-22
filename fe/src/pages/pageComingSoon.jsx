import "../assets/styles/root.css";
import "../assets/styles/pageComingSoon.css";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import AuthService from "../services/auth.service";

function PageComingSoon({ title }) {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const intervalRef = useRef(null);
  // let relRoles;
  // if (user) {
  //   relRoles = user.roles.map((role) => role.name);
  // }
  let isAllowed = !!user;
  useEffect(() => {
    const verify = async () => {
      if (!isAllowed) {
        navigate("/login");
      }
    };
    verify();
  }, [localStorage]);
  useEffect(() => {
    const initializeCountdown = () => {
      const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        mon = day * 30;

      let today = new Date(),
        dd = String(today.getDate()).padStart(2, "0"),
        mm = String(today.getMonth() + 1).padStart(2, "0"),
        yyyy = today.getFullYear(),
        nextYear = yyyy + 1,
        dayMonth = "02/01/",
        deadline = dayMonth + yyyy;

      today = mm + "/" + dd + "/" + yyyy;
      if (today > deadline) {
        deadline = dayMonth + nextYear;
      }
      const countDown = new Date(deadline).getTime();
      intervalRef.current = setInterval(function () {
        const now = new Date().getTime(),
          distance = countDown - now;
        let months = Math.floor(distance / mon) || "1";
        let days = Math.floor((distance % mon) / day) || "";
        let hours = Math.floor((distance % day) / hour) || "";
        let ms = Math.floor((distance % hour) / minute) || "";
        let ss = Math.floor((distance % minute) / second) || "";
        (document.getElementById("months").innerText = months),
          (document.getElementById("days").innerText = days),
          (document.getElementById("hours").innerText = hours),
          (document.getElementById("minutes").innerText = ms),
          (document.getElementById("seconds").innerText = ss);
      }, 100);
    };
    initializeCountdown();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">{title}</div>

        <div className="main-content-title">
          <div className="title-account">Page Coming Soon</div>
        </div>
      </div>

      <div className="account-info-table">
        <div className="page__coming">
          <div className="page__coming-left">
            <div className="page__coming-left__body">
              <h1 className="page__coming-left__title">Page</h1>
              <h1 className="page__coming-left__title">Coming Soon</h1>
              <p className="page__coming-left__content">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
              <div>
                <button className="page__coming-left__button">
                  <svg
                    className="page__coming-left__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6.68004 1.94462L4.95888 0.184616C2.07021 2.43692 0.168506 5.90769 0 9.84615H2.40722C2.58776 6.58462 4.22467 3.72923 6.68004 1.94462ZM21.5928 9.84615H24C23.8195 5.90769 21.9178 2.43692 19.0411 0.184616L17.332 1.94462C19.7633 3.72923 21.4122 6.58462 21.5928 9.84615ZM19.2217 10.4615C19.2217 6.68308 17.2477 3.52 13.8054 2.68308V1.84615C13.8054 0.824615 12.999 0 12 0C11.001 0 10.1946 0.824615 10.1946 1.84615V2.68308C6.74022 3.52 4.77834 6.67077 4.77834 10.4615V16.6154L2.37111 19.0769V20.3077H21.6289V19.0769L19.2217 16.6154V10.4615ZM12 24C12.1685 24 12.325 23.9877 12.4814 23.9508C13.2638 23.7785 13.9017 23.2369 14.2146 22.4985C14.335 22.2031 14.3952 21.8831 14.3952 21.5385H9.58074C9.59278 22.8923 10.664 24 12 24Z"
                      fill="white"
                    />
                  </svg>
                  <div className="page__coming-left__button-name">
                    Get Notify
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="vertical-line"></div>
          <div className="page__coming-right container">
            <div id="countdown">
              <ul>
                <li>
                  <span id="months"></span> <span>MON</span>
                </li>
                <li>
                  <span id="days"></span>
                  <span>DAY</span>
                </li>
                <li>
                  <span id="hours"></span>
                  <span>HRS</span>
                </li>
                <li>
                  <span id="minutes"></span>
                  <span>MIN</span>
                </li>
                <li>
                  <span id="seconds"></span>
                  <span>SEC</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageComingSoon;
