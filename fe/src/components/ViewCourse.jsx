import VerticalDot from "../components/icons/VerticalDot";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useState } from "react";
import '../assets/styles/tableCourse.css'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BackDrop from "./backdrop/BackDrop";

export default function ViewCourse(){
    const [openActionCourse, setActionCourseOpen] = useState(false);
    const lecture = useSelector((state) => state.lectures.lecture);
    const loading = useSelector((state) => state.lectures.loading);

    return loading ? (
        <>
         <BackDrop status={true}/>
        </>
      ) :(
        <>
        <div className="page-header">
        <div className="breadcrumb">Courses / 
        <Link to="/courses" style={{color: "#6b778c"}}>
            <span> All courses </span>
        </Link>/ {lecture.courses_categories.courses.name}</div>

        <div className="main-content-title">
          <div className="title-course">{lecture.topic}</div>
          <button className="button-more">
            <div onClick={() => setActionCourseOpen(!openActionCourse)}>
                <VerticalDot />
            </div>
            { openActionCourse && (
                    <>
                      <div className= "dropdown-list-actions-account-table">
                        <dl
                        //   onClick={}
                        >
                          <div className="dropdown-list-actions-item">
                            <img src="/src/assets/images/view.png" />
                            <span className="action-name">Edit</span>
                          </div>
                        </dl>
                        <dl
                        //   onClick={}
                        >
                          <div className="dropdown-list-actions-item">
                          <img src="/src/assets/images/deactive.png" />
                          <span className="action-name">Add Document</span>
                          </div>
                        </dl>
                        <dl 
                        // onClick={}
                        >
                          <div className="dropdown-list-actions-item">
                          <img src="/src/assets/images/edit-course.png" />
                          <span className="action-name">Add Attendance</span>
                          </div>
                          
                        </dl>
                        <dl 
                        // onClick={}
                        >
                          <div className="dropdown-list-actions-item">
                          <img src="/src/assets/images/add_homework.png" />
                          <span className="action-name">Add Homework</span>
                          </div>
                          
                        </dl>
                        <dl 
                        // onClick={}
                        >
                          <div className="dropdown-list-actions-item">
                          <img src="/src/assets/images/cancel.png" />
                          <span className="action-name">Cancel</span>
                          </div>
                          
                        </dl>
                      </div>
                    </>
                    )
            }
          </button>
        </div>
        <div className="view__course">
          <div className="view__course-category">Category: {lecture.courses_categories.category_name}</div>
          <div className="view__course-status">Status: <div style={{background : getStatusColor(lecture.status)}} className="view__course-status-title">
            <span>{getStatusText(lecture.status)}</span>
            </div></div>
          <div className="view__course-discription">
            <span className="view__course-discription-title">Description</span>
            <div className="view__course-discription-content">{lecture.description}</div>
          </div>
          <div className="view__course-discription">
            <span className="view__course-discription-title">Documents</span>
            <div className="view__course-discription-content">
                <span>Slide: </span>
                <a href="https://www.canva.com/design/DAFjncdQ_2Q/M-ziqd_GRQo64ajeTFjZ3Q/edit">HTML/CSS Basic slide</a>
            </div>
            <div>
                <span className="view__course-discription-content">References: </span>
                <ul>
                    <li><a href="https://www.w3schools.com/django/">W3School: html basic</a></li>
                    <li><a href="https://viblo.asia/p/html-bai-1-lam-the-nao-de-tao-ra-mot-trang-web-RnB5pAEbKPG">Viblo: Làm thế nào để tạo 1 trang web</a></li>
                </ul>
            </div>
            <div>
                <span className="view__course-discription-content">Video Record: </span>
                <a href="#">React advanced guide 2</a>
            </div>
          </div>

        </div>
        <div className="view__course-discription">
            <span className="view__course-discription-title">Attendance: </span>
            <div className="view__course-discription-content view__course-discription-people">
                <div>
                <span>Present</span>
                <div className="view__course-people__avatar">
                    <AvatarGroup max={5}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                        <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                    </AvatarGroup>
                </div>
                
            </div>
            <div>
                <span>Absent</span>
                <div className="view__course-people__avatar">
                    <AvatarGroup max={5}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                    </AvatarGroup>
                </div>
                
            </div>
            </div>
            
        </div>
        <div className="view__course-discription">
            <span className="view__course-discription-title view__course-discription-title__bottom">Homework:</span>
            <div className="view__course-discription-content">
                <span>Deadline: <span>20-10-2023</span></span>
                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
                <div className="view__course--submit">
                    <div>
                        Submitted: <span className="view__course--submit__quantity">10</span>
                    </div>
                    <div>
                        Un-submitted: <span className="view__course--submit__quantity">5</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
    )
}

function getStatusText(value) {
  switch (value) {
    case "0":
      return "DONE";
    case "1":
      return "NEXT LESSON";
    case "2":
      return "PENDING";
    case "3":
      return "CANCELLED";
      case "4":
          return "DELETED";
          
    default:
      return "-";
  }
}

function getStatusColor(value) {
  switch (value) {
       case "0":
          return "#00D084";
      case "1":
          return "#F66438";
      case "2":
          return "#9337BE";
      case "3":
          return "#FF0000";
      case "4":
          return "#4E567A";
      default:
          return "#000000";
  }
}