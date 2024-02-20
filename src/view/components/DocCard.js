import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardActions from "@mui/material/CardActions"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { red } from "@mui/material/colors"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Tooltip } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import Dayjs from "../../lib/dayjs/dayjs"

export default function DocCard({ data }) {
  const [avatar, setAvatar] = useState("")
  const [cover, setCover] = useState("")
  const navigate = useNavigate()
  const storage = getStorage()

  const openCard = () => {
    navigate(`/docs/${data.id}`)
  }

  const removeOnClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    getDownloadURL(ref(storage, data.avatar))
      .then((img) => {
        setAvatar(img)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [data.avatar, storage])

  useEffect(() => {
    if (data.cover) {
      getDownloadURL(ref(storage, data.cover))
        .then((img) => {
          setCover(img)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [data.cover, storage])

  return (
    <Card onClick={openCard} sx={{ maxWidth: 345, margin: "16px" }}>
      <CardHeader
        avatar={
          <Tooltip
            onClick={removeOnClick}
            title={data.author}
            placement="top"
            arrow
          >
            <Avatar
              alt={data.author}
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
        title={data.title}
        subheader={Dayjs(data.date).fromNow()}
      />
      <CardMedia
        sx={{
          height: 0,
          paddingTop: "56.25%",
          // 16:9
        }}
        image={cover}
        title={data.alt}
      />
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
