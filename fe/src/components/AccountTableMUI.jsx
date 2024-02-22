import { Fragment } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AuthService from "../services/auth.service";
import ActionAccount from "../components/actionAccount/ActionAccount";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import "../assets/styles/tableCourse.css";

// column title table accounts
const columns = [
  { id: "account_id", label: "ID", minWidth: 50 },
  { id: "full_name", label: "Full Name", minWidth: 150 },
  { id: "phone_number", label: "Phone", minWidth: 120 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "roles", label: "Roles", minWidth: 150 },
  { id: "gender", label: "Gender", minWidth: 70 },
  { id: "status", label: "Status", minWidth: 70, color: "red" },
  { id: "actions", label: "Actions", minWidth: 50, align: "right" },
];

function createData(
  account_id,
  full_name,
  phone_number,
  email,
  roles,
  gender,
  status,
  actions
) {
  return {
    account_id,
    full_name,
    phone_number,
    email,
    roles,
    gender,
    status,
    actions,
  };
}

export default function AccountTableMUI({
  page,
  totalPages,
  data,
  rowsPerPage,
  handleSubmit,
}) {
  const user = AuthService.getCurrentUser();
  const rows = [];
  const indexPage = page * rowsPerPage;
  for (let i = indexPage; i < data?.length + indexPage; i++) {
    const name = data[i - indexPage]?.name;
    const phone_number = data[i - indexPage]?.phone_number;
    const email = data[i - indexPage]?.email;
    const roles = data[i - indexPage]?.roles;
    const relRoles = roles?.map((role) => role.name);
    const formattedRoles = relRoles?.join(" | ");
    const gender = data[i - indexPage]?.gender ? "Male" : "Female";
    const status = data[i - indexPage]?.active ? "Active" : "Inactive";

    rows.push(
      createData(
        i + 1,
        name,
        phone_number,
        email,
        formattedRoles,
        gender,
        status,
        [i + 1, status === "Active", email]
      )
    );
  }
  // console.log(rows);
  return !user ? null : (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
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
            {rows.length === 0 &&
              Array.from({ length: rowsPerPage }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      <Skeleton variant="rounded" width={column.minWidth} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {rows.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.account_id}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (column.id === "actions") {
                      return (
                        <Fragment key={column.id}>
                          <TableCell
                            style={{
                              color:
                                row[column.id] == "Inactive" ? "red" : "black",
                            }}
                            key={row[column.id]}
                            align={column.align}
                          >
                            <ActionAccount
                              index={value[0]}
                              status={value[1]}
                              email={value[2]}
                              total={totalPages}
                              rowsPerPage={rowsPerPage}
                              handleSubmit={handleSubmit}
                            />
                          </TableCell>
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment key={column.id}>
                          <TableCell
                            style={{
                              color:
                                row[column.id] == "Inactive" ? "red" : "black",
                            }}
                            key={row[column.id]}
                            align={column.align}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        </Fragment>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
