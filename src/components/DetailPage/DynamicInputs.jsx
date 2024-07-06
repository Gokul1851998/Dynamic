import React from "react";
import { TableCell, TextField } from "@mui/material";
import AutoCompleteTable from "../AutoComplete/ActoCompleteTable";
import TableInput2 from "../Input/TableInput";

export default function DynamicInputs({
  enableBatch,
  index,
  labelId,
  field,
  formData,
  handleInputChange,
  setFormData,
  data,
  indexNum,
  setData,
}) {
  return (
    <TableCell
      sx={{
        padding: 0,
        border: "1px solid #ddd",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      key={index + labelId}
      component="th"
      id={labelId}
      scope="row"
      padding="0px"
      align="left"
    >
      {field?.iFieldID === 6? (
          <TextField
          hidden={!enableBatch}
          id={`form3Example${index + 1}`}
          type={
            field.iDataType === 1 ||
            field.iDataType === 4 ||
            field.iDataType === 8
              ? "number"
              : "text"
          }
          readOnly={field.bReadOnly}
          size="small"
          value={formData[field.sFieldName] || ""}
          onChange={(e) => handleInputChange(e, field.sFieldName)}
          fullWidth
          onClick={(e) => e.stopPropagation()}
          autoComplete="off"
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

      ):(
        <>
        {field.iDataType === 3 ? (
          <TextField
            id={`form3Example${index + 1}`}
            type="date"
            readOnly={field.bReadOnly}
            size="small"
            value={formData[field.sFieldName] || ""}
            onChange={(e) => handleInputChange(e, field.sFieldName)}
            fullWidth
            autoComplete="off"
            onClick={(e) => e.stopPropagation()}
          />
        ) : field.iDataType === 5 || field.iDataType === 6 ? (
          <AutoCompleteTable
            iTag={field.iLinkTag}
            iUser={localStorage.getItem("userId")}
            fieldName={field.sFieldName}
            value={formData}
            inputValue={setFormData}
            fullWidth
          />
        ) : (
          <TextField
            id={`form3Example${index + 1}`}
            type={
              field.iDataType === 1 ||
              field.iDataType === 4 ||
              field.iDataType === 8
                ? "number"
                : "text"
            }
            readOnly={field.bReadOnly}
            size="small"
            value={formData[field.sFieldName] || ""}
            onChange={(e) => handleInputChange(e, field.sFieldName)}
            fullWidth
            onClick={(e) => e.stopPropagation()}
            autoComplete="off"
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
        )}
        </>

      )} 
    </TableCell>
  );
}
