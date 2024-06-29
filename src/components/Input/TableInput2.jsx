import { TextField } from "@mui/material";
import React from "react";

export default function TableInput({ type, column, row, value, setValue }) {
  return (
    <TextField
      margin="normal"
      size="small"
      id={column}
      value={value[row][column]}
      type={type}
      autoComplete="off"
      autoFocus
      sx={{
        padding: 0,
        margin: 0,
        width: 250, // Adjust the width as needed
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
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Optional: Keeps the border color on hover
        },
      }}
    />
  );
}
