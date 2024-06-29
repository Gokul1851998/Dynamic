import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import AutoCompleteCo from "../AutoComplete/AutoCompleteCo";

const FormContent = ({ header, receiveData, headerFields }) => {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (header) {
      const formatDate = (dateString) => {
        const dateParts = dateString?.split("-");
        if (dateParts?.length === 3) {
          const [day, month, year] = dateParts;
          return `${year}-${month}-${day}`;
        } else {
          const dateObject = new Date(dateString);
          if (!isNaN(dateObject.getTime())) {
            return dateString;
          } else {
            return "";
          }
        }
      };

      const initialData = {};
      headerFields.forEach((field) => {
        if (field.iDataType === 3) {
          initialData[field.sFieldName] = formatDate(header[field.sFieldName]) || "";
        } else {
          initialData[field.sFieldName] = header[field.sFieldName] || "";
        }
      });
      setFormData(initialData);

    } else {
      setFormData({});
    }
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
        {headerFields.map((field, index) => (
          <MDBCol key={index} lg="3" md="4" sm="6" xs="12">
            <div className="mb-3">
              {field.iDataType === 3 ? (
                <MDBInput
                  id={`form3Example${index + 1}`}
                  label={field.sFieldCaption}
                  type="date"
                  size="small"
                  value={formData[field.sFieldName] || ""}
                  onChange={(e) => handleInputChange(e, field.sFieldName)}
                />
              ) : field.iDataType === 5 || field.iDataType === 6 ? (
                <AutoCompleteCo
                  iTag={field.iLinkTag}
                  iUser={localStorage.getItem("userId")}
                  value={field.sFieldCaption}
                  inputValue={formData[field.sFieldName]}
                  onInputChange={(value) => handleInputChange({ target: { value } }, field.sFieldName)}
                />
              ) : (
                <MDBInput
                  size="small"
                  id={`form3Example${index + 1}`}
                  label={field.sFieldCaption}
                  type={field.iDataType === 1 || field.iDataType === 4 || field.iDataType === 8 ? "number" : "text"}
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
