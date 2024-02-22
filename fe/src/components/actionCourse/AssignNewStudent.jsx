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
import AssignStudent from "./AssignStudent";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: "name", label: "Student Name", minWidth: 100, align: "left" },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "dob", label: "YOB", minWidth: 50 },
  { id: "phone", label: "Phone", minWidth: 50 },
  { id: "university", label: "University", minWidth: 50 },
  {
    id: "action",
    label: "Action",
    minWidth: 30,
    align: "center",
  },
];

function createData(name, email, dob, phone, university) {
  return { name, email, dob, phone, university };
}

// const rows = [
//   createData('Hoàng Phó Nam', 'nam.hoang@setacinq.vn',"1995", "0982309483","HUST - Đại học Bách Khoa HN","SETA"),
//   createData('Hoàng Phó Nam', 'nam.hoang@setacinq.vn',"1995", "0982309483","Vin - Vin University","SETA"),
//   createData('Hoàng Phó Nam', 'nam.hoang@setacinq.vn',"1995", "0982309483","HUST - Đại học Bách Khoa HN","SETA"),
//   createData('Hoàng Phó Nam', 'nam.hoang@setacinq.vn',"1995", "0982309483","HUST - Đại học Bách Khoa HN","SETA"),
//   createData('Hoàng Phó Nam', 'nam.hoang@setacinq.vn',"1995", "0982309483","HUST - Đại học Bách Khoa HN","SETA"),

//   ];

export default function AssignNewStudent({
  open,
  handleClose,
  data,
  course_id,
  students,
}) {
  const [openNewStudent, setOpenNewStudent] = useState(false);
  const handleClickOpen = () => {
    setOpenNewStudent(!openNewStudent);
  };
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const YOB = data[i].dob ? data[i].dob.slice(0, 4) : "---";
    rows.push(
      createData(
        data[i].name,
        data[i].email,
        YOB,
        data[i].phone_number,
        data[i].university
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
        <DialogTitle>Students</DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      sx={{ p: "10px 0px" }}
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
            Add a new student
          </Button>
        </DialogActions>
      </Dialog>
      {openNewStudent && (
        <AssignStudent
          open={openNewStudent}
          handleClose={handleClickOpen}
          data={data}
          course_id={course_id}
          students={students}
        />
      )}
    </React.Fragment>
  );
}
