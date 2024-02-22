import "../assets/styles/root.css";
import "../assets/styles/common.css";
import { Link,useNavigate } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import LogoutIcon from "./icons/LogoutIcon";
import ProfileIcon from "./icons/ProfileIcon";
import SettingIcon from "./icons/SettingIcon";
import Notification from "./icons/Notification";
import Configuration from "./icons/Configuration";
import MenuIcon from "./icons/MenuIcon";
function Header(user) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // console.log(isOpen);
  };
  const navigate = useNavigate();
  const handleLogout =  () => {
    localStorage.removeItem("resetToken");
    localStorage.removeItem("token");
    localStorage.removeItem("passwordResetExpires");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return !user.user ? null : (
    <header className="header" ref={dropdownRef}>
      <MenuIcon />
      <div className="site_name">BLUEOC SOFTWARE</div>
      <Notification />
      <Configuration />
      <SettingIcon />
      <div className={isOpen ? "avatar-container-isClick" : "avatar-container"}>
        <img
          className="avatar"
          onClick={toggleDropdown}
          src={
              user.user?.avatar || "/src/assets/images/user_null.png"
          }
          alt="Avatar"
        />
      </div>
      {isOpen && (
        <dl className="dropdown">
          <dt className="dropdown_item">
            <Link to="/profile" onClick={toggleDropdown} className="dropdown_item-link">
              <div className="dropdown_item-content">
                <ProfileIcon />
                <span>Profile</span>
              </div>
            </Link>
          </dt>
          <dt className="dropdown_item">
            {/* <Link to="/login" className="dropdown_item-link">
              <div className="dropdown_item-content">
                <LogoutIcon />
                <span>Logout</span>
              </div>
            </Link> */}
            <div onClick={handleLogout} className="dropdown_item-link">
              <div className="dropdown_item-content">
                <LogoutIcon />
                <span>Logout</span>
              </div>
            </div>
          </dt>
        </dl>
      )}
    </header>
  );
}
export default Header;
