import React, { useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import RandomWallpaper from "../components/RandomWallpaper"
import { FormControl } from "@mui/material"
import Copyright from "../components/Copyright"

export default function SignInSide() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState({
    error: false,
    errorMessage: "",
  })

  const logIn = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
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
  }

  const logInWithTest = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, "admin@admin.com", "adminadmin")
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
            Sign in
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={logIn}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forget-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
            <Box mt={5} textAlign="center">
              <Button
                onClick={logInWithTest}
                variant="outlined"
                color="primary"
                sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
              >
                Sign In With Test User
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  )
}
