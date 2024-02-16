import React, { useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  Input,
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

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

const Main = styled(Box)(({ theme }) => ({
  width: "auto",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  [theme.breakpoints.up(600)]: {
    width: 600,
    marginLeft: "auto",
    marginRight: "auto",
  },
  "& .MuiPaper-root": {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}))

export default function Profile() {
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
      <Input
        inputProps={{ "aria-label": "upload picture", accept: "image/*" }}
        sx={{ display: "none" }}
        onChange={handleUploadClick}
        id="icon-button-file"
        type="file"
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          size="large"
        >
          <AddPhotoAlternateIcon />
        </IconButton>
      </label>
    </>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ mr: (theme) => theme.spacing(2) }}
            color="inherit"
            aria-label="open drawer"
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Title variant="h6" noWrap>
            Completing your profile
          </Title>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Main component={"main"}>
        <Paper>
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
                  sx={{ width: 100, height: 100 }}
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
            sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
          >
            Confirm
          </Button>
        </Paper>
      </Main>
    </Box>
  )
}
