import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import sang_logo from "../../assets/sangsolution.png";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { getMainSettings, getMenu } from "../../api/ApiCall";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const iUser = localStorage.getItem("userId");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setMenu] = React.useState([]);
  const [menuId, setMenuId] = React.useState(0)
  React.useEffect(() => {
    const fetchData = async () => {
       const response2 = await getMainSettings()
      const response = await getMenu({ iUser });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setMenu(myObject.Table);
      }
    };
    fetchData();
  }, [iUser]);

  const handleProductClick = (e) => {
    e.preventDefault();
    navigate("/product");
  };

  const handleMenuList = () => {
    setAnchorEl(null);
  };

  const handleSubMenu = (event,Id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(Id)
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onClickLog = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleTransaction = () => {
    navigate("/Transaction");
  };

  const handleClickEvent =async(menu)=>{
    navigate('/summary',{state:menu?.iDoctype})
    handleMenuList()
  }
  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#8c99e0",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)", // Changed the vertical offset to 5px
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              alt="Logo"
              src="http://103.120.178.195:82/Sang_solutions/assets/images/sang_logo.png"
              sx={{ mr: 2, width: 60, height: 60 }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                  {menu &&
                menu
                  .filter((menuList) => menuList.iParentId === 0)
                  .map((menuList, index) => (
                    <MenuItem key={menuList.iId} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{menuList.sName}</Typography>
                </MenuItem>
                  ))}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              {menu &&
                menu
                  .filter((menuList) => menuList.iParentId === 0)
                  .map((menuList, index) => (
                    <Button
                    key={menuList.iId}
                      aria-controls="master-menu"
                      aria-haspopup="true"
                      onClick={(e)=>handleSubMenu(e,menuList.iId)}
                      variant="#00498E"
                      sx={{
                        mr: 0,
                        bgcolor: "#8c99e0",
                        color: "white",
                      }}
                    >
                      {menuList.sName}
                    </Button>
                  ))}

              <Menu
                id="master-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuList}
              >
                {menu &&
                menu
                  .filter((menuList) => menuList.iParentId === menuId)
                  .map((menuList, index) => (
                    <MenuItem key={menuList.iId} onClick={()=>handleClickEvent(menuList)} >{menuList.sName}</MenuItem>
                  ))}
              
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <SettingsIcon sx={{ marginRight: "20px" }} />
              <PowerSettingsNewIcon
                sx={{ marginRight: "20px" }}
                onClick={onClickLog}
              />
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar>{userName}</Avatar>
                  </Stack>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Header;
