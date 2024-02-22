import { useState, useEffect, useRef } from "react";
import "../assets/styles/accountManagement.css";
import { useFormik } from "formik";
import Select from "react-select";
import { notifySuccess } from "./notify/NotifySuccess";
import { notifyError } from "./notify/NotifyError";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createAccount, updateAccount } from "../services/account.service";
// import { v4 as uuidv4 } from 'uuid';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { GET_ALL_ACCOUNTS } from "../stores/types/account";

function CreateNewAccountModal({
  title,
  email,
  onDiscard,
  total,
  rowsPerPage,
}) {
  console.log(rowsPerPage);
  console.log(total);
  // const role = "Monitor";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roleOptions = [
    { value: 1, label: "Admin" },
    { value: 5, label: "Student" },
    { value: 4, label: "Trainer" },
    { value: 2, label: "Mentor" },
    { value: 3, label: "Monitor" },
  ];
  const data = useSelector((state) => state.accounts.account);
  const [isOpenAdditionalInfor, setOpenAdditionalInfor] = useState(false);
  const [account] = useState(title === "Edit Account" ? data.account : {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dropdownRef = useRef(null);
  const inputEmail = useRef(null);
  const monitors = useSelector((state) => state.accounts.monitors);

  const roles = [];

  if (account?.email) {
    for (let i = 0; i < account?.roles.length; i++) {
      roles.push({
        value: Number.parseInt(account.roles[i].role_id),
        label: account.roles[i].name,
      });
    }
  }
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = (isPasswordRequired) =>
    Yup.object({
      name: Yup.string().required("Required!"),
      email: Yup.string().email("Invalid email format").required("Required!"),
      phone: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "Too short")
        .max(10, "Too long"),
      role: Yup.array()
        .required("Required")
        .min(1, "At least one role is required"),
      ...(isPasswordRequired && {
        password: Yup.string()
          .min(8, "Minimum 8 characters")
          .required("Required!"),
        re_password: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required!"),
      }),
    });

  const formik = useFormik({
    initialValues: {
      name: account?.name || "",
      email: account?.email || "",
      phone: account?.phone_number || "",
      role: roles || null,
      password: "",
      re_password: "",
      gender: account?.gender || false,
      address: account?.user_detail?.address || "",
      birthday: account?.dob || null,
      start: account?.user_detail?.start_working_time || null,
      end: account?.user_detail?.end_working_time || null,
      grant: account?.user_detail?.grant || "",
      manager: account?.managed_by,
      hired_date: account?.user_detail?.hired_date || null,
    },
    validationSchema: validationSchema(title === "New Account"),
    onSubmit: (values) => {
      setLoading(true);
      if (title === "Edit Account") {
        (async () =>
          await updateAccount(email, values).then((response) => {
            console.log(response);
            if (response.status === 200) {
              notifySuccess(response.data.message);
              const pageNo = Math.floor(parseInt(total) / rowsPerPage);
              navigate(`.?pageNo=${pageNo}&pageSize=${rowsPerPage}`);
              handleClose();
            } else {
              notifyError("Server Error");
            }
            setLoading(false);
          }))();
      } else {
        (async () =>
          await createAccount(values).then((response) => {
            console.log(values);
            if (response.status === 200) {
              const pageNo = Math.floor(
                parseInt(total + 1) / parseInt(rowsPerPage)
              );
              navigate(`.?pageNo=${pageNo}&pageSize=${parseInt(rowsPerPage)}`);
              notifySuccess(response.data.message);

              handleClose();
            } else {
              if (response.status === 204) {
                setMessage("This email has already existed!");
                inputEmail.current.focus();
              } else {
                notifyError("Server error");
              }
              setLoading(false);
            }
          }))();
      }
    },
  });

  const handleClose = () => {
    onDiscard();
  };
  return (
    <form
      className={
        title === "New Account" || isOpenAdditionalInfor
          ? "create-new-account"
          : "create-new-account create-edit-account"
      }
      onSubmit={formik.handleSubmit}
    >
      <div className="create-new-account-modal" ref={dropdownRef}>
        <h2 className="create-new-account-modal-tilte">{title}</h2>
        <h3 className="create-new-account-modal-tilte-first">Account Info</h3>
        <div className="new-account-info-input">
          <label className="form-title-info-input">
            Fullname <span className="require-star">*</span>
          </label>
          <input
            className="form-input-new-account-info-field"
            type="text"
            name="name"
            placeholder="Fullname"
            defaultValue={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name && formik.touched.name && (
            <p>{formik.errors.name}</p>
          )}
        </div>
        <div className="new-account-info-input">
          <label className="form-title-info-input">
            Email <span className="require-star">*</span>
          </label>
          <input
            className={
              message !== ""
                ? "form-input-new-account-info-field-focus"
                : "form-input-new-account-info-field"
            }
            type="text"
            name="email"
            placeholder="Enter Email"
            defaultValue={formik.values.email}
            ref={inputEmail}
            onChange={(e) => {
              setMessage("");
              formik.setFieldValue("email", e.target.value);
            }}
            disabled={title === "Edit Account"}
          />
          {formik.errors.email && formik.touched.email && (
            <p>{formik.errors.email}</p>
          )}
          {/* {(!formik.errors.email || !formik.touched.email) && ( */}
          <p className="existed__email"> {message}</p>
          {/* )} */}
        </div>
        <div className="new-account-info-input">
          <label className="form-title-info-input">
            Phone Number <span className="require-star">*</span>
          </label>
          <input
            className="form-input-new-account-info-field"
            type="text"
            name="phone"
            placeholder="Phone Number"
            defaultValue={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.errors.phone && formik.touched.phone && (
            <p>{formik.errors.phone}</p>
          )}
        </div>
        <div className="new-account-info-input new-account-info-input__select--roles">
          <label className="form-title-info-input">
            Role <span className="require-star">*</span>
          </label>
          <Select
            className="form-input-new-account-info-field form-input-new-account-info-field-role"
            name="role"
            options={roleOptions}
            isMulti
            defaultValue={roles}
            onChange={(selectedOption) => {
              formik.setFieldValue("role", selectedOption);
            }}
          />
          {formik.errors.role && formik.touched.role && (
            <p>{formik.errors.role}</p>
          )}
        </div>
        {title === "New Account" && (
          <>
            <div className="new-account-info-input">
              <label className="form-title-info-input">
                Password <span className="require-star">*</span>
              </label>
              <input
                className="form-input-new-account-info-field"
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password && (
                <p>{formik.errors.password}</p>
              )}
            </div>
            <div className="new-account-info-input">
              <label className="form-title-info-input">
                Re-Password<span className="require-star">*</span>
              </label>
              <input
                className="form-input-new-account-info-field"
                type="password"
                name="re_password"
                placeholder="Re-Password"
                value={formik.values.re_password}
                onChange={formik.handleChange}
              />
              {formik.errors.re_password && formik.touched.re_password && (
                <p>{formik.errors.re_password}</p>
              )}
            </div>
          </>
        )}

        <div>
          <h3
            className="create-new-account-modal-tilte-first"
            onClick={() => setOpenAdditionalInfor(!isOpenAdditionalInfor)}
          >
            Additional Info
            {isOpenAdditionalInfor && (
              <span className="create-new-account-info-icon-down">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                >
                  <path
                    d="M7.06 4.94L4 1.88667L0.94 4.94L-2.38419e-07 4L4 2.39591e-06L8 4L7.06 4.94Z"
                    fill="black"
                  />
                </svg>
              </span>
            )}
            {!isOpenAdditionalInfor && (
              <span className="create-new-account-info-icon-down">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                >
                  <path
                    d="M0.94 0L4 3.05333L7.06 0L8 0.94L4 4.94L0 0.94L0.94 0Z"
                    fill="black"
                  />
                </svg>
              </span>
            )}
          </h3>
        </div>

        <div
          className={
            isOpenAdditionalInfor
              ? "addtional-infor-show"
              : "additional-info-unshow"
          }
        >
          <div className="new-account-info-input">
            <label className="form-title-info-input">Gender</label>

            <select
              className="form-input-new-account-info-field"
              name="gender"
              id="gneder"
              defaultValue={formik.values.gender}
              onChange={formik.handleChange}
            >
              <option
                className="select_manager_option"
                value={true}
                //selected={formik.values.gender}
              >
                Male
              </option>
              <option
                className="select_manager_option"
                value={false}
                //selected={!formik.values.gender}
              >
                Female
              </option>
            </select>
          </div>
          <div className="new-account-info-input">
            <label className="form-title-info-input">Address</label>
            <input
              className="form-input-new-account-info-field"
              type="text"
              name="address"
              placeholder="Address"
              defaultValue={formik.values.address}
              onChange={formik.handleChange}
            />
          </div>

          <div className="new-account-info-input">
            <label className="form-title-info-input">Birthday</label>
            <input
              className="form-input-new-account-info-field"
              type="date"
              name="birthday"
              defaultValue={formik.values.birthday}
              onChange={formik.handleChange}
            />
          </div>

          <div className="new-account-info-input">
            <label className="form-title-info-input">Start working time</label>
            <input
              className="form-input-new-account-info-field"
              type="time"
              name="start"
              placeholder="9:00AM"
              defaultValue={formik.values.start}
              onChange={formik.handleChange}
            />
          </div>

          <div className="new-account-info-input">
            <label className="form-title-info-input">End working time</label>
            <input
              className="form-input-new-account-info-field"
              type="time"
              name="end"
              placeholder="17:30PM"
              defaultValue={formik.values.end}
              onChange={formik.handleChange}
            />
          </div>

          <div className="new-account-info-input">
            <label className="form-title-info-input">Grant</label>
            <input
              className="form-input-new-account-info-field"
              type="text"
              name="grant"
              placeholder="Member"
              defaultValue={formik.values.grant}
              onChange={formik.handleChange}
            />
          </div>

          <div className="new-account-info-input">
            <label className="form-title-info-input">Manager</label>
            {monitors.length > 0 && (
              <select
                className="form-input-new-account-info-field"
                name="manager"
                id="manager"
                defaultValue={formik.values.manager}
                onChange={formik.handleChange}
              >
                {monitors.map((monitor, index) => (
                  <option
                    className="select_manager_option"
                    key={index}
                    value={monitor?.account_id}
                    //selected={monitor?.account_id === formik.values.manager}
                  >
                    {monitor?.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="new-account-info-input">
            <label className="form-title-info-input">Hired date</label>
            <input
              className="form-input-new-account-info-field"
              type="date"
              name="hired_date"
              defaultValue={formik.values.hired_date}
              onChange={formik.handleChange}
            />
          </div>
        </div>
        <div className="new-account-form-account-buttons">
          <button className="button-discard-confirm-box" onClick={handleClose}>
            Discard
          </button>
          {!loading && (
            <button className="button-create-new-account-modal" type="submit">
              Create
            </button>
          )}
          {loading && (
            <button
              disabled
              className="button-create-new-account-modal button-create-new-account-modal__loading"
              type="submit"
            >
              <Box sx={{ display: "flex" }}>
                <CircularProgress color="inherit" size={20} thickness={4} />
              </Box>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
export default CreateNewAccountModal;
