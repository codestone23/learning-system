import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DisableAccountIcon from "../icons/DisableAccount";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimePicker: {
    width: "160px",
  },
  iconReminder: {
    position: "relative",
    top: "4px",
  },
}));

export default function AddReminderCourse({ open, handleClose }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>
          <span className={classes.iconReminder}>
            <DisableAccountIcon />
          </span>
          Add reminder
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Add reminder to the class</DialogContentText>
          <DialogContentText>Message</DialogContentText>
          <TextField
            className="input_course"
            fullWidth={true}
            autoFocus
            rows={5}
            placeholder="Write message for reminder course"
            multiline
            margin="dense"
            id="reminder"
            type="text"
            variant="outlined"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker className={classes.dateTimePicker} />
            </DemoContainer>
          </LocalizationProvider>
          <div className="add__reminder">
            <div>
              <div>
                <div className="add__reminder--title">Reminder type</div>
                <FormGroup className={classes.formGroup}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Send Email"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Send SMS"
                  />
                </FormGroup>
              </div>
            </div>
            <div>
              <div>
                <div className="add__reminder--title">Send to</div>
                <FormGroup className={classes.formGroup}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Trainer"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Student"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button style={{ color: "black" }} onClick={handleClose}>
            Discard
          </Button>
          <Button
            style={{ backgroundColor: "#CC7A00", color: "white" }}
            onClick={handleClose}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
