import { useEffect, useState } from "react";
import { Stack, MenuItem, Chip, Select } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";

export default function MultiSelectStudent({ formik }) {
  const students = useSelector((state) => state.accounts.students);
  const nameStudents = [];
  for (let i = 0; i < students.length; i++) {
    nameStudents.push({ id: students[i].account_id, name: students[i].name });
  }

  const [selectedNames, setSelectedNames] = useState(
    formik.values.courses_students || []
  );
  useEffect(() => {
    formik.setFieldValue("courses_students", selectedNames);
  }, [selectedNames]);
  return (
    <>
      <Select
        className="input_course"
        sx={{ minWidth: "100%" }}
        multiple
        value={selectedNames}
        onChange={(e) => setSelectedNames(e.target.value)}
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="wrap">
            {selected.map((value) => (
              <Chip
                key={value.id}
                label={value.name}
                onDelete={() =>
                  setSelectedNames(
                    selectedNames.filter((item) => item.id !== value.id)
                  )
                }
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
              />
            ))}
          </Stack>
        )}
      >
        {nameStudents.map((name) => (
          <MenuItem
            key={name.id}
            value={name}
            sx={{ justifyContent: "space-between" }}
            disabled={selectedNames.some((index) => index.id === name.id)}
          >
            {name.name}
            {selectedNames.some((index) => index.id === name.id) ? (
              <CheckIcon color="info" />
            ) : null}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
