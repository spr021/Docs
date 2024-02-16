import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./view/pages/Home"
import SignIn from "./view/pages/SignIn"
import SignUp from "./view/pages/SignUp"
import ForgetPassword from "./view/pages/ForgetPassword"
import NewDoc from "./view/pages/NewDoc"
import Doc from "./view/pages/Doc"
import Profile from "./view/pages/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewDoc />} />
        <Route path="/doc/:title" element={<Doc />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
