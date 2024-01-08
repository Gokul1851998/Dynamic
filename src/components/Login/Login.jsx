import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getLogin } from "../../api/ApiCall";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [sLoginName, setLoginName] = useState();
  const [sPassword, setSPassword] = useState();
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState()
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if email is not present or is falsy
    if (!sLoginName) {
      setEmail(true);
    } else {
      setEmail(false);
    }

    // Check if password is not present or is falsy
    if (!sPassword) {
      setPassword(true);
    } else {
      setPassword(false);
    }

    // If both email and password are present, proceed with the login call
    if (sPassword &&  sLoginName) {
      const response = await getLogin({
        sLoginName,
        sPassword,
        iType: 1,
      });
      if(response.Status === "Success"){
        const myObject = JSON.parse(response.ResultData)
        if(myObject[0]?.iId > 0){
          localStorage.setItem("userId", myObject[0]?.iId);
          localStorage.setItem("userName", myObject[0]?.sUserName);
          navigate("/home");
        }else{
          setMessage(`${myObject[0].UserExists}`);
          handleClick();
        }    
     
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          borderRadius={2}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              LOGIN
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
              error={email}
              onChange={(e) => setLoginName(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                helperText=""
                autoFocus
              />
              <TextField
                error={password}
                onChange={(e) => setSPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onKeyDown={handleKeyPress}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
    </ThemeProvider>
  );
}
