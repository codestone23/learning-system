import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Select from "react-select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Slide from "@mui/material/Slide";
import { useDispatch } from "react-redux";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import { assignNewMentors } from "../../services/admin.service";
import { GET_MENTORS_BY_COURSE_ID } from "../../stores/types/account";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: "name", label: "Trainer", minWidth: 115 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "role", label: "Role", minWidth: 30 },
  { id: "type", label: "Type", minWidth: 30 },
  {
    id: "action",
    label: "Action",
    minWidth: 30,
    align: "center",
  },
];

function createData(name, email, role, type) {
  return { name, email, role, type };
}

export default function AssignMentor({
  open,
  handleClose,
  data,
  mentors,
  course_id,
}) {
  const dispatchAction = useDispatch();
  const [loading,setLoading] = useState(false);
  const row = [];
  for (let i = 0; i < data.length; i++) {
    const roles = data[i]?.roles.filter(
      (r) => r.name === "Trainer" || r.name === "Mentor"
    );
    row.push(
      createData(
        data[i].name,
        data[i].email,
        roles.length !== 0 ? roles[0].name : "--",
        "Existing"
      )
    );
  }
  const emails = row.map((mentor) => mentor.email);
  const mentors_select = mentors.filter(
    (mentor) => !emails.includes(mentor.email)
  );

  const mentors_filter = [];
  for (let i = 0; i < mentors_select.length; i++) {
    mentors_filter.push({
      value: mentors_select[i].email,
      label: mentors_select[i].name + " - " + mentors_select[i].email,
      name: mentors_select[i].name,
    });
  }

  const [select_list_mentors, setSelect_list_mentors] =
    React.useState(mentors_filter);

  const [rows, setRows] = React.useState(row);
  const handleRemove = (index) => {
    const new_list_mentor_option = {
      value: rows[index].email,
      label: rows[index].name + " - " + rows[index].email,
      name: rows[index].name,
    };
    setSelect_list_mentors([...select_list_mentors, new_list_mentor_option]);
    console.log(select_list_mentors);

    const deleteVal = [...rows];
    deleteVal.splice(index, 1);
    setRows(deleteVal);
  };
  const handleChange = (event) => {
    console.log(event.value);
    const new_select_list_mentors = select_list_mentors.filter(
      (mentor) => mentor.value !== event.value
    );
    setSelect_list_mentors(new_select_list_mentors);

    const newRow = createData(event.name, event.value, "Trainer", "New");
    setRows([...rows, newRow]);
  };
  const handleSubmit = () => {
    setLoading(true);
    (async () =>
      await assignNewMentors(course_id, rows).then((response) => {
        if (response.status === 200) {
          dispatchAction({
            type: GET_MENTORS_BY_COURSE_ID,
            payload: course_id,
          });
          notifySuccess("Success");
          handleClose();
        } else {
          notifyError("Server error");
          setLoading(false);
        }
      }))();
    
  };

  return (
    <Dialog
      width="660px"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "660px",
            "& .MuiDialogContent-root": {
              position: "relative",
              height: "100px",
              overflowY: "visible",
            },
          },
        },
      }}
      open={open}
      fullWidth={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: "24px 24px 8px 24px" }}>
        Assign Mentor
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ p: "0 0 16px 0" }}
        >
          Find and add some candidates to this request
        </DialogContentText>
        {/* <Paper
          component="form"
          sx={{
            p: "0px 0px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        > */}
        <Select
          className="select-mentor"
          isClearable
          isSearchable
          value={null}
          name="mentor"
          options={select_list_mentors}
          onChange={handleChange}
        />
        {/* <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton> */}
        {/* </Paper> */}
        {/* <DialogContentText sx={{ p: "16px 0px" }}>
          Selected trainers
        </DialogContentText> */}
      </DialogContent>
      <DialogActions sx={{ p: "8px 24px" }}>
        <Button autoFocus onClick={handleClose} style={{ color: "black" }}>
          Discard
        </Button>
        {!loading && (
              <Button
              onClick={handleSubmit}
              autoFocus
              style={{ backgroundColor: "blue", color: "white" }}
              >
                Assign
              </Button>
            )}

            {loading && (
              <Button
                type="submit"
                autoFocus
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  width: "68px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <CircularProgress color="inherit" size={25} thickness={4} />
                </Box>
              </Button>
            )}
      </DialogActions>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id == "action") {
                        return (
                          <TableCell
                            sx={{ p: "10px 16px" }}
                            key={column.id}
                            align={column.align}
                          >
                            <Button
                              onClick={() => handleRemove(index)}
                              style={{
                                backgroundColor: "#DFE1E6",
                                color: "#42526E",
                                padding: "2px 4px",
                              }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            sx={{ p: "10px 16px" }}
                            key={column.id}
                            align={column.align}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Dialog>
  );
}
