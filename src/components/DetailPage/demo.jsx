const cellstyle = {
  padding: "0px 0px",
  height: "40px",
  border: "1px solid rgba(224, 224, 224, 1)",
  backgroundColor: "rgb(140, 153, 224)",
  cursor: isClickable ? "pointer" : "default",
  cursor: isClickable ? "pointer" : "default",
  transition: "all 0.3s ease",
  position: "relative", // Required for pseudo-elements to position correctly
  "&:hover": {
    boxShadow: isClickable ? "0px 4px 15px rgba(0, 0, 0, 0.2)" : "none",
    transform: isClickable ? "translateY(-2px)" : "none",
    zIndex: isClickable ? 1 : "auto",
  },
  ...(isClickable && {
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      left: "1%", // Adjust as needed
      right: "1%", // Adjust as needed
      height: "1px",
      backgroundColor: "currentColor", // Matches the text color
    },
    "&::before": {
      top: "5px", // Adjust as needed for spacing above the text
    },
    "&::after": {
      bottom: "5px", // Adjust as needed for spacing below the text
    },
  }),
};

function EnhancedTableHead({
  handleBatchOpen,
  batchEnable,
  sLNoEnable,
  allDoc,
}) {
  console.log(allDoc.Inputs);
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
          style={{
            backgroundColor: "#8c99e0",
            position: "sticky",
            top: 0,
            zIndex: "5",
          }}
          padding="checkbox"
        ></TableCell>
        {allDoc?.Body?.map((header, index) => {
          const inputConfig = docSetting.Inputs.find(
            (input) => input.iInvVar == field.iInvVar
          );
          const isClickable = inputConfig?.bBifurcation ?? false;
          return (
            <>
              {header.iDataType === 10 ? (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  hidden={!batchEnable}
                >
                  {header.sFieldCaption}
                </TableCell>
              ) : header.iDataType === 11 ? (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  hidden={!sLNoEnable}
                >
                  {header.sFieldCaption}
                </TableCell>
              ) : header.sName === "Add Charges 1" ? (
                <TableCell
                  key={index}
                  sx={{ border: "1px solid #ddd", color: "#FFFF" }}
                  align="left"
                  padding="normal"
                  onClick={() => handleBatchOpen(index, 3)}
                >
                  {header.sFieldCaption}
                </TableCell>
              ) : (
                <TableCell
                  key={index}
                  sx={cellstyle}
                  align="left"
                  padding="normal"
                  onClick={() =>
                    isClickable && handleHeaderClick(field.sFieldName)
                  }
                >
                  {header.sFieldCaption}
                </TableCell>
              )}
            </>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
