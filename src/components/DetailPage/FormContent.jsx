import React, { useEffect, useState } from "react";
import { MDBInput, MDBCol, MDBRow } from "mdb-react-ui-kit";
import AutoCompleteCo from "../AutoComplete/AutoCompleteCo";

const FormContent = ({ header, receiveData, headerFields }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    headerFields.forEach((field) => {
      initialData[field.sFieldName] = header[0][field.sFieldName] || "";
    });
    setFormData(initialData);
  }, [header, headerFields]);

  useEffect(() => {
    receiveData(formData);
  }, [formData, receiveData]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  return (
    <form>
      <MDBRow>
        {headerFields.filter(field => field.bVisible).map((field, index) => (
          <MDBCol key={index} lg="3" md="4" sm="6" xs="12">
            <div className="mb-3">
              {field.iDataType === 3 ? (
                <MDBInput
                  id={`form3Example${index + 1}`}
                  label={field.sFieldCaption}
                  type="date"
                  readOnly={field.bReadOnly}
                  size="small"
                  value={formData[field.sFieldName] || ""}
                  onChange={(e) => handleInputChange(e, field.sFieldName)}
                />
              ) : field.iDataType === 5 || field.iDataType === 6 ? (
                <AutoCompleteCo
                  iTag={field.iLinkTag}
                  iUser={localStorage.getItem("userId")}
                  label={field.sFieldCaption}
                  fieldName={field.sFieldName}
                  value={formData}
                  inputValue={setFormData}
                />
              ) : (
                <MDBInput
                  readOnly={field.bReadOnly}
                  size="small"
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
                  value={formData[field.sFieldName] || ""}
                  onChange={(e) => handleInputChange(e, field.sFieldName)}
                />
              )}
            </div>
          </MDBCol>
        ))}
      </MDBRow>
    </form>
  );
};

export default FormContent;
