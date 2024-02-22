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
import { useDispatch } from "react-redux";
import { GET_STUDENTS_BY_COURSE_ID } from "../../stores/types/account";
import Slide from "@mui/material/Slide";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import { assignNewStudents } from "../../services/admin.service";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const columns = [
  { id: "name", label: "Student Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "dob", label: "YOB", minWidth: 50 },
  { id: "type", label: "Type", minWidth: 50 },
  {
    id: "action",
    label: "Action",
    minWidth: 30,
    align: "center",
  },
];

function createData(name, email, dob, type) {
  return { name, email, dob, type };
}

export default function AssignStudent({
  open,
  handleClose,
  data,
  course_id,
  students,
}) {
  const [loading,setLoading] = useState(false);
  const dispatchAction = useDispatch();
  const row = [];
  for (let i = 0; i < data.length; i++) {
    const YOB = data[i].dob ? data[i].dob.slice(0, 4) : "---";
    row.push(createData(data[i].name, data[i].email, YOB, "Existing"));
  }

  const emails = row.map((student) => student.email);
  const students_select = students?.filter(
    (student) => !emails.includes(student.email)
  );

  const students_filter = [];
  for (let i = 0; i < students_select?.length; i++) {
    students_filter.push({
      value: students_select[i].email,
      label: students_select[i].name + " - " + students_select[i].email,
      name: students_select[i].name,
      dob: students_select[i].dob ? students_select[i].dob.slice(0, 4) : "---",
    });
  }

  const [select_list_students, setSelect_list_students] =
    React.useState(students_filter);

  const [rows, setRows] = React.useState(row);
  const handleRemove = (index) => {
    const new_list_student_option = {
      value: rows[index].email,
      label: rows[index].name + " - " + rows[index].email,
      name: rows[index].name,
      dob: rows[index].dob,
    };
    setSelect_list_students([...select_list_students, new_list_student_option]);

    const deleteVal = [...rows];
    deleteVal.splice(index, 1);
    setRows(deleteVal);
  };
  const handleChange = (event) => {
    console.log(event);
    const new_select_list_students = select_list_students.filter(
      (mentor) => mentor.value !== event.value
    );
    setSelect_list_students(new_select_list_students);

    const newRow = createData(event.name, event.value, event.dob, "New");
    setRows([...rows, newRow]);
  };
  const handleSubmit = () => {
    setLoading(true);
    (async () =>
      await assignNewStudents(course_id, rows).then((response) => {
        if (response.status === 200) {
          notifySuccess("Success");
          dispatchAction({
            type: GET_STUDENTS_BY_COURSE_ID,
            payload: course_id,
          });
          handleClose();
        } else {
          notifyError("Server error");
          setLoading(false);
        }
      }))();
  };
  return (
    <React.Fragment>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: "24px 24px 8px 24px" }}>
          Assign Student
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
              className="select-student"
              isClearable
              isSearchable
              value={null}
              name="student"
              options={select_list_students}
              onChange={handleChange}
            />
          {/* </Paper> */}
          {/* <DialogContentText sx={{ p: "16px 0px" }}>
            Selected students
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
    </React.Fragment>
  );
}
