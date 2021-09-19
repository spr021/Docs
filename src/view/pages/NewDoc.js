import MUIRichTextEditor from "mui-rte"
import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { alpha, makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import firebase from '../../firebase'
import { Box, Button, TextField } from '@material-ui/core'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  text: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 100px"
  },
  cover: {
    display: "flex",
    justifyContent: "center",
    padding: 16,
    alignItems: "center"
  },
  input: {
    display: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 20,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

export default function NewDoc() {
  const classes = useStyles()
  const history = useHistory()
  const user = firebase.auth().currentUser
  const [title, setTitle] = useState({text: "", error: false})
  const [cover, setCover] = useState({
    mainState: "initial",
    imageUploaded: 0,
    selectedFile: null
  })

  const handleUploadClick = event => {
    const reader = new FileReader()

    reader.onloadend = () => {
      setCover({...cover, selectedFile: [reader.result]})
    }

    setCover({
      mainState: "uploaded",
      selectedFile: event.target.files[0],
      imageUploaded: 1
    })
  }

  const save = (data) => {
    if(title.text !== "" && data) {
      const ref = firebase.database().ref("docs")
      const doc = {
        author: user.displayName,
        avatar: user.photoURL,
        title: title.text,
        date: new Date().toDateString(),
        cover: cover.selectedFile,
        data
      }
      ref.push(doc)
      history.push(`/doc/${title.text}?data=${data}`)
    } else {
      setTitle({...title, error: true})
    }
  }

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      history.push("/login")
    }).catch((error) => {
      alert(
        `signOut in fail :(.`
      )
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
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography>
          <Button onClick={signOut} color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.text}>
        <Box className={classes.cover} display="flex" justifyContent="center">
        <TextField error={title.error} required onChange={(e) => setTitle({...title, text: e.target.value})} label="Title" variant="outlined" />
        <input onChange={handleUploadClick} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <AddPhotoAlternateIcon />
          </IconButton>
        </label>
        </Box>
        <MUIRichTextEditor
          label={title.error ? "This field is required !!!!" : "Type something here..."}
          onSave={save}
          inlineToolbar={true}
        />
      </Box>
    </div>
  )
}

