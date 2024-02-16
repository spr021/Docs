import React from "react"
import { Grid, styled } from "@mui/material"

const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundImage: "url(https://source.unsplash.com/random)",
  backgroundRepeat: "no-repeat",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
  backgroundSize: "cover",
  backgroundPosition: "center",
}))

export default function RandomWallpaper() {
  return <StyledGrid item xs={false} sm={4} md={7} />
}
