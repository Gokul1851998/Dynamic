import { MDBCard, MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import AutoCompleteCo from "../AutoComplete/AutoCompleteCo";
import { Typography, Box } from "@mui/material";

export default function Footer({ allDoc, getTableData }) {
  const [formData, setFormData] = useState([]);

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
    const totalQty = getTableData?.reduce((acc, curr) => acc + curr.fQty, 0);
    const totalGross = getTableData?.reduce((acc, curr) => acc + curr.fGross, 0);
    const totalLineNet = getTableData?.reduce((acc, curr) => acc + curr.lineNet, 0);
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[0].qty = totalQty;
      updatedFormData[0].gross = totalGross;
      updatedFormData[0].net = totalLineNet;
      return updatedFormData;
    });
  }, [getTableData]);

  console.log(getTableData);

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
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: "gray" }}>
          Tot Quantity: {formData[0]?.qty || 0}
        </Typography>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: "gray" }}>
          Tot Gross: {formData[0]?.gross || 0}
        </Typography>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: "gray" }}>
          Net Amount: {formData[0]?.net || 0}
        </Typography>
      </Box>
    </MDBCard>
  );
}
