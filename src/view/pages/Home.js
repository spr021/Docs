import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import firebase from '../../firebase';
import { Avatar, Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import Doc from '../components/Doc';

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
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();
  const [docs, setDocs] = useState([])
  const [user, setUser] = useState({
    displayName: ""
  })
  const [avatar, setAvatar] = useState()

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      history.push("/login");
    }).catch((error) => {
      alert(
        `signOut in fail :(.`
      );
    });
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        firebase.storage().ref(user.photoURL).getDownloadURL()
          .then(img => {
            setAvatar(img)
          })
        firebase.database().ref("docs").on("value", (snapshot) => {
          const objects = snapshot.val()
          const objectList = []
          for(let item in objects) {
            objectList.push(objects[item])
          }
          setDocs(objectList)
        })
      } else {
        history.push("/login");
      }
    });
  },[history])

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
          <Avatar className={classes.menuButton} alt={user.displayName} src={avatar} />
          <Typography className={classes.title} variant="h6" noWrap>
            {user.displayName}
          </Typography>
          <IconButton
            onClick={() => history.push("/new")}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <AddIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button onClick={signOut} color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
        {docs.map(doc => (
          <Doc key={doc.title} data={doc} />
        ))}
      </Box>
    </div>
  );
}
