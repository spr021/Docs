import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import {
  Avatar,
  Badge,
  Button,
  Grid,
  Paper,
  TextField,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
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
  input: {
    display: "none",
  },
  inputRoot: {
    color: "inherit",
  },
  avatar: {
    width: 100,
    height: 100,
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function Profile() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState({
    value: "",
    error: false,
  })
  const [photoURL, setPhotoURL] = useState({
    mainState: "initial",
    imageUploaded: 0,
    selectedFile: null,
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

  const handleUploadClick = (event) => {
    const auth = getAuth()
    const database = getDatabase()
    const reader = new FileReader()

    reader.onloadend = () => {
      setPhotoURL({ ...photoURL, selectedFile: [reader.result] })
    }

    setPhotoURL({
      mainState: "uploaded",
      selectedFile: URL.createObjectURL(event.target.files[0]),
      imageUploaded: 1,
    })
    console.log("DDDD", event.target.files[0])
    set(ref(database, `users/${auth.currentUser.uid}`), {
      profile_picture: event.target.files[0],
    })
      .then(() => {
        if (auth.currentUser.displayName && auth.currentUser.photoURL) {
          navigate("/")
        }
      })
      .catch((error) => {
        //error
      })
  }

  const save = () => {
    const auth = getAuth()
    const database = getDatabase()
    if (displayName.value) {
      setDisplayName({ ...displayName, error: false })
      updateProfile(auth.currentUser, {
        displayName: displayName.value,
        photoURL: ref(database, `users/${auth.currentUser.uid}/profile.jpg`)
          .fullPath,
      })
        .then(() => {
          if (auth.currentUser.displayName && auth.currentUser.photoURL) {
            navigate("/")
          }
        })
        .catch((error) => {
          // An error happened.
        })
    } else {
      setDisplayName({ ...displayName, error: true })
    }
  }
  const auth = getAuth()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/sign-in")
      }
    })
  }, [auth, navigate])

  const badgeContent = (
    <>
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
    </>
  )

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
            Completing your profile
          </Typography>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Grid container spacing={3} justifyContent="space-around">
            <Grid item xs={12} md={6}>
              <TextField
                error={displayName.error}
                onChange={(e) =>
                  setDisplayName({ ...displayName, value: e.target.value })
                }
                variant="outlined"
                required
                label="Full name"
                fullWidth
                autoComplete="cc-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Badge
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                badgeContent={badgeContent}
              >
                <Avatar
                  variant="rounded"
                  className={classes.avatar}
                  alt={displayName.value}
                  src={photoURL.selectedFile}
                />
              </Badge>
            </Grid>
          </Grid>
          <Button
            onClick={save}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Confirm
          </Button>
        </Paper>
      </main>
    </div>
  );
}
