import React, { useEffect, useState } from "react"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Input,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { getDownloadURL, getStorage, ref } from "firebase/storage"

export default function Preview({
  onSave,
  title,
  setTitle,
  cover,
  setCover,
  user,
}) {
  const [avatar, setAvatar] = useState("")
  const handleUploadClick = (event) => {
    if (event.target.files[0].size < 1000000) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setCover({ ...cover, selectedFile: [reader.result] })
      }

      setCover({
        ...cover,
        mainState: "uploaded",
        selectedFile: event.target.files[0],
        imageUploaded: 1,
        preview: URL.createObjectURL(event.target.files[0]),
        error: false,
      })
    } else {
      event.target.value = ""
      setCover({ ...cover, error: true })
    }
  }

  const removeOnClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const storage = getStorage()
    getDownloadURL(ref(storage, user.photoURL))
      .then((img) => {
        setAvatar(img)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [user.photoURL])

  return (
    <>
      <Box
        sx={{
          p: "16px",
          height: "80vh",
        }}
        flexDirection={"row-reverse"}
        alignItems={"space-between"}
        display="flex"
        justifyContent="space-between"
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          sx={{ BorderLeft: "1px" }}
        >
          <Typography variant="h5">Preview</Typography>
          <Card sx={{ maxWidth: 345, margin: "16px" }}>
            <CardHeader
              avatar={
                <Tooltip
                  onClick={removeOnClick}
                  title={user.displayName}
                  placement="top"
                  arrow
                >
                  <Avatar
                    alt={user.displayName}
                    src={avatar}
                    aria-label="recipe"
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
              title={title.text}
              subheader={new Date().toDateString()}
            />
            <CardMedia
              sx={{
                height: 0,
                paddingTop: "56.25%",
                // 16:9
              }}
              image={cover.preview}
              title={cover.alt}
            />
            <CardActions disableSpacing>
              <IconButton
                onClick={removeOnClick}
                aria-label="add to favorites"
                size="large"
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton
                onClick={removeOnClick}
                aria-label="share"
                size="large"
              >
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          sx={{
            mt: 4,
          }}
        >
          <TextField
            error={title.error}
            required
            onChange={(e) => setTitle({ ...title, text: e.target.value })}
            label="Title"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setCover({ ...cover, alt: e.target.value })}
            label="Cover Description"
            variant="outlined"
          />
          <Input
            inputProps={{ accept: "image/*" }}
            onChange={handleUploadClick}
            sx={{ display: "none" }}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color={cover.error ? "error" : "primary"}
              aria-label="upload picture"
              component="span"
              size="large"
            >
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        sx={{ width: "100px" }}
        onClick={onSave}
      >
        Save
      </Button>
    </>
  )
}
