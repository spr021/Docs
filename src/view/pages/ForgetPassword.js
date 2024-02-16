import React, { useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import RandomWallpaper from "../components/RandomWallpaper"
import { FormControl } from "@mui/material"
import Copyright from "../components/Copyright"

export default function ForgetPasswordSide() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
  })

  const sendResetPassword = () => {
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/sign-in")
      })
      .catch((error) => {
        var errorMessage = error.message
        setError({
          error: true,
          errorMessage,
        })
      })
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <RandomWallpaper />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            margin: (theme) => theme.spacing(8, 4),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              margin: (theme) => theme.spacing(1),
              backgroundColor: (theme) => theme.palette.secondary.main,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <FormControl
            sx={{
              width: "100%", // Fix IE 11 issue.
              marginTop: (theme) => theme.spacing(1),
            }}
            noValidate
          >
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              helperText={error.errorMessage}
              error={error.error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              onClick={sendResetPassword}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
            >
              Reset Password
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  )
}
