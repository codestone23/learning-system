/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../assets/styles/root.css";
import "../assets/styles/common.css";
import { NavLink } from "react-router-dom";
import AccountIcon from "./icons-sidebar/AccountIcon";
import AllCourseIcon from "./icons-sidebar/AllCourseIcon";
import AppSettingsIcon from "./icons-sidebar/AppSettingsIcon";
import ConfigurationIcon from "./icons-sidebar/ConfigurationIcon";
import CourseIcon from "./icons-sidebar/CourseIcon";
import DocumentIcon from "./icons-sidebar/DocumentIcon";
import JoiningCourseIcon from "./icons-sidebar/JoiningCourseIcon";
import PendingCourseIcon from "./icons-sidebar/PendingCourseIcon";
import ScheduleIcon from "./icons-sidebar/ScheduleIcon";
import TMS from "./icons-sidebar/TMSIcon";
import { useState } from "react";

const ROUTES = () => [
  {
    index: 1,
    feat: "Courses",
    iconTitle: <CourseIcon />,
    role: ["Admin","Student","Mentor","Monitor","Trainer"],
    subTitle: [
      {
        path: "/courses",
        desc: "All Courses",
        icon: <AllCourseIcon />,
        role: ["Admin","Student","Mentor","Monitor","Trainer"],
      },

      {
        path: "/training-courses",
        desc: "Training Courses",
        icon: <ConfigurationIcon />,
        role: ["Trainer","Mentor","Monitor"],
      },
      {
        path: "/joining-courses",
        desc: "Joining Courses",
        icon: <JoiningCourseIcon />,
        role: ["Student"],
      },
      {
        path: "pending-courses",
        desc: "Pending Courses",
        icon: <PendingCourseIcon />,
        role: ["Trainer","Mentor","Monitor"],
      },
    ],
  },
  {
    index: 2,
    feat: "Students",
    iconTitle: <CourseIcon />,
    path: "/students",
    role: ["Admin"],
  },
  {
    index: 3,
    feat: "Your Schedule",
    iconTitle: <ScheduleIcon />,
    path: "/schedules",
    role: ["Admin","Mentor","Trainer","Monitor"],
  },
  {
    index: 4,
    feat: "Documents",
    iconTitle: <DocumentIcon />,
    path: "/documents",
    role: ["Mentor","Trainer","Monitor","Student"],
  },
  {
    index: 5,
    feat: "Report",
    iconTitle: <AllCourseIcon />,
    path: "/report",
    role: ["Admin","Trainer"],
  },
  {
    index: 6,
    feat: "Configuration",
    iconTitle: <ConfigurationIcon />,
    role: ["Admin"],
    subTitle: [
      {
        path: "/application-settings",
        desc: "Application Settings",
        icon: <AppSettingsIcon />,
        role: ["Admin"],
      },

      {
        path: "/configuration/account",
        desc: "Account",
        icon: <AccountIcon />,
        role: ["Admin"],
      },
    ],
  },
];
function LinkItem({ route, relRoles }) {
  const [isOpen, setIsOpen] = useState(false);
  const isUserAuthorized = route.role.some((allowedRole) =>
      relRoles.includes(allowedRole)
      );

  // Render the route only if the user is authorized
  if (!isUserAuthorized) {
    return null;
  } 
  if (route.subTitle) {
    return (
      <>
        <div className="sidebar-title" onClick={() => setIsOpen(!isOpen)}>
          <div className={isOpen ? "sidebar-item-open" : "sidebar-item"}>
            <div className="feat_icon">{route.iconTitle}</div>
            <span className="subject">{route.feat}</span>
          </div>
        </div>

        {route.subTitle.map((child, i) => {
          const isChildAuthorized = child.role.some((allowedRole) =>
            relRoles.includes(allowedRole)
          );

          return isChildAuthorized ? (
          <div key={i} className={isOpen ? "sublink-open" : "sublink-close"}>
            <NavLink
              to={child.path}
              className={({ isActive }) =>
                `${isActive ? "active_link" : "inactive_link"}`
              }
            >
              <div className="feat_icon">{child.icon}</div>
              <span className="subject">{child.desc}</span>
            </NavLink>
          </div>
        ) : null
        })
      }
      </>
    );
  } else {
    return (
      <div className="sidebar-title">
        <NavLink
          to={route.path}
          className={({ isActive }) =>
            `${isActive ? "sidebar-item-open" : "sidebar-item"}`
          }
        >
          <div className="feat_icon">{route.iconTitle}</div>
          <span className="subject">{route.feat}</span>
        </NavLink>
      </div>
    );
  }
}
function Sidebar({user}) {
  let relRoles;
  if (user) {
    relRoles = user.roles.map((role) => role.name);
  }
  // console.log(relRoles);
  return !user ? null : (
    <nav className="sidebar" tabIndex={-1}>
      <div className="timesheet">
        <TMS />
        <div className="title">
          <div className="t-name">TMS</div>
          <div className="t-type">Training Management</div>
        </div>
      </div>
      <div className="menu">
        {ROUTES().map((route) => (
          <LinkItem 
            key={route.index} 
            route={route} 
            relRoles={relRoles || []} 
            />
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
