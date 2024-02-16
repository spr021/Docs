import MUIRichTextEditor from "mui-rte"
import { styled } from "@mui/material/styles"
import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import { Box, Button, Input, TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, push, ref, set } from "firebase/database"

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

export default function NewDoc() {
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
            Material-UI
          </Title>
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 100px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: "16px",
            alignItems: "center",
          }}
          display="flex"
          justifyContent="center"
        >
          <TextField
            error={title.error}
            required
            onChange={(e) => setTitle({ ...title, text: e.target.value })}
            label="Title"
            variant="outlined"
          />
          <Input
            inputProps={{ accept: "image/*" }}
            onChange={handleUploadClick}
            sx={{ display: "none" }}
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
    </Box>
  )
}
