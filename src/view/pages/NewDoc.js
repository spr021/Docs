import { styled } from "@mui/material/styles"
import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, push, ref, set } from "firebase/database"
import Editor from "../components/Editor"
import Preview from "../components/Preview"
import { getStorage, ref as reff, uploadBytes } from "firebase/storage"

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

export default function NewDoc() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [docText, setDocText] = useState("")
  const [title, setTitle] = useState({ text: "", error: false })
  const [cover, setCover] = useState({
    mainState: "initial",
    imageUploaded: 0,
    selectedFile: null,
    preview: null,
    alt: "",
    error: false,
  })
  const [step, setStep] = useState(1)

  const nextStep = () => {
    setStep(step + 1)
  }

  const save = () => {
    const database = getDatabase()
    const storage = getStorage()
    const user = auth.currentUser
    if (title.text !== "") {
      const docsListRef = ref(database, "docs")
      const newDocRef = push(docsListRef)
      const storageRef = reff(storage, `docs-media/${newDocRef.key}/cover.jpg`)
      set(newDocRef, {
        author: user.displayName,
        avatar: user.photoURL,
        title: title.text,
        date: new Date().getTime(),
        cover: cover.selectedFile ? storageRef.fullPath : "",
        alt: cover.alt,
        data: docText,
      }).then(() => {
        if (cover.selectedFile) {
          uploadBytes(storageRef, cover.selectedFile)
        }
        navigate(`/docs/${newDocRef.key}`)
      })
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
        {step === 1 ? (
          <Editor setDocText={setDocText} nextStep={nextStep} />
        ) : (
          <Preview
            onSave={save}
            title={title}
            setTitle={setTitle}
            cover={cover}
            setCover={setCover}
            user={auth.currentUser}
          />
        )}
      </Box>
    </Box>
  )
}
