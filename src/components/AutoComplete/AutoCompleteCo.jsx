import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getMasters } from "../../api/ApiCall";

function AutoCompleteCo({ iTag, iUser, value, label, inputValue, fieldName }) {
  const [isF2Pressed, setIsF2Pressed] = useState(1);
  const [suggestion, setSuggestion] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMasters({
          iTag,
          iUser,
          iType: isF2Pressed,
          Search: searchTerm,
        });
        setSuggestion(response || []);
      } catch (error) {
        setSuggestion([]);
      }
    };
    fetchData();
  }, [isF2Pressed, searchTerm]);

  const handleAutocompleteChange = (event, newValue) => {
    let updatedFormData = { ...value, [fieldName]: newValue?.sName || "" };
    inputValue(updatedFormData);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Autocomplete
      size="small"
      value={{ sName: value[fieldName] || "" }}
      options={suggestion.map((data) => ({
        sName: data?.sName,
        sCode: data?.sCode,
        iId: data?.iId,
      }))}
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option.sName.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode.toLowerCase().includes(inputValue.toLowerCase())
        )
      }
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
          label={label}
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
            onKeyDown: (e) => {
              if (e.key === "F2") {
                setIsF2Pressed(isF2Pressed === 1 ? 2 : 1);
              }
            },
            onChange: handleInputChange, // Update search term on input change
          }}
        />
      )}
    />
  );
}

export default AutoCompleteCo;
