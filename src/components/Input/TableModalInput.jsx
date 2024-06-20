import { TextField } from "@mui/material";
import React from "react";

export default function TableModalInput({ type, column, row, value, setValue }) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    const updatedValue = [...value];
    updatedValue[row][column] = newValue;
    setValue(updatedValue);
  };

  return (
    <TextField
      margin="normal"
      size="small"
      id={column}
      value={value[row][column]}
      onChange={handleChange}
      type={type}
      autoComplete="off"
      autoFocus
      sx={{
        padding: 0,
        margin: 0,
        width: 220, // Adjust the width as needed
        "& .MuiInputBase-root": {
          height: 30, // Adjust the height of the input area
        },
        "& .MuiInputLabel-root": {
          transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
        },
        "& .MuiInputBase-input": {
          fontSize: "0.75rem", // Adjust the font size of the input text
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Keeps the current border color
        },
      
      }}
    />
  );
}
