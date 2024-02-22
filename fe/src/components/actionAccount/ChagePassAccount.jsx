import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Fragment } from "react";
//import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateAccountPassword } from "../../services/account.service";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState } from "react";

export default function ChangePassAccount({ email, onHandleStatus, open }) {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    onHandleStatus();
  };

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
      setLoading(true);
      (async () =>
        await updateAccountPassword(email, values.password).then((response) => {
          if (response.status === 200) {
            notifySuccess(response.data.message);
          } else {
            notifyError(response.data.message);
          }
          handleClose();
        }))();
    },
  });
  return (
    <Fragment>
      <Dialog fullWidth={true} maxwidth="sm" open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Change Password</DialogTitle>

          <DialogContent>
            <DialogContentText>Additional Info</DialogContentText>
            {/* <TextField
              fullWidth={true}
              maxwidth="sm"
              margin="dense"
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            /> */}
            {/* {formik.errors.password && formik.touched.password && (
              <p>{formik.errors.password}</p>
            )} */}
            {/* <TextField
              fullWidth={tru
              maxwidth="sm"
              margin="dense"
              id="re-password"
              label="RePassword"
              type="password"
              variant="outlined"
              onChange={formik.handleChange}
              defaultValue={formik.values.re_password}
              onBlur={formik.handleBlur}
              error={
                formik.touched.re_password && Boolean(formik.errors.re_password)
              }
              helperText={
                formik.touched.re_password && formik.errors.re_password
              }
            /> */}
            {/* {formik.errors.re_password && formik.touched.re_password && (
              <p>{formik.errors.re_password}</p>
            )} */}
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
                <p className="validate-error-message">
                  {formik.errors.password}
                </p>
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
                <p className="validate-error-message">
                  {formik.errors.re_password}
                </p>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Discard</Button>
            {!loading && (
              <Button
                style={{ backgroundColor: "blue", color: "white" }}
                type="submit"
              >
                Save
              </Button>
            )}

            {loading && (
              <Button
                type="submit"
                autoFocus
                style={{
                  backgroundColor: status ? "red" : "blue",
                  color: "white",
                  width: "64px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <CircularProgress color="inherit" size={25} thickness={4} />
                </Box>
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
