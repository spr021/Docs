import { HashRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./view/pages/Home"
import SignIn from "./view/pages/SignIn"
import SignUp from "./view/pages/SignUp"
import ForgetPassword from "./view/pages/ForgetPassword"
import NewDoc from "./view/pages/NewDoc"
import Doc from "./view/pages/Doc"
import Profile from "./view/pages/Profile"
import firebase from "./firebase"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/sign-in">
          <SignIn />
        </Route>
        <Route exact path="/sign-up">
          <SignUp />
        </Route>
        <Route exact path="/forget-password">
          <ForgetPassword />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/new">
          <NewDoc />
        </Route>
        <Route exact path="/doc/:title">
          <Doc />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
