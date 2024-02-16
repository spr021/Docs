import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Doc from "../components/Doc"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getDatabase, onValue, ref } from "firebase/database"
import { getDownloadURL, getStorage, ref as reff } from "firebase/storage"
import SeachBox from "../components/SearchBox"
import Profile from "../components/Profile"

export default function Home() {
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
    const storage = getStorage()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        getDownloadURL(reff(storage, user.photoURL)).then((img) => {
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
          <Profile user={user} />
          <IconButton
            onClick={() => navigate("/new")}
            edge="start"
            sx={{ mr: (theme) => theme.spacing(2) }}
            color="inherit"
            aria-label="open drawer"
            size="large"
          >
            <AddIcon />
          </IconButton>
          <SeachBox />
          <Button onClick={sign_Out} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {docs.map((doc) => (
          <Doc key={doc.title} data={doc} />
        ))}
      </Container>
    </Box>
  )
}
