import MUIRichTextEditor from "mui-rte"
import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import { Box, Button, TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, push, ref, set } from "firebase/database"

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
  cover: {
    display: "flex",
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
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

export default function NewDoc() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [title, setTitle] = useState({ text: "", error: false })
  const [cover, setCover] = useState({
    mainState: "initial",
    imageUploaded: 0,
    selectedFile: null,
  })

  const handleUploadClick = (event) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      setCover({ ...cover, selectedFile: [reader.result] })
    }

    setCover({
      mainState: "uploaded",
      selectedFile: event.target.files[0],
      imageUploaded: 1,
    })
    // i have to store in storage then set refrence to the database
  }

  const save = (data) => {
    const auth = getAuth()
    const database = getDatabase()
    const user = auth.currentUser
    if (title.text !== "" && data) {
      const docsList = ref(database, "docs")
      const newDoc = {
        author: user.displayName,
        avatar: user.photoURL,
        title: title.text,
        date: new Date().toDateString(),
        cover: cover.selectedFile,
        data,
      }
      set(push(docsList, newDoc))
      navigate(`/doc/${title.text}?data=${data}`)
    } else {
      setTitle({ ...title, error: true })
    }
  }

  const sign_Out = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        navigate("/sign-in")
      })
      .catch((error) => {
        alert(`sign_Out in fail :(.`)
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
          <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.text}>
        <Box className={classes.cover} display="flex" justifyContent="center">
          <TextField
            error={title.error}
            required
            onChange={(e) => setTitle({ ...title, text: e.target.value })}
            label="Title"
            variant="outlined"
          />
          <input
            onChange={handleUploadClick}
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span" size="large">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
        </Box>
        <MUIRichTextEditor
          label={
            title.error
              ? "This field is required !!!!"
              : "Type something here..."
          }
          onSave={save}
          inlineToolbar={true}
        />
      </Box>
    </div>
  );
}
