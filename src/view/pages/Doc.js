import MUIRichTextEditor from "mui-rte"
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { alpha, makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import firebase from '../../firebase'
import { Box, Button } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router'

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

export default function Doc() {
  const classes = useStyles()
  const history = useHistory()
  let data = new URLSearchParams(useLocation().search).get("data")

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
          <IconButton onClick={() => history.push("/")} className={classes.menuButton} color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {window.location.pathname.split('/')[2]}
          </Typography>
          <Button onClick={signOut} color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.text}>
        <MUIRichTextEditor
          defaultValue={data}
          readOnly={true}
        />
        <div style={{width: 100, height: 50}}></div>
      </Box>
    </div>
  )
}

