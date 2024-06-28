import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
} from "mdb-react-ui-kit";
import { Button, Stack } from "@mui/material";
import {
  getDocSettings,
  getTransactionDetails,
} from "../../api/ApiCall";
import FormContent from "./FormContent";
import BodyTable from "./BodyTable";
import Loader from "../Loader/Loader";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

const buttonStyle = {
  textTransform: "none",
  color: "#FFFFFF",
  backgroundColor: "#7581c6",
};

const groupFieldsByTab = (fields) => {
  return fields.reduce((acc, field) => {
    if (!acc[field.sTab]) {
      acc[field.sTab] = [];
    }
    acc[field.sTab].push(field);
    return acc;
  }, {});
};

const DetailPage = ({ iUser, iDocType, iTransId, action }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [header, setHeader] = useState();
  const [body, setBody] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [groupedFields, setGroupedFields] = useState({});
  const [tabs, setTabs] = useState([]);
  const [open, setOpen] = useState(false);
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
      const response = await getDocSettings({ iDoctype: 14 });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setHeaderFields(myObject?.Header);
        const grouped = groupFieldsByTab(myObject?.Header);
        setGroupedFields(grouped);
        setTabs(Object.keys(grouped));
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

  const handleClear = () => {
    setHeader([]);
    setBody([]);
  };

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
        className="text-center"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
      >
        <MDBCardHeader>
          <MDBTabs className="card-header-tabs">
            {tabs.map((tab, index) => (
              <MDBTabsItem key={index}>
                <MDBTabsLink
                  active={activeTab === index}
                  onClick={() => handleTabClick(index)}
                >
                  {tab}
                </MDBTabsLink>
              </MDBTabsItem>
            ))}
          </MDBTabs>
        </MDBCardHeader>
        <MDBCardBody>
          {tabs.length > 0 && (
            <FormContent
              header={header}
              receiveData={receiveDataFromChild}
              headerFields={groupedFields[tabs[activeTab]]}
            />
          )}
        </MDBCardBody>
      </MDBCard>
      <BodyTable tableData={body} />
      <Loader open={open} handleClose={handleClose} />
    </>
  );
};

export default DetailPage;
