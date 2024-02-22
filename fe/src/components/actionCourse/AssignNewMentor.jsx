import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AssignMentor from "./AssignMentor";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: "name", label: "Trainer Name", minWidth: 100, align: "left" },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "role", label: "Role", minWidth: 50 },
  { id: "phone", label: "Phone", minWidth: 50 },
  ~{ id: "level", label: "Level", minWidth: 50 },
  { id: "workplace", label: "Workplace", minWidth: 50 },
  {
    id: "action",
    label: "Action",
    minWidth: 30,
    align: "center",
  },
];

function createData(name, email, role, phone, level, workplace) {
  return { name, email, role, phone, level, workplace };
}

export default function AssignNewMentor({
  open,
  handleClose,
  data,
  mentors,
  course_id,
}) {
  const [openNewMentor, setOpenNewMentor] = useState(false);
  const handleClickOpen = () => {
    setOpenNewMentor(!openNewMentor);
  };
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const roles = data[i]?.roles.filter(
      (r) => r.name === "Trainer" || r.name === "Mentor"
    );
    rows.push(
      createData(
        data[i].name,
        data[i].email,
        roles.length !== 0 ? roles[0].name : "--",
        data[i].phone_number,
        data[i].level,
        data[i].work_place
      )
    );
  }

  return (
    <React.Fragment>
      <Dialog
        width="940px"
        open={open}
        fullWidth={true}
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Trainer and Mentor</DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column,index) => (
                    <TableCell
                      sx={{ p: "10px 0px" }}
                      key={index}
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
                      {columns.map((column,index) => {
                        const value = row[column.id];
                        if (column.id == "action") {
                          return (
                            <TableCell
                              sx={{ p: "10px 16px" }}
                              key={index}
                              align={column.align}
                            >
                              <Button
                                // onClick={handleClose}
                                style={{
                                  backgroundColor: "#DFE1E6",
                                  color: "#42526E",
                                  padding: "0",
                                }}
                              >
                                Detail
                              </Button>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              sx={{ p: "10px 0px" }}
                              key={index}
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
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button autoFocus onClick={handleClose} style={{ color: "black" }}>
            Discard
          </Button>
          <Button
            onClick={handleClickOpen}
            autoFocus
            style={{ backgroundColor: "blue", color: "white" }}
          >
            Add a new mentor
          </Button>
        </DialogActions>
      </Dialog>
      {openNewMentor && (
        <AssignMentor
          open={openNewMentor}
          handleClose={handleClickOpen}
          data={data}
          mentors={mentors}
          course_id={course_id}
        />
      )}
    </React.Fragment>
  );
}
