import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { visuallyHidden } from "@mui/utils";
import "./PurchaseTable.css";
import {
  deleteTransaction,
  getTransactionDetails,
  getTransactionSummary,
} from "../../api/ApiCall";
import Loader from "../Loader/Loader";
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import DetailPage from "../DetailPage/DetailPage";
import Demo from "../DetailPage/demo";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    rows,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
        >
          <Checkbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {rows.map((header, index) => {
          if (header !== "iTransId" && header !== "sNarration") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{ border: "1px solid #ddd" }}
                key={index}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  sx={{ color: "#fff" }}
                  active={orderBy === header}
                  direction={orderBy === header ? order : "asc"}
                  onClick={createSortHandler(header)}
                >
                  {header}
                  {orderBy === header ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, values, changes, menuName } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
       {menuName}
      </Typography>

      <TextField
        id="search"
        label="Search"
        variant="outlined"
        value={values}
        onChange={changes}
        size="small"
      />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function PurchaseTable() {
  const iUser = localStorage.getItem("userId");
  const location = useLocation();
  const menu = location.state;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [sortDir, setSortDir] = React.useState("asc");
  const [open, setOpen] = React.useState(false);
  const [navigate, setNavigate] = React.useState(false);
 
  const buttonStyle = {
    textTransform: "none", 
    color: "#FFFFFF", 
    backgroundColor: "#7581c6", 
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const fetchData = async () => {
    handleOpen();
    const response = await getTransactionSummary({
      DisplayLength: rowsPerPage,
      DisplayStart: page * rowsPerPage,
      SortCol: orderBy,
      SortDir: order,
      iUser,
      iDocType: 2,
      Search: searchQuery,
    });
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setData(myObject?.Table);
    }
    handleClose();
  };

  React.useEffect(() => {
    fetchData();
    setNavigate(false)
  }, [searchQuery,page, rowsPerPage, order, orderBy, menu]);

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    setOrder(orderBy ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.iTransId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.

  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (typeof value === "number") {
        return value.toString().includes(searchQuery.toLowerCase());
      }
      return false; // Ignore other types
    })
  );

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );

  const handleDelete = async () => {
    const ids = selected.join();
    Swal.fire({
      text: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const response = await deleteTransaction({
          iId: ids,
          iUser,
          iDocType:menu?.iDocType,
        });
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Your file has been deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setSelected([]);
        }
        fetchData();
      }
    });
  };

  const handleNavigate = () => {
    setNavigate(true);
  };

  const handleEditClose = () =>{
    setSelected([])
    setNavigate(false)
  }

  return (
    <Box
      sx={{
        margin: 0,
        background: "#8c99e0",
        height: "200px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          width: "auto",
          paddingLeft: 2,
          paddingRight: 2,
          zIndex: 1,
        }}
      >
        {!navigate ? (
          <>
            <Stack
              direction="row"
              spacing={1}
              padding={1}
              justifyContent="flex-end"
            >
              <Button
                onClick={handleNavigate}
                variant="contained"
                startIcon={<AddIcon />}
                style={buttonStyle}
              >
                New
              </Button>
              <Button
                onClick={handleNavigate}
                variant="contained"
                disabled={selected.length !== 1}
                startIcon={<EditIcon />}
                style={buttonStyle}
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                disabled={selected.length <= 0}
                startIcon={<DeleteIcon />}
                style={buttonStyle}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                style={buttonStyle}
              >
                Print
              </Button>
              <Button
                variant="contained"
                startIcon={<CloseIcon />}
                style={buttonStyle}
              >
                Close
              </Button>
            </Stack>

            <Paper
              sx={{
                width: "100%",
                mb: 2,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              <EnhancedTableToolbar
                numSelected={selected.length}
                values={searchQuery}
                changes={handleSearch}
                menuName={menu?.sName}
              />
              {data.length > 0 && (
                <TableContainer
                  style={{
                    display: "block",
                    maxHeight: "calc(100vh - 400px)",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f5f5f5",
                    scrollbarTrackColor: "#f5f5f5",
                  }}
                >
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      numSelected={Object.keys(selected).length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={data.length}
                      rows={Object.keys(data[0])}
                    />

                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row.iTransId);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        const handleRowDoubleClick = async (
                          event,
                          index,
                          iId
                        ) => {
                          handleOpen();
                          setNavigate(true);
                          setSelected([iId])
                          handleClose();
                        };

                        return (
                          <TableRow
                          key={row.iTransId + index}
                            hover
                            className={`table-row `}
                            onClick={(event) =>
                              handleClick(event, row.iTransId)
                            }
                            onDoubleClick={(event) =>
                              handleRowDoubleClick(event, index, row.iTransId)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            {Object.keys(data[0]).map((column, index) => {
                              if (
                                column !== "iTransId" &&
                                column !== "sNarration"
                              ) {
                                return (
                                  <>
                                    <TableCell
                                      sx={{
                                        padding: "4px",
                                        border: "1px solid #ddd",
                                        whiteSpace: "nowrap",
                                      }}
                                      key={index + labelId}
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      padding="normal"
                                      align="left"
                                    >
                                      {row[column]}
                                    </TableCell>
                                  </>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <FormControl sx={{ m: 1 }} className="CLTFormControl">
          <InputLabel
            htmlFor="rows-per-page"
            sx={{
              "&.Mui-focused": {
                color: "currentColor", // Keeps the current color
              },
            }}
          >
            Show Entries
          </InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Rows per page"
            inputProps={{
              name: "rows-per-page",
              id: "rows-per-page",
            }}
            sx={{
              width: "120px",
              height: "30px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor", // Keeps the current border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor", // Optional: Keeps the border color on hover
              },
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
            <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page + 1}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}
        />
        
        </Box>
            </Paper>
          </>
        ) : (
          <DetailPage iUser={iUser} iDocType={menu?.iDocType}  iTransId={selected[0] || 0} details={menu} action={handleEditClose}/>
        )}
      </Box>
      <Loader open={open} handleClose={handleClose} />
      <Demo />
    </Box>
  );
}
