import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { TextField, Popover, Stack } from "@mui/material";
import { MDBCard } from "mdb-react-ui-kit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";
import BatchModal from "./BatchModal";
import SerialNoModal from "./SerialNoModal";
import AddCharges1 from "./AddCharges1";
import AutoCompleteTable from "../AutoComplete/ActoCompleteTable";
import TableInput2 from "../Input/TableInput";
import DynamicInputs from "./DynamicInputs";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function EnhancedTableHead({
  handleBatchOpen,
  batchEnable,
  sLNoEnable,
  allDoc,
}) {
  return (
    <TableHead
      style={{
        backgroundColor: "#8c99e0",
        position: "sticky",
        top: 0,
        zIndex: "5",
      }}
    >
      <TableRow>
        <TableCell
          style={{
            backgroundColor: "#8c99e0",
            position: "sticky",
            top: 0,
            zIndex: "5",
          }}
          padding="checkbox"
        ></TableCell>
        {allDoc?.Body?.map((header, index) => {
          const inputConfig = allDoc.Inputs.find(
            (input) => input?.iInvVar == header?.iInvVar
          );
          const isClickable = inputConfig?.bBifurcation ?? false;
          return (
            <>
              {header.iDataType === 10 ? (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  hidden={!batchEnable}
                >
                  {header.sFieldCaption}
                </TableCell>
              ) : header.iDataType === 11 ? (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  hidden={!sLNoEnable}
                >
                  {header.sFieldCaption}
                </TableCell>
              ) : (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  onClick={() => isClickable && handleBatchOpen(header.sFieldCaption, 3)}
                >
                  {header.sFieldCaption}
                </TableCell>
              )}
            </>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default function BodyTable({
  bodyFields,
  bodySettings,
  slNoSetting,
  allDoc,
}) {
  const iUser = localStorage.getItem("userId");
  const location = useLocation();
  const iDocType = location.state;
  const [open, setOpen] = React.useState(false);
  const [batchModal, setBatchModal] = React.useState(false);
  const [qty, setQty] = React.useState(0);
  const [modal, setModal] = React.useState(0);
  const [row, setRow] = React.useState(0);
  const tableContainerRef = React.useRef(null);
  const [formData, setFormData] = React.useState([]);
  const [warning, setWarning] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [batchData, setBatchData] = React.useState([]);
  const [serialData, setSerialData] = React.useState([]);
  const [bifurcation, setBifurcation] = React.useState([]);

  const handleCloseAlert = () => {
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  // Fetch initial data
  const fetchData = async () => {
    setOpen(true);

    // Initialize initialData
    let initialData = {};
    bodyFields.forEach((field) => {
      initialData[field.sFieldName] = "";
    });
    // Conditionally remove the "Batch" field if bEnableBatch is false
    if (bodySettings?.bEnableBatch === false) {
      delete initialData["sBatch"];
    }
    setFormData([initialData]);

    setOpen(false);
    const currentDate = new Date().toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD

    const initialData2 = {
      iId: 1,
      Batch: "",
      "Exp.Date": bodySettings?.bExpDateforBatch ? currentDate : "",
      "Manuf.Date": bodySettings?.bManf_dt ? currentDate : "",
      "Tot.Qty": "",
    };
    // Remove keys that are not needed based on settings
    if (!bodySettings?.bExpDateforBatch) {
      delete initialData2["Exp.Date"];
    }

    if (!bodySettings?.bManf_dt) {
      delete initialData2["Manuf.Date"];
    }

    setBatchData([initialData2]);
  };

  React.useEffect(() => {
    fetchData();
  }, [bodyFields, bodySettings]);

  const handleBatchOpen = (value, type) => {
    const quantity = Number(formData[value]?.fQty);
    const iItem = formData[value]?.iItem;
    const bBatch = formData[value]?.bBatch;
    const bSerial = formData[value]?.bSerial;

    const emptyFields = [];

    if (!quantity) emptyFields.push("Qty");
    if (!iItem) emptyFields.push("Item");
    if (type === 1 && !bBatch) emptyFields.push("Valid Item");
    if (type === 2 && !bSerial) emptyFields.push("Valid Item");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Enter ${emptyFields[0]}.`);
      return;
    }

    setModal(type);
    setQty(quantity);
    setBatchModal(true);
    setRow(value);
  };

  const handleBifi = (value, type) => {
    setModal(type);
    setBatchModal(true);
    setRow(value);
  };

  const handleBatchClose = () => {
    setBatchModal(false);
    setQty(0);
    setModal(0);
    setRow(0);
  };

  const handleBatchSubmit = (values) => {
    handleBatchClose();
  };

  const handleRow = (type) => {
    if (type === 1) {
      const initialData = {};
      bodyFields.forEach((field) => {
        initialData[field.sFieldCaption] = "";
      });
      setFormData([...formData, initialData]);
    } else {
      setFormData(formData.slice(0, -1));
    }
  };

  const handleInputChange = (event, fieldName, index, type) => {
    const value = type === 8 ? Number(event.target.value) : event.target.value;
    let updatedFormData = [...formData];

    if (type === 8) {
      if (fieldName === "fRate") {
        updatedFormData[index].fGross = updatedFormData[index].fQty * value;
      } else if (fieldName === "fGross") {
        updatedFormData[index].fRate = value / updatedFormData[index].fQty;
      } else if (fieldName === "fQty") {
        updatedFormData[index].fGross = updatedFormData[index].fRate * value;
      }
    }

    updatedFormData[index][fieldName] = value;
    setFormData(updatedFormData);
  };

  const entireRowUpdate = (event, fieldName, index, type) => {
    let updatedValues = [...formData];
    Object.keys(formData[index]).forEach((key) => {
      const inputConfig = allDoc.Inputs.find(
        (input) =>
          input?.iInvVar ===
          allDoc.Body.find((h) => h.sFieldName === key)?.iInvVar
      );

      if (inputConfig) {
        let { sInFormula, sOutFormula } = inputConfig;

        const prepareFormula = (formula) => {
          for (let i = 1; i <= 20; i++) {
            formula = formula
              .replace(
                new RegExp(`\\bi${i}\\b`, "g"),
                updatedValues[index][`input${i}`] || 0
              ) // Ensure using updated values
              .replace(
                new RegExp(`\\bo${i}\\b`, "g"),
                updatedValues[index][`output${i}`] || 0
              );
          }
          return formula
            .replace("%", "/100")
            .replace("g", updatedValues[index].fGross);
        };

        if (sInFormula) {
          const preparedInputFormula = prepareFormula(sInFormula);
          try {
            const inputValue = eval(preparedInputFormula);
            updatedValues[index][key] = inputValue;
          } catch (error) {
            console.error("Error evaluating input formula: ", error);
          }
        }

        if (sOutFormula) {
          const preparedOutputFormula = prepareFormula(sOutFormula);
          try {
            const outputValue = eval(preparedOutputFormula);
            updatedValues[index][`${key.replace("input", "output")}`] =
              outputValue;
          } catch (error) {
            console.error("Error evaluating output formula: ", error);
          }
        } else {
          // Directly link input to output when no output formula
          const outputKey = `${key.replace("input", "output")}`;
          if (key.startsWith("input") && !sOutFormula) {
            updatedValues[index][outputKey] = updatedValues[index][key]; // Update output with the latest input
          }
        }
      }
    });
    setFormData(updatedValues);
  };

  return (
    <>
      <MDBCard
        className="text-center mt-2"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
      >
        {formData.length > 0 && (
          <TableContainer
            ref={tableContainerRef}
            style={{
              display: "block",
              maxHeight: "calc(100vh - 400px)",
              overflowY: "auto",
              scrollbarWidth: "thin",
              borderRadius: 2,
              scrollbarColor: "#888 #f5f5f5",
              scrollbarTrackColor: "#f5f5f5",
            }}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead
                handleBatchOpen={handleBifi}
                batchEnable={bodySettings?.bEnableBatch}
                sLNoEnable={slNoSetting?.bRMASupt}
                allDoc={allDoc}
              />

              <TableBody>
                {formData.map((row, indexNum) => {
                  const labelId = `enhanced-table-checkbox-${indexNum}`;

                  return (
                    <TableRow
                      hover
                      className={`table-row `}
                      role="checkbox"
                      tabIndex={-1}
                      key={indexNum}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <PopupState
                          variant="popover"
                          popupId="demo-popup-popover"
                        >
                          {(popupState) => (
                            <div>
                              <IconButton
                                aria-label="options"
                                {...bindTrigger(popupState)}
                                sx={{ padding: 0, fontSize: "1.2rem" }}
                              >
                                <MoreVertIcon sx={{ fontSize: "1.2rem" }} />
                              </IconButton>
                              <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "center",
                                }}
                              >
                                <Stack direction="row">
                                  <IconButton
                                    onClick={() => {
                                      handleRow(1);
                                      popupState.close();
                                    }}
                                    aria-label="add"
                                    color="#8c99e0"
                                    sx={{
                                      fontSize: "1.2rem",
                                      color: "#8c99e0",
                                    }}
                                  >
                                    <AddCircleIcon
                                      sx={{ fontSize: "1.2rem" }}
                                    />
                                  </IconButton>
                                  {formData?.length > 1 && (
                                    <IconButton
                                      onClick={() => {
                                        handleRow(0);
                                        popupState.close();
                                      }}
                                      aria-label="remove"
                                      sx={{
                                        fontSize: "1.2rem",
                                        color: "#8c99e0",
                                      }}
                                    >
                                      <RemoveCircleIcon
                                        sx={{ fontSize: "1.2rem" }}
                                      />
                                    </IconButton>
                                  )}
                                </Stack>
                              </Popover>
                            </div>
                          )}
                        </PopupState>
                      </TableCell>
                      {bodyFields
                        .filter(
                          (field) =>
                            field.bVisible &&
                            !["iTransDtId"].includes(field.sFieldName)
                        )
                        .map((field, index) => (
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
                            {field?.iDataType === 10 ? (
                              <TextField
                                hidden={!bodySettings?.bEnableBatch}
                                id={`form3Example${index + 1}`}
                                type="text"
                                readOnly={field.bReadOnly}
                                size="small"
                                value={
                                  formData[indexNum][field.sFieldName]
                                    ? formData[indexNum][field.sFieldName]
                                    : formData[indexNum]?.bBatch
                                    ? "Select Batch"
                                    : "NA"
                                }
                                fullWidth
                                onClick={() => handleBatchOpen(indexNum, 1)}
                                autoComplete="off"
                                sx={{
                                  padding: 0,
                                  margin: 0,
                                  width: 250, // Adjust the width as needed
                                  "& .MuiInputBase-root": {
                                    height: 30, // Adjust the height of the input area
                                  },
                                  "& .MuiInputLabel-root": {
                                    transform:
                                      "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                  },
                                  "& .MuiInputLabel-shrink": {
                                    transform:
                                      "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "0.75rem", // Adjust the font size of the input text
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "currentColor", // Keeps the current border color
                                    },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "currentColor", // Optional: Keeps the border color on hover
                                  },
                                }}
                              />
                            ) : field?.iDataType === 11 ? (
                              <TextField
                                hidden={!slNoSetting?.bRMASupt}
                                id={`form3Example${index + 1}`}
                                type="text"
                                readOnly={field.bReadOnly}
                                size="small"
                                value={
                                  formData[indexNum][field.sFieldName]
                                    ? formData[indexNum][field.sFieldName]
                                    : formData[indexNum]?.bSerial
                                    ? "Select Serial No"
                                    : "NA"
                                }
                                fullWidth
                                onClick={() => handleBatchOpen(indexNum, 2)}
                                autoComplete="off"
                                sx={{
                                  padding: 0,
                                  margin: 0,
                                  width: 250, // Adjust the width as needed
                                  "& .MuiInputBase-root": {
                                    height: 30, // Adjust the height of the input area
                                  },
                                  "& .MuiInputLabel-root": {
                                    transform:
                                      "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                  },
                                  "& .MuiInputLabel-shrink": {
                                    transform:
                                      "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: "0.75rem", // Adjust the font size of the input text
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "currentColor", // Keeps the current border color
                                    },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "currentColor", // Optional: Keeps the border color on hover
                                  },
                                }}
                              />
                            ) : (
                              <>
                                {field.iDataType === 3 ? (
                                  <TextField
                                    id={`form3Example${index + 1}`}
                                    type="date"
                                    readOnly={field.bReadOnly}
                                    size="small"
                                    value={
                                      formData[indexNum][field.sFieldName] || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        field.sFieldName,
                                        indexNum
                                      )
                                    }
                                    fullWidth
                                    autoComplete="off"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : field.iDataType === 5 ||
                                  field.iDataType === 6 ? (
                                  <AutoCompleteTable
                                    iTag={field.iLinkTag}
                                    iUser={localStorage.getItem("userId")}
                                    fieldName={field.sFieldName}
                                    fieldCaption={field.sFieldCaption}
                                    value={formData}
                                    inputValue={setFormData}
                                    row={indexNum}
                                    fullWidth
                                  />
                                ) : (
                                  <TextField
                                    id={`form3Example${index + 1}`}
                                    type={
                                      field.iDataType === 8 ? "number" : "text"
                                    }
                                    readOnly={field.bReadOnly}
                                    size="small"
                                    onBlur={(e) =>
                                      entireRowUpdate(
                                        e,
                                        field.sFieldName,
                                        indexNum,
                                        field.iDataType
                                      )
                                    }
                                    value={
                                      formData[indexNum][field.sFieldName] || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        field.sFieldName,
                                        indexNum,
                                        field.iDataType
                                      )
                                    }
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
                                        transform:
                                          "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                      },
                                      "& .MuiInputLabel-shrink": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                      },
                                      "& .MuiInputBase-input": {
                                        fontSize: "0.75rem", // Adjust the font size of the input text
                                      },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "currentColor", // Keeps the current border color
                                        },
                                      "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: "currentColor", // Optional: Keeps the border color on hover
                                        },
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MDBCard>

      {modal === 1 ? (
        <BatchModal
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          settings={bodySettings}
          batchData={batchData}
          setBatchData={setBatchData}
          setFormData={setFormData}
          formData={formData}
          row={row}
        />
      ) : modal === 2 ? (
        <SerialNoModal
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          serialData={serialData}
          setSerialData={setSerialData}
          formData={formData}
          setFormData={setFormData}
          row={row}
        />
      ) : modal === 3 ? (
        <AddCharges1
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          row={row}
          setBifurcation={setBifurcation}
          bifurcation={bifurcation}
        />
      ) : null}

      <Loader open={open} handleClose={setOpen} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </>
  );
}
