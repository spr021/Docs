import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import InputBase from "@mui/material/InputBase"
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { Avatar, Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Doc from "../components/Doc"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getDatabase, onValue, ref } from "firebase/database"
import { getDownloadURL, getStorage, ref as reff } from "firebase/storage";

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

export default function Home() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [user, setUser] = useState({
    displayName: "",
  })

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

  useEffect(() => {
    const auth = getAuth()
    const database = getDatabase()
    const storage = getStorage();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        getDownloadURL(reff(storage, user.photoURL))
          .then(img => {
            setUser({ ...user, photoURL: img })
          })
        const value = ref(database, "docs")
        onValue(value, (snapshot) => {
          const objects = snapshot.val()
          const objectList = []
          for (let item in objects) {
            objectList.push(objects[item])
          }
          setDocs(objectList)
        })
      } else {
        navigate("/sign-in")
      }
    })
  }, [navigate])

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
          <Avatar
            className={classes.menuButton}
            alt={user.displayName}
            src={user.photoURL}
          />
          <Typography className={classes.title} variant="h6" noWrap>
            {user.displayName}
          </Typography>
          <IconButton
            onClick={() => navigate("/new")}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            size="large">
            <AddIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
      >
        {docs.map((doc) => (
          <Doc key={doc.title} data={doc} />
        ))}
      </Box>
    </div>
  );
}
