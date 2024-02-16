import React, { useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Copyright from "../components/Copyright"
import { FormControl } from "@mui/material"
import RandomWallpaper from "../components/RandomWallpaper"

export default function SignUpSide() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
  })

  const signUp = () => {
    if (password === confirmPassword) {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user
          if (user.displayName && user.photoURL) {
            navigate("/")
          } else {
            navigate("/profile")
          }
        })
        .catch((error) => {
          var errorMessage = error.message
          setError({
            error: true,
            errorMessage,
          })
        })
    } else {
      setError({
        error: true,
        errorMessage: "Password and Confirm password is not equal",
      })
    }
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
            Sign up
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
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              helperText={error.errorMessage}
              error={error.error}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
            />
            <Button
              onClick={signUp}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/sign-in" variant="body2">
                  {"Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  )
}
