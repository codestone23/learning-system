import "../assets/styles/root.css";
import "../assets/styles/login.css";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { notifySuccess } from "../components/notify/NotifySuccess";
import { notifyError } from "../components/notify/NotifyError";
import BackDrop from "../components/backdrop/BackDrop";

function Login() {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };
  useEffect(() => {
    if (user) {
      // console.log(user);
      const relRoles = user.roles.map((role) => role.name);
      if (relRoles.includes("Admin")) {
        navigate("/configuration/account");
      } else {
        navigate("/courses");
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      AuthService.login(values.email, values.password).then((response) => {
        console.log(response.data);
        let relRoles = [];
        if (response.data.accessToken) {
          handleOpenBackdrop();
          localStorage.setItem(
            "accessToken",
            JSON.stringify(response.data.accessToken)
          );
          localStorage.setItem("user", JSON.stringify(response.data.user));
          relRoles = response.data.user.roles.map((role) => role.name);
        }
        console.log(response.data.user);

        // console.log(relRoles);
        if (response.data.user) {
          notifySuccess(response.data.message);
          if (relRoles.includes("Admin")) {
            navigate("/configuration/account");
          } else {
            navigate("/courses");
          }
        } else {
          notifyError(response.data.message);
        }
        return response.data;
      });
    },
  });

  return user ? null : (
    <>
      <div className="login login__sign--in">
        <div className="login__left">
          <span className="pass__title-bg">
            Welcome to{" "}
            <span className="pass__title-sm pass__title-sm__login">
              BlueOC Internship Program
            </span>
          </span>
          <img
            className="login__img"
            src="/src/assets/images/avatar-login.png"
          />
        </div>
        <div className="login__right">
          <form className="login--form" onSubmit={formik.handleSubmit}>
            <div className="login__content">
              <h2 className="form__title">Sign in</h2>
              <div className="login--input">
                <label htmlFor="email" className="form__title__sm">
                  Email
                </label>
                <input
                  className="email"
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && formik.touched.email && (
                  <p>{formik.errors.email}</p>
                )}
              </div>
              <div className="login--input">
                <label htmlFor="password" className="form__title__sm">
                  Password
                </label>
                <input
                  className="password"
                  type="password"
                  name="password"
                  autoComplete="on"
                  placeholder="Enter your password here"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.errors.password && formik.touched.password && (
                  <p>{formik.errors.password}</p>
                )}
              </div>
              <ToastContainer />
              <div className="login__forgot--password login__forgot--password--link">
                <Link to="/forgot-password"> Forgot password?</Link>
              </div>
              <button
                className="submit__form submit__form--login"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <BackDrop status={openBackdrop} />
    </>
  );
}

export default Login;
