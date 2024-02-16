import MUIRichTextEditor from "mui-rte"
import { styled } from "@mui/material/styles"
import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, Button } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

export default function Doc() {
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
        <MUIRichTextEditor defaultValue={data} readOnly={true} />
        <div style={{ width: 100, height: 50 }}></div>
      </Box>
    </Box>
  )
}
