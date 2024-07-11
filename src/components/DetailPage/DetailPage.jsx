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
  getMainSettings,
  getPrev_Next_Top_DocNo,
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
import Footer from "./Footer";

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

const DetailPage = ({ iUser, details, iTransId, action, iDocType }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [header, setHeader] = useState([]);
  const [body, setBody] = useState([]);
  const [bodyFields, setBodyFields] = useState([]);
  const [bodySettings, setBodySettings] = useState({});
  const [groupedFields, setGroupedFields] = useState({});
  const [slNoSetting, setSlNoSettings] = useState({});
  const [allDoc, setAllDoc] = useState([])
  const [tabs, setTabs] = useState([]);
  const [open, setOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [getTableData, setGetTableData] = useState([])

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
      const response = await getDocSettings({ iDoctype: details?.iDocType });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setAllDoc(myObject)
        setBodyFields(myObject?.Body);
        const grouped = groupFieldsByTab(myObject?.Header);
        setGroupedFields(grouped);
        setTabs(Object.keys(grouped));
      }
      const response2 = await getMainSettings();
      if (response2?.Status === "Success") {
        const myObject = JSON.parse(response2?.ResultData);
        setSlNoSettings(myObject.RMA[0]);
        setBodySettings(myObject.Batch[0]);
      }
    };
    fetchData();
  }, [details]);

  useEffect(() => {
    const fetchData = async () => {
      if (iTransId !== 0) {
        handleOpen();
        const response = await getTransactionDetails({
          iUser,
          iDocType: details?.iDocType,
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
        let response2 = await getPrev_Next_Top_DocNo({iTransID:0,iType:1,iDocType:iDocType})
        setHeader(response2?.Table);
      }
    };
    fetchData();
  }, [iUser, iTransId]);

  const receiveDataFromChild = (data) => {
    setChildData(data);
  };

  const handleSave = () => {};

  const handleClear = () => {
    setHeader([]);
    setBody([]);
  };

  const handleGetTableData = (data)=>{
    setGetTableData(data)
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
        className="text-center"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1, borderRadius:2 }}
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
      <BodyTable
        tableData={body}
        bodyFields={bodyFields}
        bodySettings={bodySettings}
        slNoSetting={slNoSetting}
        allDoc={allDoc}
        handleGetTableData={handleGetTableData}
      />
      <Footer allDoc={allDoc} getTableData={getTableData} />
      <Loader open={open} handleClose={handleClose} />
    </>
  );
};

export default DetailPage;
