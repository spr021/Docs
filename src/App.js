import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./view/pages/Home"
import SignIn from "./view/pages/SignIn"
import SignUp from "./view/pages/SignUp"
import ForgetPassword from "./view/pages/ForgetPassword"
import NewDoc from "./view/pages/NewDoc"
import Doc from "./view/pages/Doc"
import Profile from "./view/pages/Profile"
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors"
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewDoc />} />
            <Route path="/docs/:id" element={<Doc />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App
