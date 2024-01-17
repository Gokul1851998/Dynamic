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
import { Box } from "@mui/material";
import { getTransactionSummary } from "../../api/ApiCall";

const FormContent = () => {
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

  const [formData, setFormData] = useState({});

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };
  


  return (
    <form>
      <MDBRow >
      {formFields.map((label, index) => (
          <MDBCol key={index} lg="3" md="4" sm="6" xs="12">
            {label === "Date" || label === "Duedate" ? (
              <MDBInput
                id={`form3Example${index + 1}`}
                label={label}
                type="date"
                className="m-1"
                value={formData[label] || ""}
                onChange={(e) => handleInputChange(e, label)}
              />
            ) : (
              <MDBInput
                id={`form3Example${index + 1}`}
                label={label}
                className="m-1"
                value={formData[label] || ""}
                onChange={(e) => handleInputChange(e, label)}
              />
            )}
          </MDBCol>
        ))}
         <MDBCol  className="m-2"  lg="2" md="3" sm="" xs="12">
          <MDBCheckbox  name="flexCheck" value="" id="flexCheckDefault" label="Update Stock" />
        </MDBCol>
        <MDBCol  className="m-2"  lg="2" md="3" sm="6" xs="12">
          <MDBCheckbox
            name="flexCheck"
            value=""
            id="flexCheckChecked"
            label="Update Receipt"
            defaultChecked
          />
        </MDBCol>
      </MDBRow>
   
    </form>
  );
};

export default function App() {
  const iUser = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
 
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await getTransactionSummary({iUser,iTransId:1})
      console.log(response);
    }
    fetchData()
  },[])

  return (
    <>
      <Header />
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
          padding:3,
          zIndex: 1,
        }}
      >
      <MDBCard className="text-center " style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',zIndex: 1, }}>
        <MDBCardHeader>
          <MDBTabs className="card-header-tabs">
            <MDBTabsItem>
              <MDBTabsLink active={activeTab === 0} onClick={() => handleTabClick(0)}>
                Active
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink active={activeTab === 1} onClick={() => handleTabClick(1)}>
                Link
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCardHeader>
        <MDBCardBody >
          {activeTab === 0 ? <FormContent /> : null}
     
        </MDBCardBody>
      </MDBCard>
      <DetailGrid/>
      </Box>
      </Box>
    </>
  );
}
