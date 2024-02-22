import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AuthService from "../services/auth.service";
// import { useNavigate } from 'react-router-dom';
import "../assets/styles/common.css";
const Layout = () => {
  // const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  // let relRoles;
  // if(user){
  //   relRoles = user.roles.map(role => role.name);
  // }
  // console.log(user);
  // let isAllowed = !!user && relRoles.includes('Admin');
  // console.log(isAllowed);
  // React.useEffect(() => {
  //   const verify = async () => {    
  //     if (!isAllowed) {
  //       navigate("/login");
  //     }
  //   };
  //   verify();
  // },[localStorage]);

  return (
    <>
      <div className="header-container">
        <Header user={user || null} />
        <div className="sidebar-container">
          <Sidebar user={user || null} />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
