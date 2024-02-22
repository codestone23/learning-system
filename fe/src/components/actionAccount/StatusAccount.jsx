import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DisableAccountIcon from "../icons/DisableAccount";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { updateAccountStatus } from "../../services/account.service";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import { useDispatch } from "react-redux";
import { UPDATE_ACCOUNT_STATUS } from "../../stores/types/account";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function StatusAccount({ status, email, onHandleStatus, open }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClose = () => {
    onHandleStatus();
  };
  const handleSubmit = () => {
    setLoading(true);
    (async () =>
      await updateAccountStatus(email).then((response) => {
        if (response.status === 200) {
          dispatch({
            type: UPDATE_ACCOUNT_STATUS,
            account: response.data.account,
          });
          notifySuccess(response.data.message);
        } else {
          notifyError(response.data.message);
        }
        onHandleStatus();
      }))();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <span className="icon-disable">{status && <DisableAccountIcon />}</span>
        {status ? "Disable Account" : "Enable Account"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {status
            ? "Are you sure to disable " + email + " account?"
            : "Are you sure to enable " + email + " account?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHandleStatus} style={{ color: "black" }}>
          {status ? "Discard" : "Close"}
        </Button>
        {!loading && (
          <Button
            onClick={handleSubmit}
            autoFocus
            style={{ backgroundColor: status ? "red" : "blue", color: "white" }}
          >
            {status ? "Yes. Disable it" : "Yes. Enable it"}
          </Button>
        )}
        {loading && (
          <Button
            onClick={handleSubmit}
            autoFocus
            style={{
              backgroundColor: status ? "red" : "blue",
              color: "white",
              width: "124px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <CircularProgress color="inherit" size={25} thickness={4} />
            </Box>
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
