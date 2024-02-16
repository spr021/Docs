import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { red } from "@mui/material/colors"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Tooltip } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getDownloadURL, getStorage, ref } from "firebase/storage"

export default function Doc(props) {
  const [avatar, setAvatar] = useState("")
  const navigate = useNavigate()
  const storage = getStorage()

  const openCard = () => {
    navigate(`/doc/${props.data.title}?data=${props.data.data}`)
  }

  const removeOnClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    getDownloadURL(ref(storage, props.data.avatar))
      .then((img) => {
        setAvatar(img)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [props.data.avatar, storage])

  return (
    <Card onClick={openCard} sx={{ maxWidth: 345, margin: "16px" }}>
      <CardHeader
        avatar={
          <Tooltip
            onClick={removeOnClick}
            title={props.data.author}
            placement="top"
            arrow
          >
            <Avatar
              alt={props.data.author}
              src={avatar}
              aria-label="recipe"
              sx={{ backgroundColor: red[500] }}
            />
          </Tooltip>
        }
        action={
          <IconButton
            onClick={removeOnClick}
            aria-label="settings"
            size="large"
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={props.data.title}
        subheader={props.data.date}
      />
      <CardMedia
        sx={{
          height: 0,
          paddingTop: "56.25%",
          // 16:9
        }}
        image={props.data.cover}
        title={props.data.title}
      />
      <CardContent>
        <Typography
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {JSON.parse(props.data.data).blocks[0].text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={removeOnClick}
          aria-label="add to favorites"
          size="large"
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={removeOnClick} aria-label="share" size="large">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
