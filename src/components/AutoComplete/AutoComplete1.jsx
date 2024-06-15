import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";

const AutoComplete1 = ({ formData, setFormData, column, row, api, iTag }) => {
  const iUser = localStorage.getItem("userId");
  const [iTypeF2, setiTypeF2] = useState(1);
  const [AutoMenu, setAutoMenu] = useState([]);
  const [autoSearchKey, setautoSearchKey] = useState("");
  const [sCodeReq, setsCodeReq] = useState(false);
  const [error, setError] = useState({ isError: false, message: "" });

  const handleAutocompleteChange = (event, newValue) => {
    let updatedFormData = [...formData];
    updatedFormData[row][column] = newValue;
    setFormData(updatedFormData);
    setiTypeF2(1);
  };
 
  useEffect(() => {
    const fetchData = async () => {
      const response = await api({ iTag, iType: iTypeF2, iUser, search: "" });
      setAutoMenu(response);
    };
    fetchData();
  }, [iTypeF2]);

  return (
    <Autocomplete
      PaperComponent={({ children }) => (
        <Paper style={{ minWidth: "150px", maxWidth: "300px" }}>
          {children}
        </Paper>
      )}
      options={AutoMenu}
      getOptionLabel={(option) => option?.sName ?? ""}
      value={{sName:formData[row][column]}}
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
            option.sName?.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode?.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      onInputChange={(event, newInputValue) => {
        setautoSearchKey(newInputValue);
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto", fontSize: "12px" }}>
              {option.sName}
            </Typography>
            {option.sCode && (
              <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
                {option.sCode}
              </Typography>
            )}
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          // variant="standard"
          error={error.isError}
          helperText={error.isError ? error.message : null}
          InputProps={{
            ...params.InputProps,
            autoComplete: "off",
            // disableUnderline: true, // Disables the underline on the standard variant
            style: {
              // Overrides default styles

              borderColor: "transparent",
              borderStyle: "solid",
              
              fontSize: "12px",
              height: "36px",
              padding: "0px",
              margin: 0,
            },
            inputProps: {
              ...params.inputProps,
              autoComplete: "off",
              //maxLength: iMaxSize,
              onKeyDown: (event, newValue) => {
                if (event.key === "F2") {
                  // Clear selected option and search key before handling F2 press
                  const updatedFormData = {
                    ...formData,
                    sName: newValue ? newValue?.sName : "",
                    iId: newValue ? newValue?.iId : 0,
                  };
                  setFormData(updatedFormData);

                  setautoSearchKey("");

                  setiTypeF2((prevType) => (prevType === 1 ? 2 : 1));

                  // Prevent default F2 key action
                  event.preventDefault();
                }
              },
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "16px",
              padding: "0 0px",
              zIndex: 1,
              backgroundColor: "#fff",
            },
          }}
          sx={{
        
            "& .MuiOutlinedInput-input": {
              padding: "8px 14px", // Reduce padding to decrease height
          
   
            },
            "& .MuiInputBase-input": {
              fontSize: "0.75rem", // Adjust the font size of the input text
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 22px) scale(0.85)", // Adjust the label position
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, 6px) scale(0.75)",
              // backgroundColor: "#fff",
              padding: "0px 2px",
            },

            // "& .MuiInputLabel-outlined.Mui-focused": {
            //   color: "currentColor", // Keeps the current color of the label
            // },
            // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            //   {
            //     borderColor: "currentColor", // Keeps the current border color
            //   },
          }}
        />
      )}
      style={{ width: 250 }}
    />
  );
};

export default AutoComplete1;
