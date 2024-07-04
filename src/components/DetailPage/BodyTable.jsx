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

function EnhancedTableHead({ rows, handleBatchOpen }) {
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
          sx={{
            padding: "4px",
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
          }}
          padding="checkbox"
        ></TableCell>
        {rows.map((header, index) => (
          <TableCell
            key={index}
            sx={{ border: "1px solid #ddd", color: "#FFFF" }}
            align="left"
            padding="normal"
            onClick={() => header === "Add Charge" && handleBatchOpen(0, 3)}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ values, changes }) {
  return (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Purchase
      </Typography>
    </Toolbar>
  );
}

export default function BodyTable({ bodyFields }) {
  const iUser = localStorage.getItem("userId");
  const location = useLocation();
  const iDocType = location.state;
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [batchModal, setBatchModal] = React.useState(false);
  const [qty, setQty] = React.useState(0);
  const [modal, setModal] = React.useState(0);
  const [row, setRow] = React.useState(0);
  const tableContainerRef = React.useRef(null);
  const [formData, setFormData] = React.useState({});

  // Fetch initial data
  const fetchData = async () => {
    setOpen(true);
    const initialData = {};
    bodyFields.forEach((field) => {
      initialData[field.sFieldCaption] = "";
    });
    setData([initialData]);
    setOpen(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [bodyFields]);

  React.useEffect(() => {
    // Remove focus from any input fields on component mount
    if (tableContainerRef.current) {
      const inputs = tableContainerRef.current.querySelectorAll("input");
      inputs.forEach((input) => {
        input.blur();
      });
    }
  }, []);

  const handleBatchOpen = (value, type) => {
    setModal(type);
    setQty(data[value].Quantity);
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
    let update = [...data];
    update[row]["Serial No"] = values;
    setData(update);
    handleBatchClose();
  };

  const handleRow = (type) => {
    if (type === 1) {
      const initialData = {};
      bodyFields.forEach((field) => {
        initialData[field.sFieldCaption] = "";
      });
      setData([...data, initialData]);
    } else {
      setData(data.slice(0, -1));
    }
  };

  const handleInputChange = (event, fieldName) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <MDBCard
        className="text-center mt-2"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
      >
        {data.length > 0 && (
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
                rows={Object.keys(data[0])}
                handleBatchOpen={handleBatchOpen}
              />

              <TableBody>
                {data.map((row, indexNum) => {
                  const labelId = `enhanced-table-checkbox-${indexNum}`;

                  return (
                    <TableRow
                      hover
                      className={`table-row `}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.iTransDtId}
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
                                  {data?.length > 1 && (
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
                          <DynamicInputs
                            index={index}
                            labelId={labelId}
                            field={field}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setFormData={setFormData}
                            data={data}
                            indexNum={indexNum}
                            setData={setData}
                          />
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
        />
      ) : modal === 2 ? (
        <SerialNoModal
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          handleSubmit={handleBatchSubmit}
        />
      ) : modal === 3 ? (
        <AddCharges1
          isOpen={batchModal}
          handleCloseModal={handleBatchClose}
          qty={qty}
          handleSubmit={handleBatchSubmit}
        />
      ) : null}

      <Loader open={open} handleClose={setOpen} />
    </>
  );
}
