import React from "react"
import { Avatar, Typography, styled } from "@mui/material"

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}))

export default function Profile({ user }) {
  return (
    <>
      <Avatar
        sx={{ mr: (theme) => theme.spacing(2) }}
        alt={user.displayName}
        src={user.photoURL}
      />
      <Title variant="h6" noWrap>
        {user.displayName}
      </Title>
    </>
  )
}
