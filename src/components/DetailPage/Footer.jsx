import { MDBCard, MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import AutoCompleteCo from "../AutoComplete/AutoCompleteCo";
import { Typography, Box } from "@mui/material";

export default function Footer({ allDoc, getTableData }) {
  const [formData, setFormData] = useState([]);
  const [totals, setTotals] = useState([])

  const fetchData = async () => {
    // Initialize initialData
    let initialData = {};
    allDoc?.Table8?.forEach((field) => {
      initialData[field.sFieldName] = "";
    });

    setFormData([initialData]);
  };

  useEffect(() => {
    fetchData();
  }, [allDoc]);

  const handleChange = (value, field) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[0][field] = value;
      return updatedFormData;
    });
  };

  useEffect(() => {
    if (!allDoc.Inputs) return;
  
    // Identify which fields from the Inputs are to be totalled (those with bFooter true)
    const footerFields = allDoc.Inputs
      .filter(input => input.bFooter)
      .map(input => ({
        field: `output${input.iInvVar}`, // Assumes fields are dynamically named like 'output1', 'output2', etc.
        name: input.sName
      }));
  
    // Initial totals object with all footer fields set to 0
    const initialTotals = footerFields.reduce((acc, field) => {
      acc[field.name] = 0;
      return acc;
    }, {});
  
    // Calculate totals from tableData
    const totals = getTableData.reduce((acc, row) => {
      footerFields.forEach(field => {
        if (row[field.field] !== undefined && !isNaN(parseFloat(row[field.field]))) {
          acc[field.name] += parseFloat(row[field.field]);
        }
      });
      return acc;
    }, initialTotals);
  
    setTotals(totals);
  
  }, [getTableData, allDoc.Inputs]);

  console.log(allDoc);

  const renderTotals = () => {
    return Object.entries(totals).map(([key, value]) => (
          <Typography key={key} variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: "gray" }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}: {formatNumber(value)}
        </Typography>
    ));
  };
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };
  

  return (
    <MDBCard
      className="text-center"
      style={{
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        zIndex: 1,
        borderRadius: 2,
        marginTop: 10,
      }}
    >
      <MDBRow style={{ padding: 10 }}>
        {allDoc?.Table8?.filter((field) => field.bVisible).map((field, index) => (
          <MDBCol key={index} lg="3" md="4" sm="6" xs="12">
            <div className="mb-3">
              {field.iDataType === 3 ? (
                <MDBInput
                  id={`form3Example${index + 1}`}
                  label={field.sFieldCaption}
                  type="date"
                  readOnly={field.bReadOnly}
                  size="small"
                  autoComplete="off"
                  value={formData[0][field.sFieldName] || ""}
                  onChange={(e) => handleChange(e.target.value, field.sFieldName)}
                />
              ) : field.iDataType === 5 || field.iDataType === 6 ? (
                <AutoCompleteCo
                  iTag={field.iLinkTag}
                  iUser={localStorage.getItem("userId")}
                  label={field.sFieldCaption}
                  fieldName={field.sFieldName}
                />
              ) : (
                <MDBInput
                  readOnly={field.bReadOnly}
                  size="small"
                  autoComplete="off"
                  id={`form3Example${index + 1}`}
                  maxLength={field.iMaxSize}
                  label={field.sFieldCaption}
                  type={
                    field.iDataType === 1 ||
                    field.iDataType === 4 ||
                    field.iDataType === 8
                      ? "number"
                      : "text"
                  }
                  value={formData[0][field.sFieldName] || ""}
                  onChange={(e) => handleChange(e.target.value, field.sFieldName)}
                />
              )}
            </div>
          </MDBCol>
        ))}
      </MDBRow>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="10px 20px">
      {renderTotals()}

      </Box>
    </MDBCard>
  );
}
