import { Autocomplete, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getExchangeRate, getMasters } from "../../api/ApiCall";

function AutoComplete2({ api, iTag, label, index, value, setValue }) {
  const iUser = localStorage.getItem("userId");
  const [isF2Pressed, setIsF2Pressed] = useState(1);
  const [suggestion, setSuggestion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api({
        iTag,
        iType: isF2Pressed,
        iUser,
        search: "",
      });
      setSuggestion(response);
    };
    fetchData();
  }, [isF2Pressed]);

  const handleAutocompleteChange = async (event, newValue) => {
    const updatedValues = [...value];
    updatedValues[index][label] = newValue.sName;

    const response = await getExchangeRate({
      iCurrency: newValue?.iId,
      date: new Date(),
    });

    if (response?.Status === "Success") {
      const resultData = JSON.parse(response.ResultData);
      updatedValues[index]["Exchange Rate"] = resultData?.Table[0]?.nConvertion;
      updatedValues[index]["Trans Amount"] = (resultData?.Table[0]?.nConvertion)*(value[index]["Amount"])
      updatedValues[index]["Base Amount"] = (resultData?.Table[0]?.nConvertion)*(value[index]["Amount"])
    }

    setValue(updatedValues);
  };

  return  (
    <>
      <Autocomplete
        size="small"
        value={{
          sName: value[index] ? value[index][label] || "" : "",
        }}
        options={suggestion.map((data) => ({
          sName: data?.sName,
          sCode: data?.sCode,
          iId: data?.iId,
        }))}
        onChange={handleAutocompleteChange}
        filterOptions={(options, { inputValue }) => {
          return options.filter(
            (option) =>
              option.sName.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.sCode.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        autoHighlight
        getOptionLabel={(option) =>
          option && option.sName ? option.sName : ""
        }
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
            }}
          />
        )}
      />
    </>
  );
}

export default AutoComplete2;
