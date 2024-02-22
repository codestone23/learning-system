import "../assets/styles/root.css";
import "../assets/styles/login.css";
import "../assets/styles/resetPassword.css";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { notifySuccess } from "../components/notify/NotifySuccess";
import { notifyError } from "../components/notify/NotifyError";
import AuthService from "../services/auth.service";
import SuccessResetPassword from "../components/icons-login/SuccessResetPassword";

function ChangePassword() {
  const [searchParams] = useSearchParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChange, setIsChange] = useState(true);
  const passwordResetToken = localStorage.getItem("resetToken");
  const passwordResetExpires = localStorage.getItem("passwordResetExpires");
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  useEffect(() => {
    if (user) {
      console.log(user);
      const relRoles = user.roles.map((role) => role.name);
      if (relRoles.includes("Admin")) {
        navigate("/configuration/account");
      } else {
        navigate("/courses");
      }
    }
  });
  useEffect(() => {
    const verify = async () => {
      const passwordResetToken = localStorage.getItem("resetToken");
      const passwordResetExpires = localStorage.getItem("passwordResetExpires");
      const token = searchParams.get("token");
      if (!token || !passwordResetExpires || !passwordResetToken) {
        navigate("/login");
      }
      if (passwordResetToken) {
        if (
          token === passwordResetToken.split('"').join("") &&
          passwordResetExpires <= Date.now()
        ) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      }
    };
    verify();
  }, [searchParams, localStorage]);

  const formik = useFormik({
    initialValues: {
      password: "",
      re_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      re_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      AuthService.resetPassword(
        passwordResetToken,
        passwordResetExpires,
        values.password
      ).then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("resetToken");
          localStorage.removeItem("passwordResetExpires");
          notifySuccess(response.data.message);
          setIsChange(false);
        } else {
          notifyError(response.data.message);
        }
        return response.data;
      });
    },
  });
  return user ? null : (
    <>
      <div className="login login__change__password">
        <div className="login__left">
          <span className="pass__title-bg">
            Welcome to{" "}
            <span className="pass__title-sm pass__title-sm__change--pasword">
              BlueOC Internship Program
            </span>
          </span>
          <img
            className="login__img--password"
            src="/src/assets/images/new-password-avatar.jpg"
          />
        </div>
        <div className="login__right">
          {!isValidToken && (
            <div className="message-bg">
              <div className="send-token-message">
                {" "}
                Invalid or expired password reset token!
              </div>
            </div>
          )}
          {!isChange && <SuccessResetPassword />}
          {isValidToken && isChange && (
            <form
              onSubmit={formik.handleSubmit}
              className="login--form login--form__change--password"
            >
              <div className="login__content">
                <h2 className="form__title">Setup Your New Password</h2>
                <div className="login--input">
                  <label htmlFor="password" className="form__title__sm">
                    Password
                  </label>
                  <input
                    className="password"
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p>{formik.errors.password}</p>
                  )}
                </div>
                <div className="login--input">
                  <label htmlFor="re__password" className="form__title__sm">
                    RePassword
                  </label>
                  <input
                    className="re__password"
                    type="password"
                    name="re_password"
                    placeholder="Re-type your password here"
                    onChange={formik.handleChange}
                    value={formik.values.re_password}
                  />
                  {formik.errors.re_password && formik.touched.re_password && (
                    <p>{formik.errors.re_password}</p>
                  )}
                </div>
                <button className="submit__form" type="submit">
                  Save
                </button>
              </div>
            </form>
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
