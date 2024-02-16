import MUIRichTextEditor from "mui-rte"
import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, Button } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  text: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 100px",
  },
  input: {
    display: "none",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 20,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}))

export default function Doc() {
  const classes = useStyles()
  const navigate = useNavigate()
  let data = new URLSearchParams(useLocation().search).get("data")

  const sign_Out = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        navigate("/sign-in")
      })
      .catch((error) => {
        alert(`signOut in fail :(.`)
      })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            size="large">
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate("/")}
            className={classes.menuButton}
            color="inherit"
            size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {window.location.pathname.split("/")[2]}
          </Typography>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.text}>
        <MUIRichTextEditor defaultValue={data} readOnly={true} />
        <div style={{ width: 100, height: 50 }}></div>
      </Box>
    </div>
  );
}
