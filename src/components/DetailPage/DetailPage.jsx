import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Header from "../CommonComponents/Header";
import DetailGrid from "./DetailGrid";
import { Box, Button, Stack } from "@mui/material";
import {
  getDocSettings,
  getTransactionDetails,
  getTransactionSummary,
} from "../../api/ApiCall";
import { useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";
import SaveIcon from "@mui/icons-material/Save";
import AutoCompleteCo from "../AutoComplete/AutoCompleteCo";
import BodyTable from "./BodyTable";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: "#FFFFFF", // Set text color
  backgroundColor: "#7581c6", // Set background color
};

const FormContent = ({ header, receiveData, headerFeilds }) => {
  const formFields = [
    "Document No",
    "Date",
    "Vendor",
    "Duedate",
    "Vendor invoice no",
    "Narration",
    "PaymentTerms",
    "LCNo",
    "Branch",
    "Currency",
    "Exchange Rate",
    "Exchange Rate Diff",
  ];
  const iUser = localStorage.getItem("userId");
  const [formData, setFormData] = useState({});
  const [vender, setVender] = useState("");
  const [suggestionVender, setSuggestionVender] = useState([]);
  const [stock, setStock] = useState(false);
  const [receipt, setReceipt] = useState(false);
  
  useEffect(() => {
    if (header) {
      const formatDate = (dateString) => {
        const dateParts = dateString?.split("-");
        if (dateParts?.length === 3) {
          // Assuming the date format is "dd-mm-yyyy"
          const [day, month, year] = dateParts;
          return `${year}-${month}-${day}`;
        } else {
          // Fallback: Try parsing as ISO format "yyyy-mm-dd"
          const dateObject = new Date(dateString);
          if (!isNaN(dateObject.getTime())) {
            return dateString;
          } else {
            // If parsing fails, return an empty string
            return "";
          }
        }
      };
      setFormData({
        "Document No": header?.sDocNo || "",
        Date: formatDate(header?.iDate) || "",
        Vendor: header?.iVendor || "",
        Duedate: formatDate(header?.iDueDate) || "",  
        "Vendor invoice no": header?.sVendorInvNo || "",
        Narration: header?.sNarration || "",
        PaymentTerms: header?.iPaymentTerms || "",
        LCNo: header?.sLCNo || "",
        Branch: header?.iBranch || "",
        Currency: header?.iCurrency || "",
        "Exchange Rate": header?.nExchange || "",
        "Exchange Rate Diff": header?.nExchangeDiff || "",
      });
      setStock(header?.bUpStock || false);
      setReceipt(header?.bUpReceipt || false);
    } else {
      setFormData([]);
    }
  }, [header]);

  useEffect(() => {
    receiveData(formData);
  }, [formData]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleStockChange = () => {
    setStock(!stock);
  };

  const handleReceiptChange = () => {
    setReceipt(!receipt);
  };

  return (
    <form>
      <MDBRow>
        {formFields.map((label, index) => (
          <MDBCol key={index} lg="3" md="4" sm="6" xs="12">
            <div className="mb-3">
              {label === "Date" || label === "Duedate" ? (
                <MDBInput
                  id={`form3Example${index + 1}`}
                  label={label}
                  type="date"
                  size="small"
                  value={formData[label] || ""}
                  onChange={(e) => handleInputChange(e, label)}
                />
              ) : label === "Vendor" ||
                label === "Branch" ||
                label === "Currency" ||
                label === "PaymentTerms" ? (
                <AutoCompleteCo
                  iTag={
                    label === "Vendor"
                      ? 1
                      : label === "Currency"
                      ? 13
                      : label === "Branch"
                      ? 16
                      : label === "PaymentTerms"
                      ? 15
                      : 1
                  }
                  iUser={iUser}
                  value={label}
                  inputValue={formData[label]}
                />
              ) : (
                <MDBInput
                  size="small"
                  id={`form3Example${index + 1}`}
                  label={label}
                  type="text"
                  value={formData[label] || ""}
                  onChange={(e) => handleInputChange(e, label)}
                />
              )}
            </div>
          </MDBCol>
        ))}
        <MDBCol lg="2" md="3" sm="" xs="12">
          <div>
            <MDBCheckbox
              checked={stock}
              onChange={handleStockChange}
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Update Stock"
            />
          </div>
        </MDBCol>
        <MDBCol lg="2" md="3" sm="6" xs="12">
          <div>
            <MDBCheckbox
              checked={receipt}
              onChange={handleReceiptChange}
              name="flexCheck"
              value=""
              id="flexCheckChecked"
              label="Update Receipt"
            />
          </div>
        </MDBCol>
      </MDBRow>
    </form>
  );
};

export default function DetailPage({ iUser, iDocType, iTransId, action }) {
  const [activeTab, setActiveTab] = useState(0);
  const [header, setHeader] = useState();
  const [batch, setBatch] = useState();
  const [body, setBody] = useState([]);
  const [bification, setBification] = useState();
  const [open, setOpen] = React.useState(false);
  const [headerFeilds, setHeaderFeilds] = useState([]);
  const [childData, setChildData] = useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDocSettings({ iDoctype: 2 }); b
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        console.log(myObject);
        setHeaderFeilds(myObject?.Header);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (iTransId) {
        handleOpen();
        const response = await getTransactionDetails({
          iUser,
          iDocType,
          iTransId,
        });
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response.ResultData);
          setHeader(myObject.Header[0]);
          setBody(myObject?.Body);
        }
        handleClose();
      } else {
        setHeader();
      }
    };
    fetchData();
  }, [iUser, iDocType, iTransId]);

  const receiveDataFromChild = (data) => {
    setChildData(data);
  };

  const handleSave = () => {};

  const handleClear = ()=>{
    setHeader([])
    setBody([])
  }

  return (
    <>
      <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
        <Button
          onClick={handleClear}
          variant="contained"
          startIcon={<AddIcon />}
          style={buttonStyle}
        >
          New
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          style={buttonStyle}
        >
          Save
        </Button>
        <Button
          variant="contained"
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
          onClick={action}
          variant="contained"
          startIcon={<CloseIcon />}
          style={buttonStyle}
        >
          Close
        </Button>
      </Stack>
      <MDBCard
        className="text-center "
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
      >
        <MDBCardHeader>
          <MDBTabs className="card-header-tabs">
            <MDBTabsItem>
              <MDBTabsLink
                active={activeTab === 0}
                onClick={() => handleTabClick(0)}
              >
                Main
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                active={activeTab === 1}
                onClick={() => handleTabClick(1)}
              >
                Attachments
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCardHeader>
        <MDBCardBody>
          {activeTab === 0 ? (
            <FormContent
              header={header}
              receiveData={receiveDataFromChild}
              headerFeilds={headerFeilds}
            />
          ) : null}
        </MDBCardBody>
      </MDBCard>
      <BodyTable tableData={body} />
      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
