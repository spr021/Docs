import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import DocCard from "../components/DocCard"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getDatabase, onValue, ref } from "firebase/database"
import SeachBox from "../components/SearchBox"
import Profile from "../components/Profile"

export default function Home() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState("")
  const [docs, setDocs] = useState([])
  const [visibleDocs, setVisibleDocs] = useState([])
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        const value = ref(database, "docs")
        onValue(
          value,
          (snapshot) => {
            const objects = snapshot.val()
            const objectList = []
            Object.keys(objects).forEach((k) => (objects[k].id = k))
            for (let item in objects) {
              objectList.push(objects[item])
            }
            setDocs(objectList)
            setVisibleDocs(objectList)
          },
          {
            onlyOnce: true,
          }
        )
      } else {
        navigate("/sign-in")
      }
    })
  }, [navigate])

  useEffect(() => {
    setVisibleDocs(docs.filter((doc) => doc.title.toLowerCase().includes(searchText.toLowerCase())))
  },[searchText, docs])

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
          <SeachBox setSearchText={setSearchText} />
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
        {visibleDocs.map((doc) => (
          <DocCard key={doc.id} data={doc} />
        ))}
      </Container>
    </Box>
  )
}
