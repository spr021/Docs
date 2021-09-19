import React, { useEffect, useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { alpha, makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import firebase from '../../firebase'
import { Avatar, Badge, Button, Grid, Paper, TextField } from '@material-ui/core'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
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
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
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
  input: {
    display: 'none',
  },
  inputRoot: {
    color: 'inherit',
  },
  avatar: {
    width: 100,
    height: 100
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

export default function Profile() {
  const classes = useStyles()
  const history = useHistory()
  const [displayName, setDisplayName] = useState({
    value: "",
    error: false
  })
  const [photoURL, setPhotoURL] = useState({
    mainState: "initial",
    imageUploaded: 0,
    selectedFile: null
  })
  const auth = firebase.auth()

  const signOut = () => {
    auth.signOut().then(() => {
      history.push("/login")
    }).catch((error) => {
      alert(
        `signOut in fail :(.`
      )
    })
  }

  const handleUploadClick = event => {
    const reader = new FileReader()

    reader.onloadend = () => {
      setPhotoURL({...photoURL, selectedFile: [reader.result]})
    }

    setPhotoURL({
      mainState: "uploaded",
      selectedFile: URL.createObjectURL(event.target.files[0]),
      imageUploaded: 1
    })
    firebase.storage().ref(`users/${auth.currentUser.uid}/profile.jpg`).put(event.target.files[0])
    .then(() => {
      if (auth.currentUser.displayName && auth.currentUser.photoURL) {
        history.push("/")
      }
    })
    .catch((error) => {
      //error
    })
  }

  const save = () => {
    if(displayName.value) {
      setDisplayName({...displayName, error: false})
      auth.currentUser.updateProfile({
        displayName: displayName.value,
        photoURL: firebase.storage().ref(`users/${auth.currentUser.uid}/profile.jpg`).fullPath
      })
      .then(() => {
        if (auth.currentUser.displayName && auth.currentUser.photoURL) {
          history.push("/")
        }
      })
      .catch((error) => {
          // An error happened.
      });
    } else {
      setDisplayName({...displayName, error: true})
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push("/login")
      }
    })
  },[auth, history])

  const badgeContent = (<>
    <input onChange={handleUploadClick} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
    <label htmlFor="icon-button-file">
      <IconButton color="primary" aria-label="upload picture" component="span">
        <AddPhotoAlternateIcon />
      </IconButton>
    </label>  
  </>)

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
            Completing your profile
          </Typography>
          <Button onClick={signOut} color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField error={displayName.error} onBlur={save} onChange={(e) => setDisplayName({...displayName, value: e.target.value})} variant="outlined" required  label="Full name" fullWidth autoComplete="cc-name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Badge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                badgeContent={badgeContent}
              >
                <Avatar variant="rounded" className={classes.avatar} alt={displayName.value} src={photoURL.selectedFile} />
              </Badge>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </div>
  )
}
