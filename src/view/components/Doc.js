import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router';
import firebase from '../../firebase'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: 16,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  discription: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Doc(props) {
  const classes = useStyles();
  const history = useHistory();
  const [avatar, setAvatar] = useState()

  const openCard = () => {
    history.push(`/doc/${props.data.title}?data=${props.data.data}`);
  }

  const removeOnClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    firebase.storage().ref(props.data.avatar).getDownloadURL()
    .then(img => {
      setAvatar(img)
    })
  },[props.data.avatar])

  return (
    <Card onClick={openCard} className={classes.root}>
      <CardHeader
        avatar={
          <Tooltip onClick={removeOnClick} title={props.data.author} placement="top" arrow>
            <Avatar alt={props.data.author} src={avatar} aria-label="recipe" className={classes.avatar} />
          </Tooltip>
        }
        action={
          <IconButton onClick={removeOnClick} aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.data.title}
        subheader={props.data.date}
      />
      <CardMedia
        className={classes.media}
        image={props.data.cover}
        title={props.data.title}
      />
      <CardContent>
        <Typography className={classes.discription} variant="body2" color="textSecondary" component="p">
          {JSON.parse(props.data.data).blocks[0].text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={removeOnClick} aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={removeOnClick} aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
