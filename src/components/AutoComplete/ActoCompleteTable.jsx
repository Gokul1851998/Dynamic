import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getMasters } from "../../api/ApiCall";

function AutoCompleteTable({ iTag, iUser, value, label, inputValue, fieldName, row }) {
  const [isF2Pressed, setIsF2Pressed] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMasters({
          iTag,
          iUser,
          iType: isF2Pressed,
          Search: search || "",
        });
        setSuggestions(response || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSuggestions([]);
      }
    };

    fetchData();
  }, [isF2Pressed, iTag, iUser, search]);

  const handleAutocompleteChange = (event, newValue) => { 
    let updatedFormData = [...value];
    updatedFormData[row][fieldName] = newValue.sName;
    inputValue(updatedFormData);
  };

  return (
    <Autocomplete
      size="small"
      options={suggestions.map((data) => ({
        sName: data?.sName,
        sCode: data?.sCode,
        iId: data?.iId,
      }))}
      value={{ sName: value[row][fieldName] || "" }}
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option.sName.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode.toLowerCase().includes(inputValue.toLowerCase())
        )
      }
      onInputChange={(event) => {
        if (event && event.target) {
          setSearch(event.target.value);
        } else {
          setSearch("");
        }
      }}
      autoHighlight
      getOptionLabel={(option) => (option && option.sName ? option.sName : "")}
      renderOption={(props, option) => (
        <li {...props}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              style={{
                marginRight: "auto",
                fontSize: "12px",
                fontWeight: "normal",
              }}
            >
              {option.sName}
            </Typography>
            <Typography
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                fontWeight: "normal",
              }}
            >
              {option.sCode}
            </Typography>
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
            onKeyDown: (e) => {
              if (e.key === "F2") {
                setIsF2Pressed(isF2Pressed === 1 ? 2 : 1);
              }
            },
          }}
          sx={{
            "& .MuiOutlinedInput-input": {
              padding: "8px 14px", // Reduce padding to decrease height
              fontSize: "0.75rem", // Adjust the font size of the input text
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 22px) scale(0.85)", // Adjust the label position
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, 6px) scale(0.75)",
            },
          }}
          style={{ width: 250 }}
        />
      )}
    />
  );
}

export default AutoCompleteTable;







