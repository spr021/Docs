import { styled } from "@mui/material/styles"
import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, Button } from "@mui/material"
import { useNavigate, useMatch } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { RichTextReadOnly } from "mui-tiptap"
import useExtensions from "../components/useExtentions"
import { getDatabase, onValue, ref } from "firebase/database"

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

export default function Doc() {
  const navigate = useNavigate()
  const extensions = useExtensions()
  const match = useMatch("docs/*")
  const id = match.params["*"]
  const [data, setData] = useState("")

  useEffect(() => {
    const database = getDatabase()
    onValue(
      ref(database, "docs/" + id),
      (snapshot) => {
        setData(snapshot.val())
      },
      {
        onlyOnce: true,
      }
    )
  }, [id])

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
          <IconButton
            onClick={() => navigate("/")}
            sx={{ mr: (theme) => theme.spacing(2) }}
            color="inherit"
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
          <Title variant="h6" noWrap>
            {window.location.pathname.split("/")[2]}
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
        <RichTextReadOnly content={data.data} extensions={extensions} />
        <div style={{ width: 100, height: 50 }}></div>
      </Box>
    </Box>
  )
}
